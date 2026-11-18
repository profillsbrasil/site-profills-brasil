import { criarArmazemDisco } from '@/lib/armazem/armazem';
import { abrirPglite } from '@/lib/banco/pglite';
import type { Consulta } from '@/lib/banco/tipos';
import {
  PADRAO_CAMINHO_IMAGEM,
  SUFIXO_HASH_IMAGEM
} from '@/lib/schemas/post-blog';

import { ErroBlog } from './erro';
import { MOTIVO_APAGAR_PUBLICADO, SLUGS_RESERVADOS } from './regras';
import { criarRepositorioBlog } from './repositorio';
import type { Post, PostGuardado } from './tipos';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm, utimes } from 'node:fs/promises';
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

const post = (titulo: string) =>
  ({
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
  }) satisfies Post;

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

const PRAZO_PGLITE_SOB_CARGA_MS = 30_000;

beforeAll(async () => {
  consulta = await abrirPglite();
}, PRAZO_PGLITE_SOB_CARGA_MS);

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
      ).rejects.toThrow(/slug_formato|slug_rota_admin/);
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
        versao: 2,
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
        atualizadoEm: '2026-11-15T12:02:00.000Z',
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

  it('a leitura pública trata post publicado fora do formato como inexistente', async () => {
    const repo = repositorio();
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await consulta(
      "insert into blog_posts (slug, versao, estado, criado_em, atualizado_em, publicado_em, conteudo) values ('quebrado', 1, 'publicado', now(), now(), now(), '{\"titulo\": 1}')"
    );

    expect(await repo.lerPublicado('quebrado')).toBeNull();
    expect(aviso).toHaveBeenCalledWith(
      expect.stringContaining('"quebrado"'),
      expect.anything()
    );
    aviso.mockRestore();
  });

  it('a lista pública traz a última edição do post publicado', async () => {
    const repo = repositorio();

    const publicado = await repo.gravar(
      { slug: null, versao: null, post: post('Publicado') },
      'publicar'
    );

    avancar(30);
    await repo.gravar(
      { slug: publicado.slug, versao: 1, post: post('Publicado e corrigido') },
      'salvar'
    );

    expect(await repo.listarPublicados()).toEqual([
      expect.objectContaining({
        publicadoEm: '2026-11-15T12:00:00.000Z',
        atualizadoEm: '2026-11-15T12:30:00.000Z'
      })
    ]);
  });

  it('a lista pública não traz o texto dos posts do banco', async () => {
    const lidas: unknown[] = [];

    const repo = criarRepositorioBlog({
      consulta: async (sql, valores) => {
        const resposta = await consulta(sql, valores);
        lidas.push(...resposta.rows);

        return resposta;
      },
      armazem: criarArmazemDisco(raiz),
      agora: () => agora
    });

    await repo.gravar(
      { slug: null, versao: null, post: post('Publicado') },
      'publicar'
    );
    lidas.length = 0;

    expect(await repo.listarPublicados()).toHaveLength(1);
    expect(JSON.stringify(lidas)).not.toContain('linhas');
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

describe('posts que as migrações gravam', () => {
  let consultaSemente: Consulta;

  beforeAll(async () => {
    consultaSemente = await abrirPglite();
  }, 30_000);

  const abrirSemente = () =>
    criarRepositorioBlog({
      consulta: consultaSemente,
      armazem: criarArmazemDisco(raiz)
    });

  it('entram os 3 de exemplo como rascunho, no formato atual', async () => {
    const semente = abrirSemente();
    const lista = await semente.listar();
    const exemplos = lista.filter((p) => p.slug.startsWith('exemplo-'));

    expect(lista).toHaveLength(11);
    expect(exemplos).toHaveLength(3);
    expect(exemplos.every((p) => p.estado === 'rascunho')).toBe(true);

    for (const { slug } of exemplos) {
      expect(await semente.ler(slug)).toMatchObject({
        versao: 1,
        publicadoEm: null
      });
    }
  });

  it('os 8 do LinkedIn saem publicados, e só eles aparecem na leitura pública', async () => {
    const semente = abrirSemente();
    const publicados = await semente.listarPublicados();

    expect(publicados).toHaveLength(8);
    expect(publicados.some((p) => p.slug.startsWith('exemplo-'))).toBe(false);

    for (const { slug } of publicados) {
      expect(await semente.lerPublicado(slug)).toMatchObject({
        estado: 'publicado',
        versao: 2
      });
    }
  });

  it('os posts do LinkedIn apontam imagens do próprio slug, com o hash que o upload grava', async () => {
    const semente = abrirSemente();
    const lista = await semente.listar();

    const doLinkedin = lista.filter((p) => !p.slug.startsWith('exemplo-'));

    for (const { slug } of doLinkedin) {
      const guardado = await semente.ler(slug);

      const blocos = (guardado?.post.linhas ?? []).flatMap(
        (linha) => linha.colunas
      );

      const imagens = [
        guardado?.post.capa,
        ...blocos.map((bloco) => (bloco.tipo === 'imagem' ? bloco.src : null))
      ].flatMap((caminho) => caminho ?? []);

      expect(imagens.length).toBeGreaterThan(0);

      for (const caminho of imagens) {
        expect(caminho.startsWith(`/blog/${slug}/`)).toBe(true);
        expect(caminho).toMatch(SUFIXO_HASH_IMAGEM);
      }
    }
  });
});

describe('imagens do post', () => {
  const gravarPost = (titulo: string) =>
    repositorio().gravar(
      { slug: null, versao: null, post: post(titulo) },
      'salvar'
    );

  const hash = (bytes: Uint8Array) =>
    createHash('sha256').update(bytes).digest('hex').slice(0, 10);

  it('grava em blog/<slug>/ com nome saneado e o hash do conteúdo', async () => {
    const { slug } = await gravarPost('Fispal');

    const caminho = await repositorio().enviarImagem(
      slug,
      new File([png], '../Estande Ção 01.PNG', { type: 'image/png' })
    );

    expect(caminho).toBe(`/blog/fispal/estande-cao-01-${hash(png)}.png`);
    expect(caminho).toMatch(PADRAO_CAMINHO_IMAGEM);
    expect(caminho).toMatch(SUFIXO_HASH_IMAGEM);
    expect(await readFile(path.join(raiz, caminho.slice(1)))).toEqual(
      Buffer.from(png)
    );
  });

  it('o mesmo arquivo dá o mesmo caminho; outro conteúdo com o mesmo nome dá outro', async () => {
    const repo = repositorio();
    const { slug } = await gravarPost('Fispal');
    const outro = new Uint8Array([...png, 1]);

    const a = await repo.enviarImagem(slug, new File([png], 'foto.png'));
    const b = await repo.enviarImagem(slug, new File([png], 'foto.png'));
    const c = await repo.enviarImagem(slug, new File([outro], 'foto.png'));

    expect(b).toBe(a);
    expect(c).not.toBe(a);
    expect(await readdir(path.join(raiz, 'blog/fispal'))).toHaveLength(2);
  });

  it('dá a extensão pelo conteúdo do arquivo e aceita JPEG, WebP e AVIF', async () => {
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

    expect(await repo.enviarImagem(slug, new File([png], 'foto.webp'))).toBe(
      `/blog/tipos/foto-${hash(png)}.png`
    );
    expect(await repo.enviarImagem(slug, new File([jpeg], 'a'))).toBe(
      `/blog/tipos/a-${hash(jpeg)}.jpg`
    );
    expect(await repo.enviarImagem(slug, new File([webp], 'b'))).toBe(
      `/blog/tipos/b-${hash(webp)}.webp`
    );
    expect(await repo.enviarImagem(slug, new File([avif], '.avif'))).toBe(
      `/blog/tipos/imagem-${hash(avif)}.avif`
    );
  });

  it('lê a imagem gravada com o tipo do nome, e null quando não existe', async () => {
    const repo = repositorio();
    const { slug } = await gravarPost('Leitura');

    const caminho = await repo.enviarImagem(slug, new File([png], 'a.png'));
    const lida = await repo.lerImagem(caminho);

    expect(lida).toMatchObject({ tipo: 'image/png', tamanho: png.length });
    expect(
      lida && new Uint8Array(await new Response(lida.corpo).arrayBuffer())
    ).toEqual(png);
    expect(
      await repo.lerImagem('/blog/leitura/outra-0123456789.png')
    ).toBeNull();
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

describe('imagens no admin', () => {
  const pngCom = (byte: number) => new Uint8Array([...png, byte]);

  it('lista as imagens do armazém com o post da pasta, o tamanho e o uso', async () => {
    const repo = repositorio();

    const salvo = await repo.gravar(
      { slug: null, versao: null, post: post('Fispal') },
      'salvar'
    );

    const [capa, noTexto, solta] = await Promise.all(
      [1, 2, 3].map((byte) =>
        repo.enviarImagem(salvo.slug, new File([pngCom(byte)], `f${byte}.png`))
      )
    );

    await repo.gravar(
      {
        slug: salvo.slug,
        versao: salvo.versao,
        post: {
          ...post('Fispal'),
          capa: capa ?? null,
          linhas: [
            {
              id: 'l1',
              proporcao: 50,
              colunas: [
                { id: 'b1', tipo: 'imagem', src: noTexto ?? null, legenda: '' }
              ]
            }
          ]
        }
      },
      'salvar'
    );

    const armazem = criarArmazemDisco(raiz);

    await armazem.gravar(
      'blog/post-apagado/velha-0123456789.png',
      png,
      'image/png'
    );
    await armazem.gravar('blog/notas.txt', png, 'text/plain');

    const imagens = await repo.listarImagens();

    expect(
      imagens
        .map(({ caminho, slug, tituloDoPost, tamanho, uso }) => ({
          caminho,
          slug,
          tituloDoPost,
          tamanho,
          uso
        }))
        .sort((a, b) => a.caminho.localeCompare(b.caminho))
    ).toEqual([
      ...[
        { caminho: capa, uso: 'capa' },
        { caminho: noTexto, uso: 'texto' },
        { caminho: solta, uso: 'semUso' }
      ]
        .map((imagem) => ({
          ...imagem,
          slug: 'fispal',
          tituloDoPost: 'Fispal',
          tamanho: png.length + 1
        }))
        .sort((a, b) => String(a.caminho).localeCompare(String(b.caminho))),
      {
        caminho: '/blog/post-apagado/velha-0123456789.png',
        slug: 'post-apagado',
        tituloDoPost: null,
        tamanho: png.length,
        uso: 'semUso'
      }
    ]);
    expect(imagens[0]?.arquivo).toBe(imagens[0]?.caminho.split('/').at(-1));
    expect(Number.isNaN(Date.parse(imagens[0]?.enviadaEm ?? ''))).toBe(false);
    expect(await repo.contarImagens()).toBe(4);
  });

  it('com 5.000 imagens, cargas seguidas listam o armazém uma vez até o total vencer', async () => {
    const listar = vi.fn(() =>
      Promise.resolve(
        Array.from({ length: 5_000 }, (_, n) => ({
          chave: `blog/fispal/foto-${n}-0123456789.png`,
          tamanho: 10,
          modificadoEm: new Date('2026-11-15T12:00:00.000Z')
        }))
      )
    );

    const repo = criarRepositorioBlog({
      consulta,
      armazem: { ...criarArmazemDisco(raiz), listar },
      agora: () => agora
    });

    expect(
      await Promise.all([repo.contarImagens(), repo.contarImagens()])
    ).toEqual([5_000, 5_000]);
    expect(await repo.contarImagens()).toBe(5_000);
    expect(listar).toHaveBeenCalledTimes(1);

    avancar(1);

    expect(await repo.contarImagens()).toBe(5_000);
    expect(listar).toHaveBeenCalledTimes(2);
  });

  it('o total sobe com a imagem nova e não com a reenviada, sem listar de novo', async () => {
    const disco = criarArmazemDisco(raiz);
    const listar = vi.fn(disco.listar);

    const repo = criarRepositorioBlog({
      consulta,
      armazem: { ...disco, listar },
      agora: () => agora
    });

    const { slug } = await repo.gravar(
      { slug: null, versao: null, post: post('Fispal') },
      'salvar'
    );

    expect(await repo.contarImagens()).toBe(0);

    await repo.enviarImagem(slug, new File([pngCom(1)], 'a.png'));
    expect(await repo.contarImagens()).toBe(1);

    await repo.enviarImagem(slug, new File([pngCom(1)], 'a.png'));
    expect(await repo.contarImagens()).toBe(1);
    expect(listar).toHaveBeenCalledTimes(1);
  });

  it('reenviar o mesmo arquivo não muda a posição da imagem na lista', async () => {
    const repo = repositorio();

    const { slug } = await repo.gravar(
      { slug: null, versao: null, post: post('Fispal') },
      'salvar'
    );

    const primeira = await repo.enviarImagem(
      slug,
      new File([pngCom(1)], 'a.png')
    );

    const segunda = await repo.enviarImagem(
      slug,
      new File([pngCom(2)], 'b.png')
    );

    const envelhecer = (caminho: string, minutos: number) => {
      const quando = new Date(Date.now() - minutos * 60_000);

      return utimes(path.join(raiz, caminho.slice(1)), quando, quando);
    };

    await envelhecer(primeira, 2);
    await envelhecer(segunda, 1);
    await repo.enviarImagem(slug, new File([pngCom(1)], 'a.png'));

    expect((await repo.listarImagens()).map((i) => i.caminho)).toEqual([
      segunda,
      primeira
    ]);
  });

  it('sem imagem no armazém, a lista vem vazia e o total é 0', async () => {
    expect(await repositorio().listarImagens()).toEqual([]);
    expect(await repositorio().contarImagens()).toBe(0);
  });

  it('com o armazém fora, a contagem da lateral vira null e a lista lança', async () => {
    const listar = vi.fn(() => Promise.reject(new Error('fora')));

    const fora = criarRepositorioBlog({
      consulta,
      armazem: {
        gravar: () => Promise.reject(new Error('fora')),
        ler: () => Promise.reject(new Error('fora')),
        listar,
        apagar: () => Promise.reject(new Error('fora'))
      },
      agora: () => agora
    });

    vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(await fora.contarImagens()).toBeNull();
    expect(await fora.contarImagens()).toBeNull();
    expect(listar).toHaveBeenCalledTimes(1);
    await expect(fora.listarImagens()).rejects.toThrow('fora');
  });
});

describe('apagar rascunho', () => {
  const pngDe = (byte: number) => new Uint8Array([...png, byte]);

  async function rascunhoComImagens(
    repo: ReturnType<typeof criarRepositorioBlog>,
    titulo: string
  ) {
    const salvo = await repo.gravar(
      { slug: null, versao: null, post: post(titulo) },
      'salvar'
    );

    const capa = await repo.enviarImagem(
      salvo.slug,
      new File([pngDe(1)], 'capa.png')
    );

    const noTexto = await repo.enviarImagem(
      salvo.slug,
      new File([pngDe(2)], 'texto.png')
    );

    const guardado = await repo.gravar(
      {
        slug: salvo.slug,
        versao: salvo.versao,
        post: {
          ...post(titulo),
          capa,
          linhas: [
            {
              id: 'l1',
              proporcao: 50,
              colunas: [{ id: 'b1', tipo: 'imagem', src: noTexto, legenda: '' }]
            }
          ]
        }
      },
      'salvar'
    );

    return { guardado, capa, noTexto };
  }

  const pedido = ({ slug, versao }: PostGuardado) => ({ slug, versao });

  it('apaga o rascunho e as imagens da pasta dele', async () => {
    const repo = repositorio();
    const { guardado } = await rascunhoComImagens(repo, 'Fispal');

    expect(await repo.apagarRascunho(pedido(guardado))).toEqual({
      apagadas: 2,
      falharam: 0
    });
    expect(await repo.ler(guardado.slug)).toBeNull();
    expect(await repo.listar()).toEqual([]);
    expect(await repo.listarImagens()).toEqual([]);
  });

  it('recusa post publicado, mesmo na versão certa, e não apaga nada', async () => {
    const repo = repositorio();
    const { guardado } = await rascunhoComImagens(repo, 'Fispal');

    const publicado = await repo.gravar(
      { slug: guardado.slug, versao: guardado.versao, post: guardado.post },
      'publicar'
    );

    await expect(repo.apagarRascunho(pedido(publicado))).rejects.toThrow(
      MOTIVO_APAGAR_PUBLICADO
    );
    expect((await repo.ler(guardado.slug))?.estado).toBe('publicado');
    expect(await repo.listarImagens()).toHaveLength(2);
  });

  it('recusa a versão antiga com o aviso de outra aba e não apaga nada', async () => {
    const repo = repositorio();
    const { guardado } = await rascunhoComImagens(repo, 'Fispal');

    await repo.gravar(
      { slug: guardado.slug, versao: guardado.versao, post: guardado.post },
      'salvar'
    );

    await expect(repo.apagarRascunho(pedido(guardado))).rejects.toThrow(
      'outra aba'
    );
    expect(await repo.ler(guardado.slug)).not.toBeNull();
    expect(await repo.listarImagens()).toHaveLength(2);
  });

  it('mantém a imagem da pasta que outro post usa', async () => {
    const repo = repositorio();
    const { guardado, capa } = await rascunhoComImagens(repo, 'Fispal');

    await repo.gravar(
      { slug: null, versao: null, post: { ...post('Recesso'), capa } },
      'salvar'
    );

    expect(await repo.apagarRascunho(pedido(guardado))).toEqual({
      apagadas: 1,
      falharam: 0
    });
    expect(
      (await repo.listarImagens()).map(({ caminho, uso }) => ({ caminho, uso }))
    ).toEqual([{ caminho: capa, uso: 'capa' }]);
  });

  it('com o armazém falhando no meio, o post sai e as imagens que ficaram aparecem sem uso; repetir termina', async () => {
    const disco = criarArmazemDisco(raiz);
    const { guardado } = await rascunhoComImagens(repositorio(), 'Fispal');

    const falhaNaPrimeira = criarRepositorioBlog({
      consulta,
      armazem: {
        ...disco,
        apagar: async (chaves) => {
          await disco.apagar(chaves.slice(1));

          return chaves.slice(0, 1);
        }
      },
      agora: () => agora
    });

    expect(await falhaNaPrimeira.apagarRascunho(pedido(guardado))).toEqual({
      apagadas: 1,
      falharam: 1
    });
    expect(await falhaNaPrimeira.ler(guardado.slug)).toBeNull();
    expect(
      (await falhaNaPrimeira.listarImagens()).map(({ uso, tituloDoPost }) => ({
        uso,
        tituloDoPost
      }))
    ).toEqual([{ uso: 'semUso', tituloDoPost: null }]);

    expect(await repositorio().apagarRascunho(pedido(guardado))).toEqual({
      apagadas: 1,
      falharam: 0
    });
    expect(await repositorio().apagarRascunho(pedido(guardado))).toEqual({
      apagadas: 0,
      falharam: 0
    });
    expect(await repositorio().listarImagens()).toEqual([]);
  });

  it('com o armazém fora, o post sai e as imagens contam como falha', async () => {
    const { guardado } = await rascunhoComImagens(repositorio(), 'Fispal');

    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const semApagar = criarRepositorioBlog({
      consulta,
      armazem: {
        ...criarArmazemDisco(raiz),
        apagar: () => Promise.reject(new Error('fora'))
      },
      agora: () => agora
    });

    expect(await semApagar.apagarRascunho(pedido(guardado))).toEqual({
      apagadas: 0,
      falharam: 2
    });
    expect(await semApagar.ler(guardado.slug)).toBeNull();
    expect(await repositorio().listarImagens()).toHaveLength(2);
  });

  it('com o armazém sem listar a pasta, o post sai e o resultado é null', async () => {
    const { guardado } = await rascunhoComImagens(repositorio(), 'Fispal');

    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const semListar = criarRepositorioBlog({
      consulta,
      armazem: {
        ...criarArmazemDisco(raiz),
        listar: () => Promise.reject(new Error('fora'))
      },
      agora: () => agora
    });

    expect(await semListar.apagarRascunho(pedido(guardado))).toBeNull();
    expect(await semListar.ler(guardado.slug)).toBeNull();
  });

  it('tira do total guardado da lateral as imagens apagadas', async () => {
    const repo = repositorio();
    const { guardado } = await rascunhoComImagens(repo, 'Fispal');

    expect(await repo.contarImagens()).toBe(2);

    await repo.apagarRascunho(pedido(guardado));

    expect(await repo.contarImagens()).toBe(0);
  });

  it('não apaga a pasta de outro post cujo slug começa igual', async () => {
    const repo = repositorio();
    const { guardado } = await rascunhoComImagens(repo, 'Feira');
    const vizinho = await rascunhoComImagens(repo, 'Feira Fispal');

    await repo.enviarImagem(
      vizinho.guardado.slug,
      new File([pngDe(3)], 'solta.png')
    );

    expect(await repo.apagarRascunho(pedido(guardado))).toEqual({
      apagadas: 2,
      falharam: 0
    });
    expect((await repo.listarImagens()).map((imagem) => imagem.slug)).toEqual(
      Array(3).fill('feira-fispal')
    );
  });

  it('recusa quando outra aba grava entre a leitura e o delete, sem tocar nas imagens', async () => {
    const { guardado } = await rascunhoComImagens(repositorio(), 'Fispal');

    await repositorio().enviarImagem(
      guardado.slug,
      new File([pngDe(3)], 'solta.png')
    );

    const comCorrida = criarRepositorioBlog({
      consulta: async (sql, valores) => {
        if (sql.startsWith('delete')) {
          await consulta(
            'update blog_posts set versao = versao + 1 where slug = $1',
            [guardado.slug]
          );
        }

        return consulta(sql, valores);
      },
      armazem: criarArmazemDisco(raiz),
      agora: () => agora
    });

    await expect(comCorrida.apagarRascunho(pedido(guardado))).rejects.toThrow(
      'outra aba'
    );
    expect(await repositorio().ler(guardado.slug)).not.toBeNull();
    expect(await repositorio().listarImagens()).toHaveLength(3);
  });
});
