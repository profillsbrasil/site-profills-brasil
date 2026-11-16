// @vitest-environment node
import { digitar } from './teclas-senha.mjs';
import { describe, expect, it } from 'vitest';

const SETAS = ['\x1b[A', '\x1b[B', '\x1b[C', '\x1b[D', '\x1bOA', '\x1b[3~'];

describe('teclas da senha do admin', () => {
  it('soma letras, apaga a última e termina no enter', () => {
    expect(digitar('', 'abç😀')).toEqual({ senha: 'abç😀', fim: null });
    expect(digitar('abç😀', '\x7f\x7f')).toEqual({ senha: 'ab', fim: null });
    expect(digitar('ab', 'c\rdepois')).toEqual({ senha: 'abc', fim: 'enter' });
    expect(digitar('ab', '\x03')).toEqual({ senha: 'ab', fim: 'cancelar' });
  });

  it('ignora Ctrl-D, Tab, Esc e as setas', () => {
    for (const tecla of ['\x04', '\t', '\x1b', '\x00', ...SETAS]) {
      expect(digitar('ab', tecla), JSON.stringify(tecla)).toEqual({
        senha: 'ab',
        fim: null
      });
    }

    expect(digitar('', `a${SETAS.join('')}b\x04c`)).toEqual({
      senha: 'abc',
      fim: null
    });
  });
});
