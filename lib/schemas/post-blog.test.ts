import type { Post, PostGuardado } from '@/lib/blog/tipos';

import {
  entradaEditorSchema,
  postGuardadoSchema,
  postSchema,
  slugSchema
} from './post-blog';
import { describe, expect, it } from 'vitest';

const post: Post = {
  assunto: 'evento',
  titulo: 'Profills na Fispal 2026',
  resumo: 'Estande com a envasadora gable top funcionando.',
  capa: '/blog/profills-na-fispal-2026/capa.webp',
  linhas: [
    {
      id: 'l1',
      colunas: [
        { id: 'b1', tipo: 'paragrafo', texto: 'Texto' },
        {
          id: 'b2',
          tipo: 'imagem',
          src: '/blog/profills-na-fispal-2026/estande.jpg',
          legenda: ''
        }
      ],
      proporcao: 60
    }
  ]
};

const guardado: PostGuardado = {
  slug: 'profills-na-fispal-2026',
  versao: 2,
  estado: 'publicado',
  criadoEm: '2026-11-10T12:00:00.000Z',
  atualizadoEm: '2026-11-11T12:00:00.000Z',
  publicadoEm: '2026-11-11T12:00:00.000Z',
  post
};

/** Bloco como chega do cliente, antes do schema: qualquer tipo e qualquer campo. */
type BlocoCru = { id: string; tipo: string; [campo: string]: string | null };

const comBloco = (bloco: BlocoCru) => ({
  ...post,
  linhas: [{ id: 'l1', colunas: [bloco], proporcao: 50 }]
});

describe('postSchema', () => {
  it('aceita um post com imagem no caminho público do blog', () => {
    expect(postSchema.parse(post)).toEqual(post);
  });

  it('recusa imagem em blob: ou fora de /blog/', () => {
    for (const src of [
      'blob:http://localhost:3000/abc',
      '/images/foto.webp',
      '/blog/../segredo.webp',
      '/blog/post/foto.exe'
    ]) {
      expect(
        postSchema.safeParse(
          comBloco({ id: 'b', tipo: 'imagem', src, legenda: '' })
        ).success
      ).toBe(false);
      expect(postSchema.safeParse({ ...post, capa: src }).success).toBe(false);
    }
  });

  it('recusa assunto, tipo de bloco e proporção fora do domínio', () => {
    expect(postSchema.safeParse({ ...post, assunto: 'politica' }).success).toBe(
      false
    );
    expect(
      postSchema.safeParse(comBloco({ id: 'b', tipo: 'script', texto: '' }))
        .success
    ).toBe(false);
    expect(
      postSchema.safeParse({
        ...post,
        linhas: [{ ...post.linhas[0], proporcao: 90 }]
      }).success
    ).toBe(false);
  });

  it('recusa linha com três colunas', () => {
    const bloco = { id: 'b', tipo: 'titulo', texto: '' };

    expect(
      postSchema.safeParse({
        ...post,
        linhas: [{ id: 'l', colunas: [bloco, bloco, bloco], proporcao: 50 }]
      }).success
    ).toBe(false);
  });
});

describe('postGuardadoSchema', () => {
  it('aceita rascunho sem data de publicação e publicado com data', () => {
    expect(postGuardadoSchema.parse(guardado)).toEqual(guardado);
    expect(
      postGuardadoSchema.safeParse({
        ...guardado,
        estado: 'rascunho',
        publicadoEm: null
      }).success
    ).toBe(true);
  });

  it('recusa publicado sem data e rascunho com data', () => {
    expect(
      postGuardadoSchema.safeParse({ ...guardado, publicadoEm: null }).success
    ).toBe(false);
    expect(
      postGuardadoSchema.safeParse({ ...guardado, estado: 'rascunho' }).success
    ).toBe(false);
  });
});

describe('entrada do editor', () => {
  it('aceita post novo sem slug nem versão e post gravado com os dois', () => {
    expect(
      entradaEditorSchema.safeParse({ slug: null, versao: null, post }).success
    ).toBe(true);
    expect(
      entradaEditorSchema.safeParse({ slug: 'feira', versao: 3, post }).success
    ).toBe(true);
  });

  it('recusa slug sem versão, versão sem slug e versão que não é inteiro positivo', () => {
    for (const [slug, versao] of [
      ['feira', null],
      [null, 1],
      ['feira', 0],
      ['feira', 1.5]
    ]) {
      expect(
        entradaEditorSchema.safeParse({ slug, versao, post }).success
      ).toBe(false);
    }
  });

  it('recusa slug com caminho, barra ou caractere fora do padrão', () => {
    for (const slug of ['../conteudo', 'a/b', '..', 'Post', 'a.json', '']) {
      expect(slugSchema.safeParse(slug).success).toBe(false);
      expect(
        entradaEditorSchema.safeParse({ slug, versao: 1, post }).success
      ).toBe(false);
    }
  });
});
