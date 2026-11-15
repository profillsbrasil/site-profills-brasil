// @vitest-environment node
import { ErroBlog } from './erro';
import { criarRepositorioArquivo } from './repositorio';
import type { Post } from './tipos';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

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

let raiz: string;
let agora: Date;

const repositorio = () =>
  criarRepositorioArquivo(
    {
      posts: path.join(raiz, 'conteudo/blog/posts'),
      imagens: path.join(raiz, 'public/blog')
    },
    () => agora
  );

const avancar = (minutos: number) => {
  agora = new Date(agora.getTime() + minutos * 60_000);
};

beforeEach(async () => {
  raiz = await mkdtemp(path.join(tmpdir(), 'blog-repositorio-'));
  agora = new Date('2026-11-15T12:00:00.000Z');
});

afterEach(async () => {
  await rm(raiz, { recursive: true, force: true });
});

describe('repositório de posts em arquivo', () => {
  it('grava um rascunho novo com slug do título e lê de volta', async () => {
    const repo = repositorio();

    const salvo = await repo.salvarPost({
      slug: null,
      post: post('Catálogo 2026 já está no ar')
    });

    expect(salvo).toMatchObject({
      slug: 'catalogo-2026-ja-esta-no-ar',
      estado: 'rascunho',
      criadoEm: '2026-11-15T12:00:00.000Z',
      atualizadoEm: '2026-11-15T12:00:00.000Z',
      publicadoEm: null
    });
    expect(await repo.lerPost(salvo.slug)).toEqual(salvo);
  });

  it('grava JSON indentado, com chaves em ordem fixa, num arquivo por post', async () => {
    const repo = repositorio();
    const { slug } = await repo.salvarPost({ slug: null, post: post('Aviso') });

    const texto = await readFile(
      path.join(raiz, 'conteudo/blog/posts', `${slug}.json`),
      'utf8'
    );

    expect(
      texto.startsWith('{\n  "slug": "aviso",\n  "estado": "rascunho",')
    ).toBe(true);
    expect(texto.endsWith('}\n')).toBe(true);
  });

  it('regrava o mesmo post sem mudar slug nem data de criação', async () => {
    const repo = repositorio();
    const primeiro = await repo.salvarPost({ slug: null, post: post('Feira') });

    avancar(5);

    const segundo = await repo.salvarPost({
      slug: primeiro.slug,
      post: post('Feira Fispal com título novo')
    });

    expect(segundo.slug).toBe('feira');
    expect(segundo.criadoEm).toBe(primeiro.criadoEm);
    expect(segundo.atualizadoEm).toBe('2026-11-15T12:05:00.000Z');
    expect(segundo.post.titulo).toBe('Feira Fispal com título novo');
    expect(await repo.listarPosts()).toHaveLength(1);
  });

  it('dá sufixo ao slug quando o título repete', async () => {
    const repo = repositorio();

    const a = await repo.salvarPost({ slug: null, post: post('Recesso') });
    const b = await repo.salvarPost({ slug: null, post: post('Recesso') });
    const c = await repo.salvarPost({ slug: null, post: post('Recesso') });

    expect([a.slug, b.slug, c.slug]).toEqual([
      'recesso',
      'recesso-2',
      'recesso-3'
    ]);
  });

  it('não usa o slug novo, que é o endereço do editor de post novo', async () => {
    const repo = repositorio();

    const salvo = await repo.salvarPost({ slug: null, post: post('Novo') });

    expect(salvo.slug).toBe('novo-2');
  });

  it('lista do atualizado mais recente para o mais antigo', async () => {
    const repo = repositorio();
    const antigo = await repo.salvarPost({ slug: null, post: post('Antigo') });

    avancar(1);
    await repo.salvarPost({ slug: null, post: post('Meio') });
    avancar(1);
    await repo.salvarPost({ slug: null, post: post('Recente') });
    avancar(1);
    await repo.salvarPost({ slug: antigo.slug, post: post('Antigo editado') });

    expect((await repo.listarPosts()).map((p) => p.slug)).toEqual([
      'antigo',
      'recente',
      'meio'
    ]);
  });

  it('publica com data e despublica de volta para rascunho', async () => {
    const repo = repositorio();
    const { slug } = await repo.salvarPost({ slug: null, post: post('GT') });

    avancar(10);
    const publicado = await repo.publicarPost(slug);

    expect(publicado).toMatchObject({
      estado: 'publicado',
      publicadoEm: '2026-11-15T12:10:00.000Z'
    });
    expect(await repo.lerPost(slug)).toEqual(publicado);

    avancar(10);
    const regravado = await repo.salvarPost({ slug, post: post('GT nova') });

    expect(regravado).toMatchObject({
      estado: 'publicado',
      publicadoEm: '2026-11-15T12:10:00.000Z'
    });

    const rascunho = await repo.despublicarPost(slug);

    expect(rascunho).toMatchObject({ estado: 'rascunho', publicadoEm: null });
    expect((await repo.lerPost(slug))?.estado).toBe('rascunho');
  });

  it('apaga o post e devolve null ao ler depois', async () => {
    const repo = repositorio();

    const { slug } = await repo.salvarPost({
      slug: null,
      post: post('Apagar')
    });

    await repo.apagarPost(slug);
    await repo.apagarPost(slug);

    expect(await repo.lerPost(slug)).toBeNull();
    expect(await repo.listarPosts()).toEqual([]);
  });

  it('lista vazia quando a pasta ainda não existe', async () => {
    expect(await repositorio().listarPosts()).toEqual([]);
  });

  it('pula arquivo corrompido na lista sem derrubar os outros', async () => {
    const repo = repositorio();
    await repo.salvarPost({ slug: null, post: post('Bom') });
    const pasta = path.join(raiz, 'conteudo/blog/posts');

    await writeFile(path.join(pasta, 'quebrado.json'), '{ "slug": ');
    await writeFile(path.join(pasta, 'invalido.json'), '{"slug":"invalido"}');
    await writeFile(
      path.join(pasta, 'outro-nome.json'),
      await readFile(path.join(pasta, 'bom.json'), 'utf8')
    );

    expect((await repo.listarPosts()).map((p) => p.slug)).toEqual(['bom']);
    await expect(repo.lerPost('quebrado')).rejects.toBeInstanceOf(ErroBlog);
  });

  it('recusa gravar por cima de um slug que não existe', async () => {
    await expect(
      repositorio().salvarPost({ slug: 'nao-existe', post: post('X') })
    ).rejects.toBeInstanceOf(ErroBlog);
  });

  it('recusa slug malicioso em toda operação, sem tocar fora da pasta', async () => {
    const repo = repositorio();
    const fora = path.join(raiz, 'fora.json');
    await writeFile(fora, '{}');

    for (const slug of ['../fora', '..', 'a/b', 'A', 'a.json', '%2e%2e']) {
      await expect(repo.lerPost(slug)).rejects.toBeInstanceOf(ErroBlog);
      await expect(
        repo.salvarPost({ slug, post: post('X') })
      ).rejects.toBeInstanceOf(ErroBlog);
      await expect(repo.publicarPost(slug)).rejects.toBeInstanceOf(ErroBlog);
      await expect(repo.despublicarPost(slug)).rejects.toBeInstanceOf(ErroBlog);
      await expect(repo.apagarPost(slug)).rejects.toBeInstanceOf(ErroBlog);
      await expect(
        repo.salvarImagem(slug, new File([png], 'foto.png'))
      ).rejects.toBeInstanceOf(ErroBlog);
    }

    expect(await readFile(fora, 'utf8')).toBe('{}');
  });
});

