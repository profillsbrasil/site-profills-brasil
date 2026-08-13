import { render, screen } from '@testing-library/react';

import { SubNavMaquina } from '../subNavMaquina';
import { describe, expect, it } from 'vitest';

const secoes = [
  { id: 'visao-geral', rotulo: 'Visão geral' },
  { id: 'ficha-tecnica', rotulo: 'Ficha técnica' }
];

describe('SubNavMaquina', () => {
  it('renderiza o nome e uma âncora por seção recebida', () => {
    render(<SubNavMaquina nome='Pouch Speed' secoes={secoes} />);
    expect(screen.getByText('Pouch Speed')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Visão geral' })).toHaveAttribute(
      'href',
      '#visao-geral'
    );
    expect(screen.getByRole('link', { name: 'Ficha técnica' })).toHaveAttribute(
      'href',
      '#ficha-tecnica'
    );
  });

  it('não inventa âncoras além das recebidas', () => {
    render(<SubNavMaquina nome='X' secoes={[secoes[0]]} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });
});
