// @vitest-environment node
import {
  buscarVendedorPorCodigo,
  formatarTelefoneBR,
  limparCacheReferral,
  linkWhatsApp,
  normalizarCodigo,
  tamanhoCacheReferral
} from './referral';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/utils/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() }
}));

const vendedor = {
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  referral_code: 'MARIA-10',
  contato: '11987654321'
};

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body
  });
}

describe('normalizarCodigo', () => {
  it('normaliza para maiúsculas e aceita hífen', () => {
    expect(normalizarCodigo(' maria-10 ')).toBe('MARIA-10');
  });

  it('rejeita fora do formato', () => {
    for (const v of [
      'ab',
      'maria 10',
      'maria_10',
      'a'.repeat(21),
      '',
      null,
      undefined
    ]) {
      expect(normalizarCodigo(v)).toBeNull();
    }
  });
});

describe('buscarVendedorPorCodigo', () => {
  beforeEach(() => {
    limparCacheReferral();
    vi.stubEnv('CRM_BASE_URL', 'https://crm.test');
    vi.stubEnv('CRM_EXTERNAL_API_KEY', 'chave-teste');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('devolve encontrado no 200 e manda a chave no header', async () => {
    const fetchMock = mockFetch(200, vendedor);
    vi.stubGlobal('fetch', fetchMock);

    await expect(buscarVendedorPorCodigo('maria-10')).resolves.toEqual({
      tipo: 'encontrado',
      vendedor
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://crm.test/api/external/referral/MARIA-10');
    expect(init.headers['X-API-Key']).toBe('chave-teste');
  });

  it('devolve nao-encontrado no 404 e em código inválido, sem chamar o CRM no inválido', async () => {
    const fetchMock = mockFetch(404, { error: 'not_found' });
    vi.stubGlobal('fetch', fetchMock);
    await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
      tipo: 'nao-encontrado'
    });
    await expect(buscarVendedorPorCodigo('ab')).resolves.toEqual({
      tipo: 'nao-encontrado'
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('devolve indisponivel em 401, 503, erro de rede e sem env', async () => {
    for (const status of [401, 503]) {
      limparCacheReferral();
      vi.stubGlobal('fetch', mockFetch(status, { error: 'x' }));
      await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
        tipo: 'indisponivel'
      });
    }
    limparCacheReferral();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('rede')));
    await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
      tipo: 'indisponivel'
    });

    limparCacheReferral();
    vi.stubEnv('CRM_EXTERNAL_API_KEY', '');
    const fetchMock = mockFetch(200, vendedor);
    vi.stubGlobal('fetch', fetchMock);
    await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
      tipo: 'indisponivel'
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reusa a resposta por 5 minutos e consulta de novo depois', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-02T12:00:00Z'));
    const fetchMock = mockFetch(200, vendedor);
    vi.stubGlobal('fetch', fetchMock);

    await buscarVendedorPorCodigo('MARIA-10');
    await buscarVendedorPorCodigo('maria-10');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.setSystemTime(new Date('2026-09-02T12:05:01Z'));
    await buscarVendedorPorCodigo('MARIA-10');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('200 com envelope ou campo inválido vira indisponivel e não cacheia', async () => {
    const envelope = mockFetch(200, { success: true, data: vendedor });
    vi.stubGlobal('fetch', envelope);
    await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
      tipo: 'indisponivel'
    });
    await buscarVendedorPorCodigo('MARIA-10');
    expect(envelope).toHaveBeenCalledTimes(2);

    limparCacheReferral();
    vi.stubGlobal('fetch', mockFetch(200, { ...vendedor, email: null }));
    await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
      tipo: 'indisponivel'
    });
  });

  it('200 com chaves extras devolve só os campos conhecidos', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch(200, { ...vendedor, senha: 'x', interno: { id: 1 } })
    );
    await expect(buscarVendedorPorCodigo('MARIA-10')).resolves.toEqual({
      tipo: 'encontrado',
      vendedor
    });
  });

  it('mantém o cache dentro do teto de 500 entradas', async () => {
    vi.stubGlobal('fetch', mockFetch(404, { error: 'not_found' }));
    for (let i = 0; i < 501; i++) {
      await buscarVendedorPorCodigo(`COD-${i}`);
    }
    expect(tamanhoCacheReferral()).toBeLessThanOrEqual(500);
    limparCacheReferral();
    expect(tamanhoCacheReferral()).toBe(0);
  });

  it('não cacheia indisponivel', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('rede'));
    vi.stubGlobal('fetch', fetchMock);
    await buscarVendedorPorCodigo('MARIA-10');
    await buscarVendedorPorCodigo('MARIA-10');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('telefone', () => {
  it('formata 11 e 10 dígitos e monta o wa.me', () => {
    expect(formatarTelefoneBR('11987654321')).toBe('(11) 98765-4321');
    expect(formatarTelefoneBR('1133334444')).toBe('(11) 3333-4444');
    expect(formatarTelefoneBR('123')).toBe('123');
    expect(formatarTelefoneBR(null)).toBe('');
    expect(linkWhatsApp('11987654321')).toBe('https://wa.me/5511987654321');
    expect(linkWhatsApp(null)).toBeNull();
  });
});
