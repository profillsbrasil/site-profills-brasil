import type { HTMLAttributes, ReactNode } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import HeroCarrossel from '../heroCarrossel';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const reducedMotionMock = vi.fn(() => false);

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      custom: _c,
      variants: _v,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      ...props
    }: HTMLAttributes<HTMLDivElement> &
      Record<string, unknown> & { children?: ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    span: ({
      children,
      variants: _v,
      ...props
    }: HTMLAttributes<HTMLSpanElement> &
      Record<string, unknown> & { children?: ReactNode }) => (
      <span {...props}>{children}</span>
    )
  },
  useReducedMotion: () => reducedMotionMock()
}));

vi.mock('next/image', () => ({
  default: ({
    alt,
    className,
    style
  }: {
    alt: string;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className={className} style={style} />
  )
}));

vi.mock('@/components/layout/gridPatternBg', () => ({
  GridPattern: () => <div data-testid='grid-pattern' />
}));

describe('HeroCarrossel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    reducedMotionMock.mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('abre no slide 1 (Linha TP) com h1, índice 01 e "A seguir" do TC4s', () => {
    render(<HeroCarrossel />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Envase de sachês com'
    );
    expect(screen.getByTestId('indice-atual')).toHaveTextContent('01');
    expect(screen.getByText('TC · Sachê 4 soldas')).toBeInTheDocument();
    expect(screen.getByAltText('Envasadora Linha TP')).toBeInTheDocument();
  });

  it('seta próximo avança para o TC4s (h2, rota /maquinas/2, índice 02)', () => {
    render(<HeroCarrossel />);
    fireEvent.click(screen.getByRole('button', { name: 'Próximo slide' }));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Sachês com 4 soldas'
    );
    expect(screen.getByRole('link', { name: /conhecer/i })).toHaveAttribute(
      'href',
      '/maquinas/2'
    );
    expect(screen.getByTestId('indice-atual')).toHaveTextContent('02');
    expect(screen.getByText('Stick · 1 a 4 vias')).toBeInTheDocument();
  });

  it('seta anterior faz o wrap para o último slide (Pouch)', () => {
    render(<HeroCarrossel />);
    fireEvent.click(screen.getByRole('button', { name: 'Slide anterior' }));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Alta velocidade para'
    );
    expect(screen.getByTestId('indice-atual')).toHaveTextContent('04');
  });

  it('autoplay avança sozinho após 7s', () => {
    render(<HeroCarrossel />);
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Sachês com 4 soldas'
    );
  });

  it('reduced motion: sem autoplay e anéis estáticos', () => {
    reducedMotionMock.mockReturnValue(true);
    render(<HeroCarrossel />);
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Envase de sachês com'
    );
    expect(screen.queryAllByTestId('hero-ring-pulso')).toHaveLength(0);
  });
});
