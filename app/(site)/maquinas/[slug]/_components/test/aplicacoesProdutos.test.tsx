import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';
import { render, screen } from '@testing-library/react';

import { AplicacoesProdutos } from '../aplicacoesProdutos';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: 'img'
}));

describe('AplicacoesProdutos', () => {
  it('renderiza subtítulo (categoriaPrincipal) e uma miniatura por categoria', () => {
    render(<AplicacoesProdutos aplicacoes={piloto.aplicacoes} />);
    expect(
      screen.getByText('Líquidos, pastosos, pós, grãos e sólidos')
    ).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(5);
  });

  it('mantém os 23 produtos no DOM mesmo com o expansível fechado (SEO)', () => {
    render(<AplicacoesProdutos aplicacoes={piloto.aplicacoes} />);
    expect(screen.getByText('Ração pet')).toBeInTheDocument();
    expect(
      screen.getByText(/Ver produtos compatíveis \(23\)/)
    ).toBeInTheDocument();
  });

  it('mostra só as miniaturas das categorias da máquina', () => {
    render(
      <AplicacoesProdutos
        aplicacoes={{ ...piloto.aplicacoes, categorias: ['pos'] }}
      />
    );
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByAltText(/Pós/)).toBeInTheDocument();
  });
});
