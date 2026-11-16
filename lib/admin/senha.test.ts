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
    expect(hashValido(`${hash}\n`)).toBe(true);
  });

  it('recusa custo fraco, escrito fora de dígitos ou acima da memória do scrypt', async () => {
    const hash = await hashSenha('uma senha longa de teste');
    const [, , , , sal, derivado] = hash.split(':');

    const custo = (n: string, r: string, p: string, s = sal) =>
      ['scrypt', n, r, p, s, derivado].join(':');

    for (const ruim of [
      custo('2', '1', '1'),
      custo('16384', '8', '1'),
      custo('0x8000', '8', '1'),
      custo('32768', '4', '1'),
      custo('32768', '8', '1e0'),
      custo('32768', '8', '0'),
      custo('65536', '8', '1'),
      custo('32768', '8', '1', `${sal.slice(0, -1)}+`)
    ]) {
      expect(hashValido(ruim), ruim).toBe(false);
      await expect(
        conferirSenha('uma senha longa de teste', ruim)
      ).resolves.toBe(false);
    }
  });
});
