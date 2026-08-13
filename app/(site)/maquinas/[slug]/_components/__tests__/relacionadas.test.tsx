import { maquinasCatalogo } from '@/lib/data/maquinas';
import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';
import type { MaquinaCatalogo } from '@/lib/data/maquinas/types';
import { render, screen } from '@testing-library/react';

import { Relacionadas } from '../relacionadas';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: 'img'
}));

describe('Relacionadas', () => {
  it('não renderiza nada quando o registry só tem a própria máquina (fase 0)', () => {
    const { container } = render(<Relacionadas maquina={piloto} />);
    expect(container.innerHTML).toBe('');
  });

  describe('com uma máquina relacionada sem imagens no registry', () => {
    const semFoto: MaquinaCatalogo = {
      ...piloto,
      slug: 'sem-foto',
      nome: 'Máquina Sem Foto',
      imagens: undefined
    };

    afterEach(() => {
      const i = maquinasCatalogo.indexOf(semFoto);
      if (i !== -1) maquinasCatalogo.splice(i, 1);
    });

    it('não aparece no grid de relacionadas', () => {
      maquinasCatalogo.push(semFoto);
      const { container } = render(<Relacionadas maquina={piloto} />);
      expect(screen.queryByText('Máquina Sem Foto')).toBeNull();
      expect(container.innerHTML).toBe('');
    });
  });
});
