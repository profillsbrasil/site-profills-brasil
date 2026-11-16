// @vitest-environment node
import { criarArmazemDisco } from '@/lib/armazem/armazem';
import { abrirPglite } from '@/lib/banco/pglite';
import type { Consulta } from '@/lib/banco/tipos';

import { ErroBlog } from './erro';
import { SLUGS_RESERVADOS } from './regras';
import { criarRepositorioBlog } from './repositorio';
import type { Post } from './tipos';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

const post = (titulo: string): Post => ({
  assunto: 'nota',
  titulo,
  resumo: 'Resumo',
  capa: null,
  linhas: [
    {
      id: 'l1',
      colunas: [{ id: 'b1', tipo: 'paragrafo', texto: 'Texto' }],
      proporcao: 50
    }
  ]
});

const png = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0
]);

let consulta: Consulta;
let raiz: string;
let agora: Date;

const repositorio = () =>
  criarRepositorioBlog({
    consulta,
    armazem: criarArmazemDisco(raiz),
    agora: () => agora
  });

const avancar = (minutos: number) => {
  agora = new Date(agora.getTime() + minutos * 60_000);
};

// O PGlite leva segundos para abrir com a suíte inteira rodando em paralelo.
beforeAll(async () => {
  consulta = await abrirPglite();
}, 30_000);

beforeEach(async () => {
  await consulta('delete from blog_posts');
  raiz = await mkdtemp(path.join(tmpdir(), 'blog-armazem-'));
  agora = new Date('2026-11-15T12:00:00.000Z');
});

afterEach(async () => {
  await rm(raiz, { recursive: true, force: true });
});

