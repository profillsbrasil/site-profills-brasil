import {
  FECHA_MS,
  REPOUSO_MS,
  useCompacta,
  usePlaca
} from '@/components/layout/placa';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

const ORDEM = ['maquinas', 'projetos', 'servicos'] as const;

function Banco() {
  const placa = usePlaca(ORDEM);
  const { raiz, gaveta, sentido, travada } = placa;

  return (
    <div
      ref={raiz}
      data-testid='raiz'
      data-sentido={sentido}
      data-travada={travada}>
      {ORDEM.map((menu) => (
        <div key={menu} {...placa.alvo(menu)}>
          <button type='button' {...placa.gatilho(menu)}>
            {menu}
          </button>
        </div>
      ))}
      <div ref={gaveta} data-testid='gaveta' />
    </div>
  );
}

const MOUSE = { pointerType: 'mouse' } as const;

const mover = (el: HTMLElement, x: number, y = 44) =>
  fireEvent.pointerMove(el, { ...MOUSE, clientX: x, clientY: y });

const passar = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

function abrirPorHover(menu: string) {
  fireEvent.pointerEnter(screen.getByTestId('raiz'), MOUSE);
  mover(screen.getByText(menu), 100);
  passar(REPOUSO_MS);
}

function tocar(el: HTMLElement) {
  fireEvent.pointerDown(el, { pointerType: 'touch' });
  act(() => el.focus());
  fireEvent.click(el);
}

afterEach(() => {
  vi.useRealTimers();
});

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

  it('toque não entra na zona nem arma o hover', () => {
    vi.useFakeTimers();
    render(<Banco />);

    fireEvent.pointerEnter(screen.getByTestId('raiz'), {
      pointerType: 'touch'
    });
    fireEvent.pointerMove(screen.getByText('maquinas'), {
      pointerType: 'touch',
      clientX: 100,
      clientY: 44
    });
    passar(REPOUSO_MS * 3);

    expect(screen.getByTestId('raiz')).toHaveAttribute('data-travada', 'false');
    expect(screen.getByText('maquinas')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });
});

