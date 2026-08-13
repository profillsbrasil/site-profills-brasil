import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';
import { render, screen } from '@testing-library/react';

import { EmbalagemBloco } from '../embalagemBloco';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: 'img'
}));

vi.mock('next/dynamic', () => ({
  default: () =>
    function Modelo3dMock() {
      return <div data-testid='modelo-3d' />;
    }
}));

describe('EmbalagemBloco', () => {
  it('renderiza o 3D quando a máquina tem embalagem3d', () => {
    render(<EmbalagemBloco maquina={piloto} />);
    expect(screen.getByTestId('modelo-3d')).toBeInTheDocument();
  });

  it('cai para a foto quando não há glb', () => {
    render(<EmbalagemBloco maquina={{ ...piloto, embalagem3d: undefined }} />);
    expect(screen.queryByTestId('modelo-3d')).toBeNull();
    expect(screen.getByAltText(/embalagem/i)).toBeInTheDocument();
  });

  it('renderiza as specs de embalagem como pares rótulo/valor', () => {
    render(<EmbalagemBloco maquina={piloto} />);
    expect(screen.getByText('Largura do filme')).toBeInTheDocument();
    expect(screen.getByText('320 a 650 mm')).toBeInTheDocument();
  });
});
