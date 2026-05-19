import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WebGLFallback } from './WebGLFallback';

describe('WebGLFallback', () => {
  it('renderiza a mensagem de indisponibilidade', () => {
    render(<WebGLFallback />);

    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
    expect(
      screen.getByText(/visualização 3d indisponível/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ative a aceleração de gráficos/i)
    ).toBeInTheDocument();
  });

  it('aplica o estilo da variante dark', () => {
    render(<WebGLFallback variant='dark' />);

    expect(screen.getByTestId('webgl-fallback')).toHaveClass('bg-white/5');
  });
});