describe('usePlaca: Esc', () => {
  it('Esc devolve o foco ao gatilho e tremer em cima não reabre', () => {
    vi.useFakeTimers();
    render(<Banco />);

    const maquinas = screen.getByText('maquinas');

    fireEvent.pointerEnter(screen.getByTestId('raiz'), MOUSE);
    mover(maquinas, 100);
    fireEvent.keyDown(maquinas, { key: 'ArrowDown' });
    expect(maquinas).toHaveAttribute('aria-expanded', 'true');

    act(() => screen.getByText('servicos').focus());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(maquinas).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(maquinas);

    mover(maquinas, 101);
    mover(maquinas, 100);
    passar(REPOUSO_MS * 3);
    expect(maquinas).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('usePlaca: zona do ponteiro', () => {
  it('eventos de fronteira sem movimento não fecham a gaveta', () => {
    vi.useFakeTimers();
    render(<Banco />);
    abrirPorHover('maquinas');

    const maquinas = screen.getByText('maquinas');
    const gaveta = screen.getByTestId('gaveta');

    expect(maquinas).toHaveAttribute('aria-expanded', 'true');

    // A placa cresce sob o ponteiro parado: a ponte passa por cima do gatilho
    // e sai, e o navegador despacha a fronteira sem pointermove.
    const parado = { ...MOUSE, clientX: 100, clientY: 44 };

    fireEvent.pointerOut(maquinas, { ...parado, relatedTarget: gaveta });
    fireEvent.pointerLeave(maquinas, { ...parado, relatedTarget: gaveta });
    fireEvent.pointerOver(gaveta, { ...parado, relatedTarget: maquinas });
    fireEvent.pointerEnter(gaveta, { ...parado, relatedTarget: maquinas });
    fireEvent.pointerOut(gaveta, { ...parado, relatedTarget: maquinas });
    fireEvent.pointerLeave(gaveta, { ...parado, relatedTarget: maquinas });
    fireEvent.pointerOver(maquinas, { ...parado, relatedTarget: gaveta });
    fireEvent.pointerEnter(maquinas, { ...parado, relatedTarget: gaveta });
    passar(FECHA_MS * 2);

    expect(maquinas).toHaveAttribute('aria-expanded', 'true');
  });

  it('outro gatilho chegando sob o ponteiro parado não troca o menu', () => {
    vi.useFakeTimers();
    render(<Banco />);
    abrirPorHover('maquinas');

    mover(screen.getByText('servicos'), 100);
    passar(REPOUSO_MS * 3);

    expect(screen.getByText('maquinas')).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('sair da zona fecha depois de FECHA_MS, e voltar antes cancela', () => {
    vi.useFakeTimers();
    render(<Banco />);
    abrirPorHover('maquinas');

    const raiz = screen.getByTestId('raiz');
    const maquinas = screen.getByText('maquinas');

    fireEvent.pointerLeave(raiz, MOUSE);
    passar(FECHA_MS - 10);
    fireEvent.pointerEnter(raiz, MOUSE);
    passar(FECHA_MS * 2);
    expect(maquinas).toHaveAttribute('aria-expanded', 'true');

    fireEvent.pointerLeave(raiz, MOUSE);
    passar(FECHA_MS);
    expect(maquinas).toHaveAttribute('aria-expanded', 'false');
  });

  it('trava com o ponteiro na zona ou com um menu aberto pelo teclado', () => {
    render(<Banco />);

    const raiz = screen.getByTestId('raiz');

    expect(raiz).toHaveAttribute('data-travada', 'false');
    fireEvent.pointerEnter(raiz, MOUSE);
    expect(raiz).toHaveAttribute('data-travada', 'true');
    fireEvent.pointerLeave(raiz, MOUSE);
    expect(raiz).toHaveAttribute('data-travada', 'false');

    fireEvent.keyDown(screen.getByText('maquinas'), { key: 'ArrowDown' });
    expect(raiz).toHaveAttribute('data-travada', 'true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(raiz).toHaveAttribute('data-travada', 'false');
  });
});

function Compacta({ travada }: { travada: boolean }) {
  const { compacta } = useCompacta(travada);

  return <div data-testid='placa' data-compacta={compacta} />;
}

function rolar(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  fireEvent.scroll(window);
}

describe('useCompacta', () => {
  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('compacta acima de 24 px e só volta em 4 px ou menos', () => {
    rolar(0);
    render(<Compacta travada={false} />);

    const placa = screen.getByTestId('placa');

    expect(placa).toHaveAttribute('data-compacta', 'false');
    rolar(34);
    expect(placa).toHaveAttribute('data-compacta', 'true');
    rolar(10);
    expect(placa).toHaveAttribute('data-compacta', 'true');
    rolar(4);
    expect(placa).toHaveAttribute('data-compacta', 'false');
  });

  it('travada, a placa não muda nos dois sentidos e a pendência entra ao soltar', () => {
    rolar(0);

    const { rerender } = render(<Compacta travada />);
    const placa = screen.getByTestId('placa');

    rolar(300);
    expect(placa).toHaveAttribute('data-compacta', 'false');
    rerender(<Compacta travada={false} />);
    expect(placa).toHaveAttribute('data-compacta', 'true');

    rerender(<Compacta travada />);
    rolar(0);
    expect(placa).toHaveAttribute('data-compacta', 'true');
    rerender(<Compacta travada={false} />);
    expect(placa).toHaveAttribute('data-compacta', 'false');
  });

  it('quem chega já rolado vê a placa compacta no primeiro render montado', () => {
    rolar(600);
    render(<Compacta travada={false} />);

    expect(screen.getByTestId('placa')).toHaveAttribute(
      'data-compacta',
      'true'
    );
  });
});
