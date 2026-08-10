import type { HTMLAttributes, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { HeroSlideCopy } from '../heroSlideCopy';
import { SLIDES } from '../slideData';
import { describe, expect, it, vi } from 'vitest';

vi.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      variants: _v,
      initial: _i,
      animate: _a,
      exit: _e,
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
  }
}));

describe('HeroSlideCopy', () => {
  it('renderiza lockup, headline em 2 linhas nowrap, descrição, specs com "até" e CTA', () => {
    render(<HeroSlideCopy slide={SLIDES[0]} primeiro />);

    expect(screen.getByText('Linha TP')).toBeInTheDocument();
    expect(screen.getByText('Envasadora de sachês')).toBeInTheDocument();

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Precisão de dosagem,');
    expect(h1).toHaveTextContent('sachê após sachê');
    expect(screen.getByText('Precisão de dosagem,')).toHaveClass(
      'whitespace-nowrap'
    );
    expect(screen.getByText('sachê após sachê')).toHaveClass(
      'whitespace-nowrap'
    );

    expect(screen.getByText(/polpas, laticínios, molhos/i)).toBeInTheDocument();
    expect(screen.getByText('até')).toBeInTheDocument();
    expect(screen.getByText('3.000')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /conhecer/i })).toHaveAttribute(
      'href',
      '/maquinas/1'
    );
  });

  it('link do WhatsApp abre wa.me em nova aba', () => {
    render(<HeroSlideCopy slide={SLIDES[0]} primeiro />);
    const whats = screen.getByRole('link', {
      name: /falar com um especialista/i
    });
    expect(whats).toHaveAttribute('href', expect.stringContaining('wa.me'));
    expect(whats).toHaveAttribute('target', '_blank');
  });

  it('slide que não é o primeiro usa h2 (um só h1 na página)', () => {
    render(<HeroSlideCopy slide={SLIDES[1]} primeiro={false} />);
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Quatro soldas,'
    );
  });

  it('modo estático (reduced motion) renderiza o conteúdo sem cascata', () => {
    render(<HeroSlideCopy slide={SLIDES[0]} primeiro estatico />);

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Precisão de dosagem,');
    expect(h1).toHaveTextContent('sachê após sachê');
    expect(screen.getByRole('link', { name: /conhecer/i })).toHaveAttribute(
      'href',
      '/maquinas/1'
    );
  });
});
