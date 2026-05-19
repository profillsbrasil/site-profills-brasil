import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./webglSupport', () => ({
  isWebGLAvailable: vi.fn(),
}));

import { useOptimized3DModel } from './useOptimized3DModel';
import { isWebGLAvailable } from './webglSupport';

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
});
