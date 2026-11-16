import { REPOUSO_MS, usePlaca } from '@/components/layout/placa';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

const ORDEM = ['maquinas', 'projetos', 'servicos'] as const;

function Banco() {
  const placa = usePlaca(ORDEM);
  const { raiz, gaveta, sentido } = placa;

  return (
    <div ref={raiz} data-testid='raiz' data-sentido={sentido}>
      {ORDEM.map((menu) => (
        <button key={menu} type='button' {...placa.gatilho(menu)}>
          {menu}
        </button>
      ))}
      <div ref={gaveta} />
    </div>
  );
}

function tocar(el: HTMLElement) {
  fireEvent.pointerDown(el, { pointerType: 'touch' });
  act(() => el.focus());
  fireEvent.click(el);
}

describe('usePlaca: toque', () => {
  it('tocar em outro gatilho troca de menu com sentido, sem fechar antes', () => {
    render(<Banco />);

    tocar(screen.getByText('maquinas'));
    expect(screen.getByText('maquinas')).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    tocar(screen.getByText('servicos'));
    expect(screen.getByText('servicos')).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByTestId('raiz')).toHaveAttribute('data-sentido', '1');
  });
});

describe('usePlaca: Esc', () => {
  it('Esc devolve o foco ao gatilho e tremer em cima não reabre', () => {
    vi.useFakeTimers();
    render(<Banco />);

    const maquinas = screen.getByText('maquinas');

    fireEvent.keyDown(maquinas, { key: 'ArrowDown' });
    expect(maquinas).toHaveAttribute('aria-expanded', 'true');

    act(() => screen.getByText('servicos').focus());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(maquinas).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(maquinas);

    fireEvent.pointerMove(maquinas, { clientX: 100, clientY: 44 });
    fireEvent.pointerMove(maquinas, { clientX: 101, clientY: 44 });
    act(() => {
      vi.advanceTimersByTime(REPOUSO_MS * 3);
    });
    expect(maquinas).toHaveAttribute('aria-expanded', 'false');

    vi.useRealTimers();
  });
});
