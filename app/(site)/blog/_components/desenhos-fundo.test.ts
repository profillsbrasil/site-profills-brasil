import { PASSO_PX, quantosDesenhos } from './desenhos-fundo';
import { describe, expect, it } from 'vitest';

describe('sketches do fundo do blog', () => {
  it('mostra poucos numa página curta e mais numa longa, no mesmo espaçamento', () => {
    expect(quantosDesenhos(900, PASSO_PX.listagem)).toBe(3);
    expect(quantosDesenhos(2500, PASSO_PX.listagem)).toBe(7);
    expect(quantosDesenhos(6000, PASSO_PX.listagem)).toBe(15);
    expect(quantosDesenhos(900, PASSO_PX.leitura)).toBe(2);
  });

  it('nunca fica sem sketch, nem antes de medir a página', () => {
    expect(quantosDesenhos(0, PASSO_PX.listagem)).toBe(1);
  });
});
