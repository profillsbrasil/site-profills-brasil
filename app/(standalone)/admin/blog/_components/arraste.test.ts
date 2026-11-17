import { posicaoDaFicha } from './arraste';
import { describe, expect, it } from 'vitest';

const linhaAlvo = { esquerda: 544, direita: 968 };
const largura = 140;

describe('posicaoDaFicha', () => {
  it('segue o ponteiro quando não há alvo lateral', () => {
    expect(posicaoDaFicha({ x: 700, y: 300 }, largura, null)).toEqual({
      x: 714,
      y: 314
    });
  });

  it('sai pela esquerda da linha alvo, sem entrar nela', () => {
    const { x } = posicaoDaFicha({ x: 574, y: 300 }, largura, {
      lado: 'esquerda',
      ...linhaAlvo
    });

    expect(x + largura).toBeLessThan(linhaAlvo.esquerda);
  });

  it('sai pela direita da linha alvo, sem entrar nela', () => {
    const { x } = posicaoDaFicha({ x: 938, y: 300 }, largura, {
      lado: 'direita',
      ...linhaAlvo
    });

    expect(x).toBeGreaterThan(linhaAlvo.direita);
  });

  it('fica além do ponteiro quando ele já passou da borda', () => {
    const { x } = posicaoDaFicha({ x: 990, y: 300 }, largura, {
      lado: 'direita',
      ...linhaAlvo
    });

    expect(x).toBeGreaterThan(990);
  });
});
