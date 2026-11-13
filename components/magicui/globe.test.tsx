import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { act, render } from '@testing-library/react';

import { Globe } from './globe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const controles = { autoRotate: false };
const pauseAnimation = vi.fn();
const resumeAnimation = vi.fn();

vi.mock('next/dynamic', () => ({
  default: () =>
    forwardRef<unknown, { onGlobeReady?: () => void }>(function GlobeFalso(
      { onGlobeReady },
      ref
    ) {
      useImperativeHandle(ref, () => ({
        controls: () => controles,
        pointOfView: vi.fn(),
        renderer: () => ({ setPixelRatio: vi.fn() }),
        pauseAnimation,
        resumeAnimation
      }));
      const avisarPronto = useRef(onGlobeReady);
      useEffect(() => avisarPronto.current?.(), []);

      return <canvas data-testid='globo-3d' />;
    })
}));

let reduzirMovimento = false;

vi.mock('motion/react', async (original) => ({
  ...(await original<typeof import('motion/react')>()),
  useReducedMotion: () => reduzirMovimento
}));

let intersecao: (visivel: boolean) => void = () => {};

beforeEach(() => {
  controles.autoRotate = false;
  reduzirMovimento = false;
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ json: async () => ({ features: [] }) }))
  );
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(
        private cb: (
          e: { contentRect: { width: number; height: number } }[]
        ) => void
      ) {}
      observe() {
        this.cb([{ contentRect: { width: 400, height: 400 } }]);
      }
      disconnect() {}
    }
  );
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: (e: { isIntersecting: boolean }[]) => void) {
        intersecao = (visivel) => cb([{ isIntersecting: visivel }]);
      }
      observe() {}
      disconnect() {}
    }
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  pauseAnimation.mockClear();
  resumeAnimation.mockClear();
});

async function montarPronto(onPronto = vi.fn()) {
  const tela = render(<Globe onPronto={onPronto} />);
  act(() => intersecao(true));
  await tela.findByTestId('globo-3d');

  return onPronto;
}

describe('Globe', () => {
  it('gira e avisa que ficou pronto', async () => {
    const onPronto = await montarPronto();
    expect(controles.autoRotate).toBe(true);
    expect(onPronto).toHaveBeenCalledTimes(1);
  });

  it('não gira com reduced motion', async () => {
    reduzirMovimento = true;
    await montarPronto();
    expect(controles.autoRotate).toBe(false);
  });

  it('pausa o render fora da tela e retoma ao voltar', async () => {
    await montarPronto();
    act(() => intersecao(false));
    expect(pauseAnimation).toHaveBeenCalled();
    act(() => intersecao(true));
    expect(resumeAnimation).toHaveBeenCalled();
  });

  it('pausa o render com a aba oculta', async () => {
    await montarPronto();
    act(() => intersecao(true));
    pauseAnimation.mockClear();
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(pauseAnimation).toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
