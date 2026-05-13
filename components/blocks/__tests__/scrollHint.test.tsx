import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollHint } from '../scrollHint';

const reducedMotionMock = vi.fn();

vi.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      animate,
      initial: _initial,
      transition: _transition,
      ...props
    }: {
      children?: React.ReactNode;
      animate?: { opacity?: number };
      initial?: unknown;
      transition?: unknown;
    } & React.HTMLAttributes<HTMLDivElement>) => (
      <div
        {...props}
        data-opacity={animate && typeof animate.opacity === 'number' ? String(animate.opacity) : undefined}>
        {children}
      </div>
    ),
  },
  useReducedMotion: () => reducedMotionMock(),
}));

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
    writable: true,
  });
}

describe('ScrollHint', () => {
  beforeEach(() => {
    reducedMotionMock.mockReturnValue(false);
    setScrollY(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('inicia visível quando scrollY < 50', () => {
    setScrollY(0);
    render(<ScrollHint variant='desktop' />);
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '1');
  });

  it('inicia oculto quando scrollY >= 50', () => {
    setScrollY(100);
    render(<ScrollHint variant='desktop' />);
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
  });

  it('some quando scrolla além do threshold', () => {
    setScrollY(0);
    render(<ScrollHint variant='desktop' />);
    act(() => {
      setScrollY(100);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
  });

  it('reaparece quando volta ao topo', () => {
    setScrollY(200);
    render(<ScrollHint variant='desktop' />);
    act(() => {
      setScrollY(0);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '1');
  });

  it('respeita threshold de 50px no limite', () => {
    setScrollY(49);
    const { unmount } = render(<ScrollHint variant='desktop' testId='hint-49' />);
    expect(screen.getByTestId('hint-49')).toHaveAttribute('data-opacity', '1');
    unmount();

    setScrollY(50);
    render(<ScrollHint variant='desktop' testId='hint-50' />);
    expect(screen.getByTestId('hint-50')).toHaveAttribute('data-opacity', '0');
  });

  it('respeita prefers-reduced-motion (retorna null sem listener)', () => {
    reducedMotionMock.mockReturnValue(true);
    const addSpy = vi.spyOn(window, 'addEventListener');
    const { container } = render(<ScrollHint variant='desktop' />);
    expect(container.firstChild).toBeNull();
    expect(addSpy).not.toHaveBeenCalledWith('scroll', expect.any(Function), expect.anything());
  });

  it('limpa listener no unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ScrollHint variant='desktop' />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('variant mobile renderiza pill com label', () => {
    render(<ScrollHint variant='mobile' />);
    const el = screen.getByTestId('scroll-hint-mobile');
    expect(el).toHaveTextContent(/role para descobrir/i);
  });

  it('variant desktop renderiza label', () => {
    render(<ScrollHint variant='desktop' />);
    expect(screen.getByText(/role para descobrir/i)).toBeInTheDocument();
  });
});
