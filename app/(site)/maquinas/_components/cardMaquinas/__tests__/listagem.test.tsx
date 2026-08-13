import { maquinasCatalogo } from '@/lib/data/maquinas';
import { fireEvent, render, screen, within } from '@testing-library/react';

import Maquinas from '../../../page';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/maquinas'
}));

// Padrão sancionado do repo (ver relacionadas.test.tsx): next/image não roda
// em jsdom, mock reduz para uma tag <img> simples.
vi.mock('next/image', () => ({
  default: 'img'
}));

describe('listagem de máquinas no registry', () => {
  it('renderiza um card por máquina do registry em "Todas"', () => {
    const { container } = render(<Maquinas />);
    const links = container.querySelectorAll('a[href^="/maquinas/"]');
    expect(links.length).toBe(maquinasCatalogo.length);
  });

  it('filtro por categoria "Stand-up pouch" mostra só as máquinas dessa categoria', () => {
    const { container } = render(<Maquinas />);
    const [botao] = screen.getAllByRole('button', { name: 'Stand-up pouch' });
    fireEvent.click(botao);

    const esperado = maquinasCatalogo.filter(
      (m) => m.categoria === 'Stand-up pouch'
    );
    const links = container.querySelectorAll('a[href^="/maquinas/"]');
    expect(links.length).toBe(esperado.length);
    for (const m of esperado) {
      expect(
        container.querySelector(`a[href="/maquinas/${m.slug}"]`)
      ).not.toBeNull();
    }
  });

  it('card de máquina de engenharia (sem imagens) renderiza sem <img> e sem quebrar', () => {
    const semImagem = maquinasCatalogo.find((m) => !m.imagens);
    expect(semImagem).toBeDefined();

    const { container } = render(<Maquinas />);
    const link = container.querySelector(
      `a[href="/maquinas/${semImagem!.slug}"]`
    );
    expect(link).not.toBeNull();
    expect(
      within(link as HTMLElement).queryAllByText(semImagem!.nome).length
    ).toBeGreaterThan(0);
    expect(link!.querySelectorAll('img').length).toBe(0);
  });

  it('cada card linka para /maquinas/<slug>', () => {
    const { container } = render(<Maquinas />);
    for (const m of maquinasCatalogo) {
      expect(
        container.querySelector(`a[href="/maquinas/${m.slug}"]`)
      ).not.toBeNull();
    }
  });
});
