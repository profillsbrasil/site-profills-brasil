import { envasadoraStandUpPouchSpeed as piloto } from './envasadora-stand-up-pouch-speed';
import { getMaquinasRelacionadas } from './relacionadas';
import type { MaquinaCatalogo } from './types';
import { describe, expect, it } from 'vitest';

// Fixture mínima: só os campos que o algoritmo lê importam para o teste.
function fixture(overrides: Partial<MaquinaCatalogo>): MaquinaCatalogo {
  return { ...piloto, ...overrides } as MaquinaCatalogo;
}

const mesmaCateg1 = fixture({
  slug: 'a',
  capacidadeMaxima: 5400,
  embalagensCompativeis: ['Pouch']
});
const mesmaCateg2 = fixture({
  slug: 'b',
  capacidadeMaxima: 900,
  embalagensCompativeis: ['Pouch']
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

describe('getMaquinasRelacionadas', () => {
  it('exclui a própria máquina e prioriza mesma categoria por proximidade de capacidade', () => {
    const resultado = getMaquinasRelacionadas(piloto, [
      piloto,
      mesmaCateg2,
      mesmaCateg1,
      outraCategComEmbalagem,
      semRelacao
    ]);
    expect(resultado.map((m) => m.slug)).toEqual(['a', 'b', 'c']);
  });

  it('retorna vazio quando só existe a própria máquina', () => {
    expect(getMaquinasRelacionadas(piloto, [piloto])).toEqual([]);
  });

  it('ignora o critério de capacidade quando um lado não tem o valor', () => {
    const semCapacidade = fixture({ slug: 'e', capacidadeMaxima: undefined });
    const resultado = getMaquinasRelacionadas(piloto, [piloto, semCapacidade]);
    expect(resultado.map((m) => m.slug)).toEqual(['e']);
  });
});
