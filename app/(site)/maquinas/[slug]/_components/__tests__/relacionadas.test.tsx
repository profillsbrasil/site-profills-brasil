import { maquinasCatalogo } from '@/lib/data/maquinas';
import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';
import { getMaquinasRelacionadas } from '@/lib/data/maquinas/relacionadas';
import type { MaquinaCatalogo } from '@/lib/data/maquinas/types';
import { render, screen } from '@testing-library/react';

import { Relacionadas } from '../relacionadas';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: 'img'
}));

// embla-carousel lê matchMedia e ResizeObserver (ausentes no jsdom) para
// configurar breakpoints e medir slides; mesmo stub de matchMedia usado em
// cardsGridMaquinas.test.tsx.
vi.stubGlobal('matchMedia', () => ({
  matches: false,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}));

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverStub);

describe('Relacionadas', () => {
  it('renderiza o pool ranqueado inteiro, mesma categoria primeiro', () => {
    const { container } = render(<Relacionadas maquina={piloto} />);
    const esperado = getMaquinasRelacionadas(piloto, maquinasCatalogo, {
      minimo: 8
    });
    const links = container.querySelectorAll('a');
    expect(links.length).toBe(esperado.length);
    expect(esperado.length).toBeGreaterThan(3); // o carrossel tem o que deslizar
    // mesma categoria (Stand-up pouch) abre a fila, rankeada por embalagem
    // em comum + capacidade próxima
    expect(screen.getByText('Linha Pouch')).toBeInTheDocument();
    expect(screen.getByText('Linha Pouch Mini')).toBeInTheDocument();
    expect(screen.getByText('Linha Pouch Compacta')).toBeInTheDocument();
    const primeiros = Array.from(links)
      .slice(0, 3)
      .map((a) => a.getAttribute('href'));
    for (const m of esperado.slice(0, 3)) {
      expect(primeiros).toContain(`/maquinas/${m.slug}`);
    }
    // nunca lista a própria máquina
    expect(
      container.querySelector(`a[href='/maquinas/${piloto.slug}']`)
    ).toBeNull();
  });

  it('máquina isolada (pool natural vazio) ganha a fileira mínima por complemento', () => {
    // categoria onde só a Lavadora vive + zero embalagens em comum: pool
    // ranqueado vazio — antes o bloco sumia; agora o complemento garante a
    // fileira cheia do carrossel
    const sozinha: MaquinaCatalogo = {
      ...piloto,
      slug: 'maquina-lavagem-galoes',
      categoria: 'Embalagens rígidas e higienização',
      embalagensCompativeis: []
    };
    const { container } = render(<Relacionadas maquina={sozinha} />);
    expect(container.querySelectorAll('a').length).toBe(8);
    // nunca ela mesma
    expect(
      container.querySelector(`a[href='/maquinas/maquina-lavagem-galoes']`)
    ).toBeNull();
  });

  it('minimo completa sem duplicar e nunca inclui a própria máquina', () => {
    for (const m of maquinasCatalogo.filter(
      (x) => x.imagens && x.tipoPagina === 'padrao'
    )) {
      const r = getMaquinasRelacionadas(m, maquinasCatalogo, { minimo: 8 });
      expect(r.length).toBeGreaterThanOrEqual(8);
      expect(new Set(r.map((x) => x.slug)).size).toBe(r.length);
      expect(r.some((x) => x.slug === m.slug)).toBe(false);
    }
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

    it('não aparece no carrossel de relacionadas', () => {
      const esperadoSemFake = getMaquinasRelacionadas(
        piloto,
        maquinasCatalogo,
        {
          minimo: 8
        }
      ).length;
      maquinasCatalogo.push(semFoto);
      const { container } = render(<Relacionadas maquina={piloto} />);
      expect(screen.queryByText('Máquina Sem Foto')).toBeNull();
      // a fake sem foto não entra nem muda o tamanho do pool real
      expect(container.querySelectorAll('a').length).toBe(esperadoSemFake);
      expect(screen.getByText('Linha Pouch Compacta')).toBeInTheDocument();
    });
  });
});
