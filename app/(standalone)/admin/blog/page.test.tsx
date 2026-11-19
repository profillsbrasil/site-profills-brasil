import type { ResumoAdmin } from '@/lib/blog/tipos';
import { render, screen, within } from '@testing-library/react';

import PostsPage from './page';
import { describe, expect, it, vi } from 'vitest';

const { listar } = vi.hoisted(() => ({ listar: vi.fn() }));

vi.mock('./acoes', () => ({ apagarRascunho: vi.fn() }));

vi.mock('../entrar/acoes', () => ({ sairDoAdmin: vi.fn() }));

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

vi.mock('@/lib/blog/admin', () => ({
  abrirAdminBlog: async () => ({ listar, contarImagens: async () => 5 })
}));

vi.mock('@/lib/admin/sessao', () => ({
  autorAtual: async () => ({ usuario: 'profills' })
}));

vi.mock('next/image', () => ({ default: () => null }));

const post = (slug: string, estado: ResumoAdmin['estado']) =>
  ({
    slug,
    versao: 1,
    estado,
    atualizadoEm: '2026-11-17T10:00:00-03:00',
    titulo: slug,
    assunto: 'evento'
  }) satisfies ResumoAdmin;

async function abrir(estado: string | undefined, posts: ResumoAdmin[]) {
  listar.mockResolvedValue(posts);
  render(await PostsPage({ searchParams: Promise.resolve({ estado }) }));
}

const titulosDaLista = () =>
  within(screen.getByRole('main'))
    .queryAllByRole('link')
    .map((link) => link.getAttribute('href'));

describe('página de posts do admin', () => {
  it('sem filtro, lista todos com o título Posts', async () => {
    await abrir(undefined, [post('a', 'publicado'), post('b', 'rascunho')]);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Posts');
    expect(titulosDaLista()).toEqual(['/admin/blog/a', '/admin/blog/b']);
  });

  it('em ?estado=rascunhos, lista só os rascunhos e marca o filtro na lateral', async () => {
    await abrir('rascunhos', [post('a', 'publicado'), post('b', 'rascunho')]);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Rascunhos'
    );
    expect(titulosDaLista()).toEqual(['/admin/blog/b']);
    expect(
      screen
        .getByRole('link', { name: /^Rascunhos/ })
        .getAttribute('aria-current')
    ).toBe('page');
  });

  it('filtro sem post mostra o que falta', async () => {
    await abrir('publicados', [post('b', 'rascunho')]);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Publicados'
    );
    expect(screen.getByText('Nenhum post publicado')).toBeTruthy();
    expect(titulosDaLista()).toEqual([]);
  });

  it('valor desconhecido em ?estado= cai em todos', async () => {
    await abrir('lixo', [post('a', 'publicado'), post('b', 'rascunho')]);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Posts');
    expect(titulosDaLista()).toHaveLength(2);
  });
});
