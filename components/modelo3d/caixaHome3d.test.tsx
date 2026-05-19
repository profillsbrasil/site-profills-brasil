import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CaixaHome3d } from './caixaHome3d';
import { useOptimized3DModel } from './hooks/useOptimized3DModel';

vi.mock('./hooks/useOptimized3DModel', () => ({
  useOptimized3DModel: vi.fn(),
}));

const mockedUseOptimized3DModel = vi.mocked(useOptimized3DModel);

describe('CaixaHome3d', () => {
  it('shows a visible loading placeholder with explicit mobile height and forwards eager mode', () => {
    mockedUseOptimized3DModel.mockReturnValue({
      containerRef: { current: null },
      modelViewerRef: { current: null },
      isVisible: false,
      isLoaded: false,
      shouldRender: false,
      hasBeenLoaded: false,
      webglSupported: true,
      handleModelLoad: vi.fn(),
      handleModelError: vi.fn(),
    });

    const { container } = render(
      <CaixaHome3d eager={true} isMobile={true} className='h-[320px] w-full' />
    );

    expect(mockedUseOptimized3DModel).toHaveBeenCalledWith({
      src: '/caixa-teste-3d.glb',
      threshold: 0.1,
      rootMargin: '100px',
      eager: true,
    });
    expect(screen.getByText(/carregando modelo 3d/i)).toBeInTheDocument();
    expect(screen.getByTestId('caixa-home-3d-placeholder')).toHaveClass('bg-white/5');
    expect(container.firstChild).toHaveClass('h-[320px]');
    expect(container.querySelector('[style*="height: 320px"]')).toHaveStyle({
      height: '320px',
    });
  });

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

    render(<CaixaHome3d isMobile={true} />);

    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
    expect(screen.queryByText(/carregando modelo 3d/i)).not.toBeInTheDocument();
  });
});
