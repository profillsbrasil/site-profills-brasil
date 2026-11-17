import { posicaoDaFicha } from './arraste';
import { describe, expect, it } from 'vitest';

const linhaAlvo = { esquerda: 544, direita: 968 };
const ficha = { largura: 140, altura: 30 };
const tela = { largura: 1440, altura: 900 };

const inteiraNaTela = ({ x, y }: { x: number; y: number }) =>
  x >= 0 &&
  y >= 0 &&
  x + ficha.largura <= tela.largura &&
  y + ficha.altura <= tela.altura;

describe('posicaoDaFicha', () => {
  it('segue o ponteiro quando não há alvo lateral', () => {
    expect(posicaoDaFicha({ x: 700, y: 300 }, ficha, null, tela)).toEqual({
      x: 714,
      y: 314
    });
  });

  it('sai pela esquerda da linha alvo, sem entrar nela', () => {
    const { x } = posicaoDaFicha(
      { x: 574, y: 300 },
      ficha,
      { lado: 'esquerda', ...linhaAlvo },
      tela
    );

    expect(x + ficha.largura).toBeLessThan(linhaAlvo.esquerda);
  });

  it('sai pela direita da linha alvo, sem entrar nela', () => {
    const { x } = posicaoDaFicha(
      { x: 938, y: 300 },
      ficha,
      { lado: 'direita', ...linhaAlvo },
      tela
    );

    expect(x).toBeGreaterThan(linhaAlvo.direita);
  });

  it('fica além do ponteiro quando ele já passou da borda', () => {
    const { x } = posicaoDaFicha(
      { x: 990, y: 300 },
      ficha,
      { lado: 'direita', ...linhaAlvo },
      tela
    );

    expect(x).toBeGreaterThan(990);
  });

  it.each([
    ['em cima', { x: 700, y: 0 }],
    ['embaixo', { x: 700, y: 899 }],
    ['na esquerda', { x: 0, y: 450 }],
    ['na direita', { x: 1439, y: 450 }],
    ['no canto de baixo à direita', { x: 1439, y: 899 }]
  ])('fica inteira na tela com o ponteiro rente à borda %s', (_, ponteiro) => {
    expect(inteiraNaTela(posicaoDaFicha(ponteiro, ficha, null, tela))).toBe(
      true
    );
  });

  it('perto da borda de baixo sobe para cima do ponteiro, sem cobri-lo', () => {
    const { y } = posicaoDaFicha({ x: 700, y: 890 }, ficha, null, tela);

    expect(y + ficha.altura).toBeLessThan(890);
  });

  it('com alvo lateral e ponteiro embaixo, fica na tela e fora da linha alvo', () => {
    const posicao = posicaoDaFicha(
      { x: 960, y: 895 },
      ficha,
      { lado: 'direita', ...linhaAlvo },
      tela
    );

    expect(inteiraNaTela(posicao)).toBe(true);
    expect(posicao.x).toBeGreaterThan(linhaAlvo.direita);
  });
});
