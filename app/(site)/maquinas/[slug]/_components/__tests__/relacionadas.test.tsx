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
  it('renderiza até 3 máquinas da mesma categoria para o piloto', () => {
    const { container } = render(<Relacionadas maquina={piloto} />);
    const links = container.querySelectorAll('a');
    expect(links.length).toBe(3);
    // mesma categoria (Stand-up pouch), rankeadas por embalagem em comum + capacidade próxima
    expect(screen.getByText('Linha Pouch')).toBeInTheDocument();
    expect(screen.getByText('Linha Pouch Mini')).toBeInTheDocument();
    expect(screen.getByText('Linha Pouch Compacta')).toBeInTheDocument();
    // nunca lista a própria máquina
    expect(
      container.querySelector(`a[href='/maquinas/${piloto.slug}']`)
    ).toBeNull();
  });

  it('não renderiza nada quando não há relacionadas (máquina isolada fake)', () => {
    const isolada: MaquinaCatalogo = {
      ...piloto,
      slug: 'isolada-fake',
      categoria: 'Fim de linha',
      embalagensCompativeis: []
    };
    // 'Fim de linha' tem só a Envolvedora no registry — que compartilha 0
    // embalagens com a isolada, mas é mesma categoria, então aparece.
    // Para o caso genuinamente vazio: categoria sem NENHUMA outra máquina.
    const sozinha: MaquinaCatalogo = {
      ...isolada,
      categoria: 'Embalagens rígidas e higienização' // só a Lavadora vive aqui
    };
    const { container } = render(
      <Relacionadas maquina={{ ...sozinha, slug: 'maquina-lavagem-galoes' }} />
    );
    // a Lavadora é a única da categoria e é "ela mesma" (slug igual) e não há
    // interseção de embalagens com outras categorias → bloco some por completo
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
      // a fake sem foto não pode roubar a vaga de uma candidata real
      expect(container.querySelectorAll('a').length).toBe(3);
      expect(screen.getByText('Linha Pouch Compacta')).toBeInTheDocument();
    });
  });
});
