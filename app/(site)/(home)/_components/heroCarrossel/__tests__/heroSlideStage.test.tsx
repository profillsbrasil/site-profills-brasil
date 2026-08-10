import type { HTMLAttributes, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { HeroSlideStage } from '../heroSlideStage';
import { SLIDES } from '../slideData';
import { describe, expect, it, vi } from 'vitest';

vi.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      ...props
    }: HTMLAttributes<HTMLDivElement> &
      Record<string, unknown> & { children?: ReactNode }) => (
      <div {...props}>{children}</div>
    )
  }
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
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img alt={alt} className={className} style={style} />
  )
}));

describe('HeroSlideStage', () => {
  it('máquina é absoluta (fora do fluxo do grid) com alt descritivo', () => {
    render(<HeroSlideStage slide={SLIDES[0]} direcao={1} primeiro />);
    const maquina = screen.getByAltText('Envasadora Linha TP');
    expect(maquina).toHaveClass('absolute');
    expect(maquina).toHaveClass('max-w-none');
  });

  it('embalagem usa altura e posição definidas pelo slide', () => {
    render(<HeroSlideStage slide={SLIDES[1]} direcao={1} primeiro={false} />);
    const embalagem = screen.getByAltText('Embalagem da Linha TC4s');
    expect(embalagem).toHaveStyle({ height: '42%', left: '2%' });
  });

  it('modo estático não aplica a flutuação da embalagem', () => {
    render(<HeroSlideStage slide={SLIDES[0]} direcao={1} primeiro estatico />);
    const embalagem = screen.getByAltText('Embalagem da Linha TP');
    expect(embalagem.className).not.toContain('hero-flutua');
  });
});
