import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';
import { render, screen } from '@testing-library/react';

import { HeroDossie } from '../heroDossie';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: 'img'
}));

describe('HeroDossie', () => {
  it('renderiza H1, headline, categoria e página do catálogo', () => {
    render(<HeroDossie maquina={piloto} />);
    expect(
      screen.getByRole('heading', { level: 1, name: piloto.nomeCompleto })
    ).toBeInTheDocument();
    expect(screen.getByText(piloto.headline)).toBeInTheDocument();
    expect(screen.getAllByText(/Stand-up pouch/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/P\.16/)).toBeInTheDocument();
  });

  it('renderiza as 3 linhas do destaqueHero', () => {
    render(<HeroDossie maquina={piloto} />);
    expect(screen.getByText('Dosagem')).toBeInTheDocument();
    expect(screen.getByText('Comando')).toBeInTheDocument();
  });

  it('usa os 3 primeiros specsMaquina quando destaqueHero está ausente', () => {
    render(<HeroDossie maquina={{ ...piloto, destaqueHero: undefined }} />);
    expect(screen.getByText('Sistema de datação')).toBeInTheDocument();
  });

  it('sem capacidadeMaxima não renderiza o ticker (valor vira texto puro)', () => {
    const { container } = render(
      <HeroDossie maquina={{ ...piloto, capacidadeMaxima: undefined }} />
    );
    expect(container.querySelector('[data-ticker]')).toBeNull();
  });
});
