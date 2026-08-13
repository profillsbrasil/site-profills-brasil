import { envasadoraStandUpPouchSpeed as piloto } from './envasadora-stand-up-pouch-speed';
import { getMaquinasRelacionadas } from './relacionadas';
import type { MaquinaCatalogo } from './types';
import { describe, expect, it } from 'vitest';

// Fixture mínima: só os campos que o algoritmo lê importam para o teste.
function fixture(overrides: Partial<MaquinaCatalogo>): MaquinaCatalogo {
  return { ...piloto, ...overrides } as MaquinaCatalogo;
}

describe('getMaquinasRelacionadas', () => {
  it('prioriza embalagens em comum sobre proximidade de capacidade e prioriza mesma categoria', () => {
    const referencia = fixture({
      embalagensCompativeis: ['Pouch', 'Sachê'],
      capacidadeMaxima: 5400
    });
    const duasEmbalagens = fixture({
      slug: 'duas-embalagens',
      embalagensCompativeis: ['Pouch', 'Sachê'],
      capacidadeMaxima: 500 // longe da referência, mas 2 embalagens em comum
    });
    const umaEmbalagem = fixture({
      slug: 'uma-embalagem',
      embalagensCompativeis: ['Pouch'],
      capacidadeMaxima: 5400 // capacidade idêntica, mas só 1 embalagem em comum
    });
    const outraCategComEmbalagem = fixture({
      slug: 'c',
      categoria: 'Embalagens flexíveis',
      embalagensCompativeis: ['Pouch', 'Sachê']
    });
    const semRelacao = fixture({
      slug: 'd',
      categoria: 'Fim de linha',
      embalagensCompativeis: ['Fardo']
    });

    const resultado = getMaquinasRelacionadas(referencia, [
      referencia,
      umaEmbalagem,
      duasEmbalagens,
      outraCategComEmbalagem,
      semRelacao
    ]);
    expect(resultado.map((m) => m.slug)).toEqual([
      'duas-embalagens',
      'uma-embalagem',
      'c'
    ]);
  });

  it('retorna vazio quando só existe a própria máquina', () => {
    expect(getMaquinasRelacionadas(piloto, [piloto])).toEqual([]);
  });

  describe('capacidade ausente é neutra (não vence nem perde por proximidade)', () => {
    it('preserva a ordem de entrada quando um candidato não tem capacidade', () => {
      const semCapacidade = fixture({
        slug: 'sem-capacidade',
        capacidadeMaxima: undefined,
        embalagensCompativeis: ['Pouch']
      });
      const comCapacidadeProxima = fixture({
        slug: 'com-capacidade-proxima',
        capacidadeMaxima: 5000,
        embalagensCompativeis: ['Pouch']
      });

      const resultado = getMaquinasRelacionadas(piloto, [
        piloto,
        semCapacidade,
        comCapacidadeProxima
      ]);
      expect(resultado.map((m) => m.slug)).toEqual([
        'sem-capacidade',
        'com-capacidade-proxima'
      ]);
    });

    it('a ordem segue a entrada (estabilidade), não a ausência', () => {
      const semCapacidade = fixture({
        slug: 'sem-capacidade',
        capacidadeMaxima: undefined,
        embalagensCompativeis: ['Pouch']
      });
      const comCapacidadeProxima = fixture({
        slug: 'com-capacidade-proxima',
        capacidadeMaxima: 5000,
        embalagensCompativeis: ['Pouch']
      });

      const resultado = getMaquinasRelacionadas(piloto, [
        piloto,
        comCapacidadeProxima,
        semCapacidade
      ]);
      expect(resultado.map((m) => m.slug)).toEqual([
        'com-capacidade-proxima',
        'sem-capacidade'
      ]);
    });

    it('capacidade 0 é um valor válido, não é tratada como ausente', () => {
      const capacidadeZero = fixture({
        slug: 'capacidade-zero',
        capacidadeMaxima: 0,
        embalagensCompativeis: ['Pouch']
      });
      const comCapacidadeProxima = fixture({
        slug: 'com-capacidade-proxima',
        capacidadeMaxima: 5000,
        embalagensCompativeis: ['Pouch']
      });

      const resultado = getMaquinasRelacionadas(piloto, [
        piloto,
        capacidadeZero,
        comCapacidadeProxima
      ]);
      expect(resultado.map((m) => m.slug)).toEqual([
        'com-capacidade-proxima',
        'capacidade-zero'
      ]);
    });
  });
});
