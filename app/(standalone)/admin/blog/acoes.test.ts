// @vitest-environment node
import type { Post, PostGuardado } from '@/lib/blog/tipos';

import { POST as enviarImagem } from './[slug]/imagem/route';
import { publicar, salvarRascunho } from './acoes';
import { afterEach, describe, expect, it, vi } from 'vitest';

const repositorio = vi.hoisted(() => ({
  salvarPost: vi.fn(),
  publicarPost: vi.fn(),
  despublicarPost: vi.fn(),
  salvarImagem: vi.fn()
}));

vi.mock('@/lib/blog/repositorio', () => repositorio);

const post: Post = {
  assunto: 'nota',
  titulo: 'Catálogo novo',
  resumo: '',
  capa: null,
  linhas: []
};

const guardado: PostGuardado = {
  slug: 'catalogo-novo',
  estado: 'rascunho',
  criadoEm: '2026-11-15T12:00:00.000Z',
  atualizadoEm: '2026-11-15T12:00:00.000Z',
  publicadoEm: null,
  post
};

const pedidoImagem = (slug: string) => {
  const corpo = new FormData();
  corpo.set('arquivo', new File([new Uint8Array([0x89])], 'a.png'));

  return enviarImagem(
    new Request(`http://localhost/admin/blog/${slug}/imagem`, {
      method: 'POST',
      body: corpo
    }),
    { params: Promise.resolve({ slug }) }
  );
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('gravação do admin do blog', () => {
  it('grava em desenvolvimento e devolve o post guardado', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    repositorio.salvarPost.mockResolvedValue(guardado);
    repositorio.publicarPost.mockResolvedValue({
      ...guardado,
      estado: 'publicado',
      publicadoEm: guardado.atualizadoEm
    });

    expect(await salvarRascunho({ slug: null, post })).toEqual({
      ok: true,
      guardado
    });
    expect(await publicar({ slug: 'catalogo-novo', post })).toMatchObject({
      ok: true,
      guardado: { estado: 'publicado' }
    });
    expect(repositorio.publicarPost).toHaveBeenCalledWith('catalogo-novo');
  });

  it('recusa fora de desenvolvimento sem tocar no disco', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(await salvarRascunho({ slug: null, post })).toMatchObject({
      ok: false
    });
    expect((await pedidoImagem('catalogo-novo')).status).toBe(404);
    expect(repositorio.salvarPost).not.toHaveBeenCalled();
    expect(repositorio.salvarImagem).not.toHaveBeenCalled();
  });

  it('recusa slug malicioso antes de chegar ao repositório', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    for (const slug of ['../conteudo', 'a/b', '..', 'A', 'x.json']) {
      expect(await salvarRascunho({ slug, post })).toMatchObject({ ok: false });
      expect((await pedidoImagem(slug)).status).toBe(400);
    }

    expect(repositorio.salvarPost).not.toHaveBeenCalled();
    expect(repositorio.salvarImagem).not.toHaveBeenCalled();
  });

  it('recusa post fora do formato com o motivo', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const resultado = await salvarRascunho({
      slug: null,
      post: { ...post, capa: 'blob:http://localhost/abc' }
    });

    expect(resultado).toMatchObject({ ok: false });
    expect(!resultado.ok && resultado.erro).toContain('capa');
    expect(repositorio.salvarPost).not.toHaveBeenCalled();
  });

  it('devolve o motivo quando o disco recusa a gravação', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    repositorio.salvarPost.mockRejectedValue(
      Object.assign(new Error('sem permissão'), { code: 'EACCES' })
    );

    expect(await salvarRascunho({ slug: null, post })).toEqual({
      ok: false,
      erro: 'Não foi possível gravar no disco (EACCES).'
    });
  });
});
