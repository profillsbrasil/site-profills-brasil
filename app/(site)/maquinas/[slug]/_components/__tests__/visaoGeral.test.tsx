import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';
import { render, screen } from '@testing-library/react';

import { VisaoGeral } from '../visaoGeral';
import { describe, expect, it } from 'vitest';

describe('VisaoGeral', () => {
  it('renderiza o descritivo e todos os recursos', () => {
    render(<VisaoGeral maquina={piloto} />);
    expect(
      screen.getByText(/solução mecânica de alta velocidade/)
    ).toBeInTheDocument();
    for (const recurso of piloto.recursos) {
      expect(screen.getByText(recurso)).toBeInTheDocument();
    }
  });

  it('tem a âncora visao-geral', () => {
    const { container } = render(<VisaoGeral maquina={piloto} />);
    expect(container.querySelector('#visao-geral')).not.toBeNull();
  });

  it('omite a placa de recursos quando o array é vazio', () => {
    render(<VisaoGeral maquina={{ ...piloto, recursos: [] }} />);
    expect(screen.queryByText('Recursos e especiais')).toBeNull();
  });
});
