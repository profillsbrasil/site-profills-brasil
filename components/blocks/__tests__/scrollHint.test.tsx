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

describe('ScrollHint', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    reducedMotionMock.mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('não renderiza visível antes de idleMs', () => {
    render(<ScrollHint variant='desktop' idleMs={2500} />);
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
  });

  it('fica visível após idleMs', () => {
    render(<ScrollHint variant='desktop' idleMs={2500} />);
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '1');
  });

  it('some no primeiro scroll após visível', () => {
    render(<ScrollHint variant='desktop' idleMs={2500} />);
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
  });

  it('não reaparece em scrolls subsequentes', () => {
    render(<ScrollHint variant='desktop' idleMs={2500} />);
    act(() => {
      vi.advanceTimersByTime(2500);
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(2500);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByTestId('scroll-hint-desktop')).toHaveAttribute('data-opacity', '0');
  });

  it('respeita prefers-reduced-motion (retorna null sem armar timer)', () => {
    reducedMotionMock.mockReturnValue(true);
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
    const { container } = render(<ScrollHint variant='desktop' idleMs={2500} />);
    expect(container.firstChild).toBeNull();
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  it('limpa listener no unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ScrollHint variant='desktop' idleMs={2500} />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('variant mobile renderiza pill com label', () => {
    render(<ScrollHint variant='mobile' idleMs={2500} />);
    const el = screen.getByTestId('scroll-hint-mobile');
    expect(el).toHaveTextContent(/role para descobrir/i);
  });

  it('variant desktop renderiza label', () => {
    render(<ScrollHint variant='desktop' idleMs={2500} />);
    expect(screen.getByText(/role para descobrir/i)).toBeInTheDocument();
  });
});
