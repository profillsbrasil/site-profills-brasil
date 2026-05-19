import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { OptimizedEmbalagem3d } from './optimizedEmbalagem3d';
import { useOptimized3DModel } from './hooks/useOptimized3DModel';

vi.mock('./hooks/useOptimized3DModel', () => ({
  useOptimized3DModel: vi.fn(),
}));

const mockedUseOptimized3DModel = vi.mocked(useOptimized3DModel);

describe('OptimizedEmbalagem3d', () => {
  it('mostra o WebGLFallback quando WebGL não está disponível', () => {
    mockedUseOptimized3DModel.mockReturnValue({
      containerRef: { current: null },
      modelViewerRef: { current: null },
      isVisible: false,
      isLoaded: false,
      shouldRender: false,
      hasBeenLoaded: false,
      webglSupported: false,
      handleModelLoad: vi.fn(),
      handleModelError: vi.fn(),
    });

    render(<OptimizedEmbalagem3d />);

    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
  });

  it('mostra o placeholder de loading enquanto detecta WebGL', () => {
    mockedUseOptimized3DModel.mockReturnValue({
      containerRef: { current: null },
      modelViewerRef: { current: null },
      isVisible: true,
      isLoaded: false,
      shouldRender: false,
      hasBeenLoaded: false,
      webglSupported: null,
      handleModelLoad: vi.fn(),
      handleModelError: vi.fn(),
    });

    render(<OptimizedEmbalagem3d />);

    expect(screen.queryByTestId('webgl-fallback')).not.toBeInTheDocument();
    expect(screen.getByText(/carregando modelo 3d/i)).toBeInTheDocument();
  });
});
