import { renderHook, waitFor } from '@testing-library/react';

import { useOptimized3DModel } from './useOptimized3DModel';
import { isWebGLAvailable } from './webglSupport';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./webglSupport', () => ({
  isWebGLAvailable: vi.fn()
}));

const mockedIsWebGLAvailable = vi.mocked(isWebGLAvailable);

afterEach(() => {
  vi.clearAllMocks();
});

describe('useOptimized3DModel', () => {
  it('expõe webglSupported=false quando WebGL não está disponível', async () => {
    mockedIsWebGLAvailable.mockReturnValue(false);

    const { result } = renderHook(() =>
      useOptimized3DModel({ src: '/modelo.glb' })
    );

    await waitFor(() => expect(result.current.webglSupported).toBe(false));
  });

  it('expõe webglSupported=true quando WebGL está disponível', async () => {
    mockedIsWebGLAvailable.mockReturnValue(true);

    const { result } = renderHook(() =>
      useOptimized3DModel({ src: '/modelo.glb' })
    );

    await waitFor(() => expect(result.current.webglSupported).toBe(true));
  });

  it('não deixa o timer de render pendente depois de desmontar', () => {
    mockedIsWebGLAvailable.mockReturnValue(false);
    let avisar: IntersectionObserverCallback = () => {};
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          avisar = cb;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );
    vi.useFakeTimers();
    try {
      const { unmount } = renderHook(() =>
        useOptimized3DModel({ src: '/timer.glb' })
      );
      avisar(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
      const antes = vi.getTimerCount();
      unmount();
      // O desmonte agenda só a limpeza do cache de 5 s; o timer de 100 ms sai.
      expect(vi.getTimerCount()).toBe(antes);
    } finally {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    }
  });
});
