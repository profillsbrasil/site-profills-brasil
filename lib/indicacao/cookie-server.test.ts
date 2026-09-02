// @vitest-environment node
import {
  INDICACAO_COOKIE,
  INDICACAO_MAX_AGE,
  assinarIndicacao,
  lerIndicacao,
  opcoesCookieIndicacao,
  precisaRenovar,
  temSegredoIndicacao
} from './cookie-server';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

const vendedor = {
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  referral_code: 'MARIA-10',
  contato: null
};

beforeAll(() => {
  process.env.INDICACAO_COOKIE_SECRET =
    'segredo-de-teste-com-bytes-suficientes-para-hs256';
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('cookie-server', () => {
  it('faz round-trip do vendedor com consultadoEm', async () => {
    const agora = new Date('2026-09-02T12:00:00Z');
    const token = await assinarIndicacao(vendedor, agora);
    await expect(lerIndicacao(token)).resolves.toEqual({
      codigo: 'MARIA-10',
      nome: 'Maria Silva',
      email: 'maria@profills.com.br',
      contato: null,
      consultadoEm: '2026-09-02T12:00:00.000Z'
    });
  });

  it('devolve null para token adulterado, vazio ou undefined', async () => {
    const token = await assinarIndicacao(vendedor);
    await expect(lerIndicacao(token.slice(0, -2) + 'aa')).resolves.toBeNull();
    await expect(lerIndicacao('')).resolves.toBeNull();
    await expect(lerIndicacao(undefined)).resolves.toBeNull();
  });

  it('expira em 30 dias', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-02T12:00:00Z'));
    const token = await assinarIndicacao(vendedor, new Date());
    vi.setSystemTime(new Date('2026-10-02T12:00:01Z'));
    await expect(lerIndicacao(token)).resolves.toBeNull();
  });

  it('precisaRenovar só depois de 24 h', () => {
    const payload = {
      codigo: 'MARIA-10',
      nome: 'Maria',
      email: 'm@p.br',
      contato: null,
      consultadoEm: '2026-09-02T12:00:00.000Z'
    };
    expect(precisaRenovar(payload, new Date('2026-09-03T11:59:59Z'))).toBe(
      false
    );
    expect(precisaRenovar(payload, new Date('2026-09-03T12:00:01Z'))).toBe(
      true
    );
    expect(precisaRenovar({ ...payload, consultadoEm: 'lixo' })).toBe(true);
  });

  it('expõe nome, validade e atributos do cookie', () => {
    expect(INDICACAO_COOKIE).toBe('profills_indicacao');
    expect(INDICACAO_MAX_AGE).toBe(30 * 24 * 60 * 60);
    expect(opcoesCookieIndicacao()).toMatchObject({
      path: '/',
      maxAge: INDICACAO_MAX_AGE,
      sameSite: 'lax',
      httpOnly: false
    });
  });

  it('secure só fora de development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(opcoesCookieIndicacao().secure).toBe(false);
    vi.stubEnv('NODE_ENV', 'production');
    expect(opcoesCookieIndicacao().secure).toBe(true);
  });

  it('temSegredoIndicacao acompanha a env', () => {
    expect(temSegredoIndicacao()).toBe(true);
    vi.stubEnv('INDICACAO_COOKIE_SECRET', '');
    expect(temSegredoIndicacao()).toBe(false);
  });
});