describe('repositório de posts no Postgres', () => {
  it('grava um rascunho novo com slug do título, versão 1, e lê de volta', async () => {
    const repo = repositorio();

    const salvo = await repo.gravar(
      { slug: null, versao: null, post: post('Catálogo 2026 já está no ar') },
      'salvar'
    );

    expect(salvo).toEqual({
      slug: 'catalogo-2026-ja-esta-no-ar',
      versao: 1,
      estado: 'rascunho',
      criadoEm: '2026-11-15T12:00:00.000Z',
      atualizadoEm: '2026-11-15T12:00:00.000Z',
      publicadoEm: null,
      post: post('Catálogo 2026 já está no ar')
    });
    expect(await repo.ler(salvo.slug)).toEqual(salvo);
  });

  it('regrava o mesmo post sem mudar slug nem criação e sobe a versão', async () => {
    const repo = repositorio();

    const primeiro = await repo.gravar(
      { slug: null, versao: null, post: post('Feira') },
      'salvar'
    );

    avancar(5);

    const segundo = await repo.gravar(
      { slug: 'feira', versao: 1, post: post('Feira Fispal com título novo') },
      'salvar'
    );

    expect(segundo).toMatchObject({
      slug: 'feira',
      versao: 2,
      criadoEm: primeiro.criadoEm,
      atualizadoEm: '2026-11-15T12:05:00.000Z',
      post: { titulo: 'Feira Fispal com título novo' }
    });
    expect(await repo.listar()).toHaveLength(1);
  });

  it('recusa a gravação da aba que abriu o post antes da última gravação', async () => {
    const repo = repositorio();

    const aberto = await repo.gravar(
      { slug: null, versao: null, post: post('Feira') },
      'salvar'
    );

    await repo.gravar(
      { slug: aberto.slug, versao: aberto.versao, post: post('Feira, aba A') },
      'salvar'
    );

    await expect(
      repo.gravar(
        {
          slug: aberto.slug,
          versao: aberto.versao,
          post: post('Feira, aba B')
        },
        'salvar'
      )
    ).rejects.toThrow('outra aba');
    expect((await repo.ler(aberto.slug))?.post.titulo).toBe('Feira, aba A');
  });

  it('deixa só uma de duas gravações simultâneas da mesma versão passar', async () => {
    const repo = repositorio();

    const aberto = await repo.gravar(
      { slug: null, versao: null, post: post('Feira') },
      'salvar'
    );

    const resultados = await Promise.allSettled(
      ['A', 'B'].map((aba) =>
        repo.gravar(
          { slug: aberto.slug, versao: 1, post: post(`Feira ${aba}`) },
          'salvar'
        )
      )
    );

    expect(resultados.map((r) => r.status).toSorted()).toEqual([
      'fulfilled',
      'rejected'
    ]);
    expect((await repo.ler(aberto.slug))?.versao).toBe(2);
  });

  it('dá sufixo ao slug quando o título repete', async () => {
    const repo = repositorio();

    const novo = () =>
      repo.gravar(
        { slug: null, versao: null, post: post('Recesso') },
        'salvar'
      );

    const a = await novo();
    const b = await novo();
    const c = await novo();

    expect([a.slug, b.slug, c.slug]).toEqual([
      'recesso',
      'recesso-2',
      'recesso-3'
    ]);
  });

  it('não usa o slug novo, que é o endereço do editor de post novo', async () => {
    const salvo = await repositorio().gravar(
      { slug: null, versao: null, post: post('Novo') },
      'salvar'
    );

    expect(salvo.slug).toBe('novo-2');
  });

  it('o banco recusa cada slug reservado, mesmo inserido direto', async () => {
    for (const slug of SLUGS_RESERVADOS) {
      await expect(
        consulta(
          "insert into blog_posts (slug, versao, estado, criado_em, atualizado_em, conteudo) values ($1, 1, 'rascunho', now(), now(), '{}')",
          [slug]
        )
      ).rejects.toThrow('slug_formato');
    }
  });

  it('lista do atualizado mais recente para o mais antigo, sem as linhas do post', async () => {
    const repo = repositorio();

    const novo = (titulo: string) =>
      repo.gravar({ slug: null, versao: null, post: post(titulo) }, 'salvar');

    await novo('Antigo');
    avancar(1);
    await novo('Meio');
    avancar(1);
    await novo('Recente');
    avancar(1);
    await repo.gravar(
      { slug: 'antigo', versao: 1, post: post('Antigo editado') },
      'salvar'
    );

    expect(await repo.listar()).toEqual([
      {
        slug: 'antigo',
        estado: 'rascunho',
        atualizadoEm: '2026-11-15T12:03:00.000Z',
        titulo: 'Antigo editado',
        assunto: 'nota'
      },
      expect.objectContaining({ slug: 'recente' }),
      expect.objectContaining({ slug: 'meio' })
    ]);
  });

  it('publica com data, regrava publicado e despublica de volta', async () => {
    const repo = repositorio();

    const { slug } = await repo.gravar(
      { slug: null, versao: null, post: post('GT') },
      'salvar'
    );

    avancar(10);

    const publicado = await repo.gravar(
      { slug, versao: 1, post: post('GT') },
      'publicar'
    );

    expect(publicado).toMatchObject({
      estado: 'publicado',
      versao: 2,
      publicadoEm: '2026-11-15T12:10:00.000Z'
    });

    avancar(10);
    expect(
      await repo.gravar({ slug, versao: 2, post: post('GT nova') }, 'salvar')
    ).toMatchObject({
      estado: 'publicado',
      publicadoEm: '2026-11-15T12:10:00.000Z'
    });

    expect(
      await repo.gravar(
        { slug, versao: 3, post: post('GT nova') },
        'despublicar'
      )
    ).toMatchObject({ estado: 'rascunho', publicadoEm: null, versao: 4 });
    expect((await repo.ler(slug))?.estado).toBe('rascunho');
  });

  it('publica um post novo direto, numa gravação só', async () => {
    const salvo = await repositorio().gravar(
      { slug: null, versao: null, post: post('Lançamento') },
      'publicar'
    );

    expect(salvo).toMatchObject({
      estado: 'publicado',
      versao: 1,
      publicadoEm: '2026-11-15T12:00:00.000Z'
    });
  });

  it('a leitura pública só vê posts publicados', async () => {
    const repo = repositorio();

    await repo.gravar(
      { slug: null, versao: null, post: post('Rascunho') },
      'salvar'
    );
    avancar(1);
    await repo.gravar(
      { slug: null, versao: null, post: post('Velho') },
      'publicar'
    );
    avancar(1);
    await repo.gravar(
      { slug: null, versao: null, post: post('Novo post') },
      'publicar'
    );

    expect(await repo.listarPublicados()).toEqual([
      {
        slug: 'novo-post',
        publicadoEm: '2026-11-15T12:02:00.000Z',
        titulo: 'Novo post',
        resumo: 'Resumo',
        assunto: 'nota',
        capa: null
      },
      expect.objectContaining({ slug: 'velho' })
    ]);
    expect(await repo.lerPublicado('rascunho')).toBeNull();
    expect((await repo.lerPublicado('velho'))?.post.titulo).toBe('Velho');
    expect(await repo.lerPublicado('nao-existe')).toBeNull();
  });

  it('pula linha fora do formato na lista sem derrubar as outras', async () => {
    const repo = repositorio();
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await repo.gravar(
      { slug: null, versao: null, post: post('Bom') },
      'salvar'
    );
    await consulta(
      "insert into blog_posts (slug, versao, estado, criado_em, atualizado_em, conteudo) values ('quebrado', 1, 'rascunho', now(), now(), '{\"titulo\": 1}')"
    );

    expect((await repo.listar()).map((p) => p.slug)).toEqual(['bom']);
    await expect(repo.ler('quebrado')).rejects.toBeInstanceOf(ErroBlog);
    aviso.mockRestore();
  });

  it('recusa gravar por cima de um slug que não existe', async () => {
    await expect(
      repositorio().gravar(
        { slug: 'nao-existe', versao: 1, post: post('X') },
        'salvar'
      )
    ).rejects.toThrow('não existe mais');
  });
});

