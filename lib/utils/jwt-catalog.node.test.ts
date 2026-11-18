import { signCatalogToken, verifyCatalogToken } from './jwt-catalog';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

beforeAll(() => {
  process.env.CATALOG_TOKEN_SECRET =
    'test-secret-with-enough-bytes-for-hmac-256-algorithm';
});

afterEach(() => {
  vi.useRealTimers();
});

describe('jwt-catalog', () => {
  it('faz round-trip de payload válido', async () => {
    const token = await signCatalogToken(
      { email: 'cliente@exemplo.com', name: 'Cliente Teste' },
      '7d'
    );

    const result = await verifyCatalogToken(token);
    expect(result).toMatchObject({
      ok: true,
      payload: { email: 'cliente@exemplo.com', name: 'Cliente Teste' }
    });
  });

  it('retorna reason="expired" para token vencido', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const token = await signCatalogToken({ email: 'a@b.com', name: 'X' }, '1h');
    vi.setSystemTime(Date.now() + 2 * 60 * 60 * 1000);
    const result = await verifyCatalogToken(token);
    expect(result).toEqual({ ok: false, reason: 'expired' });
  });

  it('retorna reason="invalid" para token adulterado', async () => {
    const token = await signCatalogToken({ email: 'a@b.com', name: 'X' }, '7d');
    const tampered = token.slice(0, -2) + 'aa';
    const result = await verifyCatalogToken(tampered);
    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });

  it('retorna reason="invalid" para string que não é JWT', async () => {
    const result = await verifyCatalogToken('lorem-ipsum');
    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });
});