describe('posts commitados', () => {
  it('todo arquivo em conteudo/blog/posts abre no formato atual', async () => {
    const pasta = path.join(process.cwd(), 'conteudo/blog/posts');
    const arquivos = (await readdir(pasta)).filter((n) => n.endsWith('.json'));
    const repo = criarRepositorioArquivo({ posts: pasta, imagens: raiz });

    expect(arquivos.length).toBeGreaterThan(0);
    expect(await repo.listarPosts()).toHaveLength(arquivos.length);
  });
});

describe('imagens do post', () => {
  it('grava em public/blog/<slug>/ com nome saneado e devolve o caminho público', async () => {
    const repo = repositorio();

    const { slug } = await repo.salvarPost({
      slug: null,
      post: post('Fispal')
    });

    const caminho = await repo.salvarImagem(
      slug,
      new File([png], '../Estande Ção 01.PNG', { type: 'image/png' })
    );

    expect(caminho).toBe('/blog/fispal/estande-cao-01.png');
    expect(
      await readFile(path.join(raiz, 'public/blog/fispal/estande-cao-01.png'))
    ).toEqual(Buffer.from(png));
  });

  it('dá a extensão pelo conteúdo do arquivo e não sobrescreve outra imagem', async () => {
    const repo = repositorio();

    const { slug } = await repo.salvarPost({
      slug: null,
      post: post('Fispal')
    });

    const a = await repo.salvarImagem(slug, new File([png], 'foto.webp'));
    const b = await repo.salvarImagem(slug, new File([png], 'foto.png'));

    expect([a, b]).toEqual([
      '/blog/fispal/foto.png',
      '/blog/fispal/foto-2.png'
    ]);
    expect(await readdir(path.join(raiz, 'public/blog/fispal'))).toHaveLength(
      2
    );
  });

  it('aceita JPEG, WebP e AVIF pelos bytes iniciais', async () => {
    const repo = repositorio();
    const { slug } = await repo.salvarPost({ slug: null, post: post('Tipos') });
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

    expect(await repo.salvarImagem(slug, new File([jpeg], 'a'))).toBe(
      '/blog/tipos/a.jpg'
    );
    expect(await repo.salvarImagem(slug, new File([webp], 'b'))).toBe(
      '/blog/tipos/b.webp'
    );
    expect(await repo.salvarImagem(slug, new File([avif], 'c'))).toBe(
      '/blog/tipos/c.avif'
    );
  });

  it('recusa arquivo que não é PNG, JPEG, WebP ou AVIF, mesmo com MIME de imagem', async () => {
    const repo = repositorio();
    const { slug } = await repo.salvarPost({ slug: null, post: post('Gif') });
    const gif = new TextEncoder().encode('GIF89a......');

    await expect(
      repo.salvarImagem(slug, new File([gif], 'a.png', { type: 'image/png' }))
    ).rejects.toThrow('PNG, JPEG, WebP ou AVIF');
  });

  it('recusa imagem acima de 5 MB', async () => {
    const repo = repositorio();

    const { slug } = await repo.salvarPost({
      slug: null,
      post: post('Grande')
    });

    const grande = new Uint8Array(5 * 1024 * 1024 + 1);
    grande.set(png);

    await expect(
      repo.salvarImagem(slug, new File([grande], 'grande.png'))
    ).rejects.toThrow('5 MB');
  });

  it('recusa imagem de post que ainda não foi gravado', async () => {
    await expect(
      repositorio().salvarImagem('sem-post', new File([png], 'a.png'))
    ).rejects.toBeInstanceOf(ErroBlog);
  });
});
