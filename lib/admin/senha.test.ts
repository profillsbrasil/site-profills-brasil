// @vitest-environment node
import { conferirSenha, hashSenha, hashValido } from './senha.mjs';
import { describe, expect, it } from 'vitest';

describe('senha do admin', () => {
  it('confere a senha certa e recusa a errada', async () => {
    const hash = await hashSenha('uma senha longa de teste');

    expect(await conferirSenha('uma senha longa de teste', hash)).toBe(true);
    expect(await conferirSenha('uma senha longa de testE', hash)).toBe(false);
  });

  it('gera o formato scrypt sem $ e com sal novo a cada vez', async () => {
    const [a, b] = await Promise.all([
      hashSenha('mesma senha de teste'),
      hashSenha('mesma senha de teste')
    ]);

    expect(a).toMatch(/^scrypt:32768:8:1:[\w-]{22}:[\w-]{43}$/);
    expect(a).not.toContain('$');
    expect(a).not.toBe(b);
  });

  it('recusa hash fora do formato sem lançar', async () => {
    const hash = await hashSenha('uma senha longa de teste');
    const partes = hash.split(':');

    for (const ruim of [
      '',
      'texto qualquer',
      hash.replace('scrypt', 'bcrypt'),
      [...partes.slice(0, 5), 'curto'].join(':'),
      ['scrypt', '1048576', '8', '1', ...partes.slice(4)].join(':'),
      ['scrypt', '30000', '8', '1', ...partes.slice(4)].join(':'),
      `${hash}:extra`
    ]) {
      expect(hashValido(ruim)).toBe(false);
      expect(await conferirSenha('uma senha longa de teste', ruim)).toBe(false);
    }

    expect(hashValido(hash)).toBe(true);
  });
});
