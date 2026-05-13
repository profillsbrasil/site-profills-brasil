import { createElement } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ScrollExpandMedia from '../scrollExpansionHero';

vi.mock('next/dynamic', () => ({
  default: () => {
    return function MockDynamicComponent({
      className,
      eager,
    }: {
      className?: HTMLAttributes<HTMLDivElement>['className'];
      eager?: boolean;
    }) {
      return (
        <div
          data-testid='caixa-home-3d'
          data-eager={eager ? 'true' : 'false'}
          className={className}
        />
      );
    };
  },
}));

vi.mock('@/components/layout/gridPatternBg', () => ({
  GridPattern: () => <div data-testid='grid-pattern' />,
}));

vi.mock('@/components/layout/gridPatternBgMobile', () => ({
  GridPatternMobile: ({
    className,
  }: {
    className?: string;
  }) => <div data-testid='grid-pattern-mobile' className={className} />,
}));

vi.mock('@/components/ui/blur-fade', () => ({
  BlurFade: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/text-animate', () => ({
  TextAnimate: ({
    children,
    as: Component = 'div',
    className,
  }: {
    children: ReactNode;
    as?: ElementType;
    className?: string;
  }) => createElement(Component, { className }, children),
}));

const reducedMotionMock = vi.fn(() => false);

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      animate: _animate,
      initial: _initial,
      transition: _transition,
      style: _style,
      ...props
    }: HTMLAttributes<HTMLDivElement> & {
      animate?: unknown;
      initial?: unknown;
      transition?: unknown;
      style?: React.CSSProperties;
    }) => <div {...props}>{children}</div>,
  },
  useMotionValueEvent: vi.fn(),
  useReducedMotion: () => reducedMotionMock(),
  useScroll: () => ({ scrollYProgress: {} }),
  useTransform: () => 0,
}));

describe('ScrollExpandMedia mobile hero', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

  beforeEach(() => {
    addEventListenerSpy.mockClear();
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 390,
      writable: true,
    });
  });

  it('uses CSS-driven mobile rendering without resize listeners or white background bleed', async () => {
    render(
      <ScrollExpandMedia>
        <div>Conteudo</div>
      </ScrollExpandMedia>
    );

    const mobileHero = screen.getByTestId('mobile-hero');
    const desktopHero = screen.getByTestId('desktop-hero');

    await waitFor(() => {
      expect(within(mobileHero).getByRole('heading', { name: /tudo para\s*seu negócio!/i })).toBeInTheDocument();
      expect(within(mobileHero).getByText(/inovação a cada embalagem/i)).toBeInTheDocument();
      expect(within(mobileHero).queryByText(/soluções para o seu negócio!/i)).not.toBeInTheDocument();
    });

    expect(addEventListenerSpy).not.toHaveBeenCalledWith('resize', expect.any(Function), undefined);
    expect(mobileHero).toHaveClass('md:hidden');
    expect(desktopHero).toHaveClass('hidden');
    expect(desktopHero).toHaveClass('md:block');
    expect(within(mobileHero).getByTestId('grid-pattern-mobile')).toHaveClass('bg-transparent');
    expect(within(mobileHero).getByTestId('caixa-home-3d')).toHaveAttribute('data-eager', 'true');
    expect(within(mobileHero).getByTestId('caixa-home-3d')).toHaveClass('h-[320px]');
    expect(within(mobileHero).getByTestId('caixa-home-3d')).toHaveClass('w-full');
  });
});

describe('ScrollHint integration', () => {
  beforeEach(() => {
    reducedMotionMock.mockReturnValue(false);
  });

  it('DesktopHero monta ScrollHint variant desktop', () => {
    render(
      <ScrollExpandMedia>
        <div>Conteudo</div>
      </ScrollExpandMedia>
    );
    const desktopHero = screen.getByTestId('desktop-hero');
    expect(within(desktopHero).getByTestId('scroll-hint-desktop')).toBeInTheDocument();
  });

  it('MobileHero monta ScrollHint variant mobile', () => {
    render(
      <ScrollExpandMedia>
        <div>Conteudo</div>
      </ScrollExpandMedia>
    );
    const mobileHero = screen.getByTestId('mobile-hero');
    expect(within(mobileHero).getByTestId('scroll-hint-mobile')).toBeInTheDocument();
  });

  it('reduced-motion esconde ambas as variants', () => {
    reducedMotionMock.mockReturnValue(true);
    render(
      <ScrollExpandMedia>
        <div>Conteudo</div>
      </ScrollExpandMedia>
    );
    expect(screen.queryByTestId('scroll-hint-desktop')).not.toBeInTheDocument();
    expect(screen.queryByTestId('scroll-hint-mobile')).not.toBeInTheDocument();
  });
});
