import { embalagens3d } from '@/lib/data/embalagens3d';
import { act, render, screen } from '@testing-library/react';

import { useOptimized3DModel } from './hooks/useOptimized3DModel';
import { OptimizedEmbalagem3d } from './optimizedEmbalagem3d';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./hooks/useOptimized3DModel', () => ({
  useOptimized3DModel: vi.fn()
}));

const mockedUseOptimized3DModel = vi.mocked(useOptimized3DModel);
const alt = 'Modelo 3D - Pouch';

function estado(parcial: {
  isLoaded: boolean;
  webglSupported: boolean | null;
}) {
  mockedUseOptimized3DModel.mockReturnValue({
    containerRef: { current: null },
    modelViewerRef: { current: null },
    isVisible: true,
    shouldRender: parcial.isLoaded,
    hasBeenLoaded: parcial.isLoaded,
    handleModelLoad: vi.fn(),
    handleModelError: vi.fn(),
    ...parcial
  });
}

describe('OptimizedEmbalagem3d', () => {
  it('mostra a foto, sem texto de carregamento, enquanto o .glb não chegou', () => {
    estado({ isLoaded: true, webglSupported: true });

    const { container } = render(
      <OptimizedEmbalagem3d embalagem={embalagens3d.pouch} alt={alt} />
    );

    expect(container.querySelector('model-viewer')).not.toBeNull();
    expect(screen.getByRole('img', { name: alt })).toBeInTheDocument();
    expect(screen.queryByText(/carregando/i)).toBeNull();
  });

  it('tira a foto da árvore acessível quando o modelo dispara load', () => {
    estado({ isLoaded: true, webglSupported: true });

    const { container } = render(
      <OptimizedEmbalagem3d embalagem={embalagens3d.pouch} alt={alt} />
    );
    act(() => {
      container.querySelector('model-viewer')!.dispatchEvent(new Event('load'));
    });

    expect(screen.queryByRole('img', { name: alt })).toBeNull();
  });

  it('mostra a foto quando o WebGL está indisponível', () => {
    estado({ isLoaded: false, webglSupported: false });

    const { container } = render(
      <OptimizedEmbalagem3d embalagem={embalagens3d.pouch} alt={alt} />
    );

    expect(container.querySelector('model-viewer')).toBeNull();
    expect(screen.getByRole('img', { name: alt })).toBeInTheDocument();
  });
});