describe('posts de exemplo da migração 0001', { timeout: 30_000 }, () => {
  it('entram os três como rascunho, no formato atual', async () => {
    const semente = criarRepositorioBlog({
      consulta: await abrirPglite(),
      armazem: criarArmazemDisco(raiz)
    });

    const lista = await semente.listar();

    expect(lista).toHaveLength(3);
    expect(lista.every((p) => p.estado === 'rascunho')).toBe(true);

    for (const { slug } of lista) {
      expect(await semente.ler(slug)).toMatchObject({
        versao: 1,
        publicadoEm: null
      });
    }
  });
});

describe('imagens do post', () => {
  const gravarPost = (titulo: string) =>
    repositorio().gravar(
      { slug: null, versao: null, post: post(titulo) },
      'salvar'
    );

  it('grava em blog/<slug>/ com nome saneado e devolve o caminho público', async () => {
    const { slug } = await gravarPost('Fispal');

    const caminho = await repositorio().enviarImagem(
      slug,
      new File([png], '../Estande Ção 01.PNG', { type: 'image/png' })
    );

    expect(caminho).toBe('/blog/fispal/estande-cao-01.png');
    expect(
      await readFile(path.join(raiz, 'blog/fispal/estande-cao-01.png'))
    ).toEqual(Buffer.from(png));
  });

  it('dá a extensão pelo conteúdo do arquivo e não sobrescreve outra imagem', async () => {
    const repo = repositorio();
    const { slug } = await gravarPost('Fispal');

    const a = await repo.enviarImagem(slug, new File([png], 'foto.webp'));
    const b = await repo.enviarImagem(slug, new File([png], 'foto.png'));

    expect([a, b]).toEqual([
      '/blog/fispal/foto.png',
      '/blog/fispal/foto-2.png'
    ]);
    expect(await readdir(path.join(raiz, 'blog/fispal'))).toHaveLength(2);
  });

  it('aceita JPEG, WebP e AVIF pelos bytes iniciais', async () => {
    const repo = repositorio();
    const { slug } = await gravarPost('Tipos');
    const ascii = (texto: string) => new TextEncoder().encode(texto);
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0]);

    const webp = new Uint8Array([
      ...ascii('RIFF'),
      0,
      0,
      0,
      0,
      ...ascii('WEBPVP8 ')
    ]);

    const avif = new Uint8Array([0, 0, 0, 0x1c, ...ascii('ftypavif'), 0, 0]);

    expect(await repo.enviarImagem(slug, new File([jpeg], 'a'))).toBe(
      '/blog/tipos/a.jpg'
    );
    expect(await repo.enviarImagem(slug, new File([webp], 'b'))).toBe(
      '/blog/tipos/b.webp'
    );
    expect(await repo.enviarImagem(slug, new File([avif], 'c'))).toBe(
      '/blog/tipos/c.avif'
    );
  });

  it('recusa arquivo que não é PNG, JPEG, WebP ou AVIF, mesmo com MIME de imagem', async () => {
    const { slug } = await gravarPost('Gif');
    const gif = new TextEncoder().encode('GIF89a......');

    await expect(
      repositorio().enviarImagem(
        slug,
        new File([gif], 'a.png', { type: 'image/png' })
      )
    ).rejects.toThrow('PNG, JPEG, WebP ou AVIF');
  });

  it('recusa imagem acima de 5 MB', async () => {
    const { slug } = await gravarPost('Grande');
    const grande = new Uint8Array(5 * 1024 * 1024 + 1);

    grande.set(png);

    await expect(
      repositorio().enviarImagem(slug, new File([grande], 'grande.png'))
    ).rejects.toThrow('5 MB');
  });

  it('recusa imagem de post que ainda não foi gravado', async () => {
    await expect(
      repositorio().enviarImagem('sem-post', new File([png], 'a.png'))
    ).rejects.toBeInstanceOf(ErroBlog);
  });
});

describe('armazém em disco', () => {
  it('recusa chave que sai da pasta', async () => {
    const armazem = criarArmazemDisco(raiz);

    await expect(armazem.gravar('../fora.png', png)).rejects.toThrow(
      'fora do armazém'
    );
    await expect(armazem.ler('blog/../../fora.png')).rejects.toThrow(
      'fora do armazém'
    );
  });
});
