import { fireEvent, render, screen } from '@testing-library/react';

import { Lateral } from './lateral';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../entrar/acoes', () => ({ sairDoAdmin: vi.fn() }));

vi.mock('@/public/logo-branco.png', () => ({
  default: { src: '/logo-branco.png', width: 131, height: 20 }
}));

const rotulos = () =>
  ['Novo post', 'Posts', 'Imagens', 'Assuntos', 'Sair'].map((nome) =>
    screen.getByText(nome)
  );

const alternar = (nome: RegExp) =>
  fireEvent.click(screen.getByRole('button', { name: nome }));

describe('Lateral', () => {
  it('troca de largura sem transição de layout', () => {
    render(<Lateral atual='posts' totalPosts={3} />);
    const nav = screen.getByRole('navigation', { name: 'Admin do blog' });

    expect(nav.className).toContain('w-56');
    alternar(/recolher o menu/i);
    expect(nav.className).toContain('w-14');
    expect(nav.className).not.toMatch(/transition|duration/);
  });

  it('recolhida, esconde os rótulos e mantém o nome acessível', () => {
    render(<Lateral atual='posts' totalPosts={3} />);
    alternar(/recolher o menu/i);

    expect(screen.queryByText('Posts')).toBeNull();
    expect(screen.getByRole('link', { name: 'Posts' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Novo post' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sair' })).toBeTruthy();
  });

  it('só faz o fade dos rótulos quando o user reabre, e só sem reduced motion', () => {
    render(<Lateral atual='posts' totalPosts={3} />);

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
