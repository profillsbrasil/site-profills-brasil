// @vitest-environment node
import { listarOrfas } from './orfas.ts';
import { describe, expect, it } from 'vitest';

describe('imagens de lib/images', () => {
  it('toda imagem é importada ou citada por app/, components/, lib/ ou public/', async () => {
    expect(
      await listarOrfas(),
      'apague a imagem com git rm ou importe-a onde ela aparece'
    ).toEqual([]);
  });
});
