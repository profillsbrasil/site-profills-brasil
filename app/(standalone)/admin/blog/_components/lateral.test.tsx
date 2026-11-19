import { fireEvent, render, screen } from '@testing-library/react';

import { Lateral, type PaginaAdmin, type TotaisLateral } from './lateral';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../entrar/acoes', () => ({ sairDoAdmin: vi.fn() }));

vi.mock('@/public/logo-branco.png', () => ({
  default: { src: '/logo-branco.png', width: 131, height: 20 }
}));

const totais: TotaisLateral = {
  posts: 11,
  publicados: 8,
  rascunhos: 3,
  imagens: 18
};

function abrir(
  atual: PaginaAdmin,
  mudancas: Partial<TotaisLateral> = {},
  usuario: string | null = 'profills'
) {
  render(
    <Lateral
      atual={atual}
      totais={{ ...totais, ...mudancas }}
      usuario={usuario}
    />
  );
}

const link = (nome: string) =>
  screen.getByRole('link', { name: new RegExp(`^${nome}`) });

const alternar = (nome: RegExp) =>
  fireEvent.click(screen.getByRole('button', { name: nome }));

const ativos = () =>
  screen
    .getAllByRole('link')
    .filter((l) => l.getAttribute('aria-current') === 'page')
    .map((l) => l.getAttribute('href'));

describe('Lateral', () => {
  it('troca de largura sem transição de layout', () => {
    abrir('todos');
    const nav = screen.getByRole('navigation', { name: 'Admin do blog' });

    expect(nav.className).toContain('w-62');
    alternar(/recolher o menu/i);
    expect(nav.className).toContain('w-14');
    expect(nav.className).not.toMatch(/transition|duration/);
  });

  it('mostra os filtros de posts e a biblioteca com o total de cada um', () => {
    abrir('todos');

    expect(link('Todos').getAttribute('href')).toBe('/admin/blog');
    expect(link('Publicados').getAttribute('href')).toBe(
      '/admin/blog?estado=publicados'
    );
    expect(link('Rascunhos').getAttribute('href')).toBe(
      '/admin/blog?estado=rascunhos'
    );
    expect(link('Todos').textContent).toBe('Todos11');
    expect(link('Publicados').textContent).toBe('Publicados8');
    expect(link('Rascunhos').textContent).toBe('Rascunhos3');
    expect(link('Imagens').textContent).toBe('Imagens18');
    expect(link('Assuntos').textContent).toBe('Assuntos6');
    expect(screen.getByText('Posts')).toBeTruthy();
    expect(screen.getByText('Biblioteca')).toBeTruthy();
  });

  it.each([
    ['todos', '/admin/blog'],
    ['publicados', '/admin/blog?estado=publicados'],
    ['rascunhos', '/admin/blog?estado=rascunhos'],
    ['imagens', '/admin/blog/imagens'],
    ['assuntos', '/admin/blog/assuntos'],
    ['novo', '/admin/blog/novo']
  ] as const)('em %s, marca só o item da página aberta', (atual, href) => {
    abrir(atual);

    expect(ativos()).toEqual([href]);
  });

  it('no editor, nenhum item fica marcado', () => {
    abrir('editor');

    expect(ativos()).toEqual([]);
  });

  it('total zero aparece apagado e o armazém mudo deixa Imagens sem número', () => {
    abrir('todos', { publicados: 0, imagens: null });

    expect(screen.getByText('0').className).toContain('opacity-40');
    expect(screen.getByText('11').className).not.toContain('opacity-40');
    expect(link('Imagens').textContent).toBe('Imagens');
  });

  it('leva ao blog público numa aba nova', () => {
    abrir('todos');

    const blog = link('Ver o blog');

    expect(blog.getAttribute('href')).toBe('/blog');
    expect(blog.getAttribute('target')).toBe('_blank');
    expect(blog.getAttribute('rel')).toContain('noopener');
  });

  it('mostra o usuário da conta ao lado do botão Sair', () => {
    abrir('todos');

    expect(screen.getByText('profills')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sair' })).toBeTruthy();
  });

  it('sem nome na sessão, a conta aparece como Admin', () => {
    abrir('todos', {}, null);

    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('recolhida, fica só com ícones de nome acessível e esconde os filtros', () => {
    abrir('rascunhos');
    alternar(/recolher o menu/i);

    for (const rotulo of ['Posts', 'Biblioteca', 'Todos', 'profills'])
      expect(screen.queryByText(rotulo)).toBeNull();

    expect(screen.queryByRole('link', { name: /^Publicados/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /^Rascunhos/ })).toBeNull();

    for (const nome of [
      'Novo post',
      'Todos os posts',
      'Imagens',
      'Assuntos',
      'Ver o blog'
    ]) {
      const item = screen.getByRole('link', { name: nome });

      expect(item.getAttribute('title')).toBeTruthy();
    }

    expect(screen.getByRole('button', { name: 'Sair' })).toBeTruthy();
  });

  it('só faz o fade dos rótulos quando o user reabre, e só sem reduced motion', () => {
    abrir('todos');

    const rotulos = () =>
      ['Novo post', 'Todos', 'Publicados', 'Biblioteca', 'Ver o blog'].map(
        (nome) => screen.getByText(nome)
      );

    for (const rotulo of rotulos())
      expect(rotulo.className).not.toContain('fade-in');

    alternar(/recolher o menu/i);
    alternar(/abrir o menu/i);

    for (const rotulo of rotulos()) {
      expect(rotulo.className).toContain('motion-safe:animate-in');
      expect(rotulo.className).toContain('motion-safe:fade-in');
      expect(rotulo.className).not.toMatch(/(^|\s)(animate-in|fade-in)/);
    }
  });
});
