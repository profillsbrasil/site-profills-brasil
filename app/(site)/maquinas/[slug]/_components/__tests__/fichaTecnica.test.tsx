import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';
import { render, screen } from '@testing-library/react';

import { FichaTecnica } from '../fichaTecnica';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: 'img'
}));

describe('FichaTecnica', () => {
  it('renderiza as duas placas com todos os campos', () => {
    render(<FichaTecnica maquina={piloto} />);
    expect(screen.getByText('Máquina')).toBeInTheDocument();
    expect(screen.getByText('Embalagem')).toBeInTheDocument();
    expect(screen.getByText('Potência ativa instalada')).toBeInTheDocument();
    expect(screen.getByText('8,97 kW')).toBeInTheDocument();
    expect(screen.getByText('Materiais compatíveis')).toBeInTheDocument();
  });

  it('renderiza os dois disclaimers editoriais do docx', () => {
    render(<FichaTecnica maquina={piloto} />);
    expect(
      screen.getByText(
        /A produção varia conforme produto, volume, embalagem e configuração do projeto/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Fonte: Catálogo de Máquinas Profills 2026/)
    ).toBeInTheDocument();
  });

  it('não renderiza linha para campo ausente (arrays curtos não quebram)', () => {
    render(
      <FichaTecnica
        maquina={{
          ...piloto,
          specsMaquina: [{ rotulo: 'Comando', valor: 'CLP' }]
        }}
      />
    );
    expect(screen.queryByText('Potência ativa instalada')).toBeNull();
  });
});
