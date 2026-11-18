import {
  EXCECOES,
  LARGURA_MAXIMA,
  TETO_BYTES,
  listarImagens
} from './limites.ts';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

async function medir(caminho: string) {
  const [{ size }, { width }] = await Promise.all([
    stat(caminho),
    sharp(caminho).metadata()
  ]);

  return {
    caminho,
    bytes: size,
    largura: width,
    foraDoLimite: size > TETO_BYTES || width > LARGURA_MAXIMA
  };
}

describe('originais de imagem', () => {
  it('não passam de 3840 px nem de 5 MiB, fora as exceções medidas', async () => {
    const medidas = await Promise.all((await listarImagens()).map(medir));

    const fora = medidas.filter(
      (m) => m.foraDoLimite && !(m.caminho in EXCECOES)
    );

    expect(
      fora,
      'rode node tools/imagens/recomprimir.ts <arquivo> e grave com --aplicar'
    ).toEqual([]);
  });

  it('cada exceção ainda existe e ainda passa do limite', async () => {
    const medidas = await Promise.all(Object.keys(EXCECOES).map(medir));
    expect(
      medidas.filter((m) => !m.foraDoLimite).map((m) => m.caminho)
    ).toEqual([]);
  });
});
