// @vitest-environment node
import { NextRequest } from 'next/server';

import { buscarVendedorPorCodigo } from '@/lib/crm/referral';

import { INDICACAO_COOKIE, assinarIndicacao } from './cookie-server';
import { resolverDestinatario } from './destinatario';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/utils/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() }
}));
vi.mock('@/lib/crm/referral', () => ({ buscarVendedorPorCodigo: vi.fn() }));

const vendedor = {
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  referral_code: 'MARIA-10',
  contato: '11987654321'
};

function req(cookie?: string) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: cookie ? { cookie: `${INDICACAO_COOKIE}=${cookie}` } : {}
  });
}

beforeAll(() => {
  process.env.INDICACAO_COOKIE_SECRET =
    'segredo-de-teste-com-bytes-suficientes-para-hs256';
  process.env.GMAIL_USER_RECEIVER = 'caixa@profills.test';
});

beforeEach(() => {
  vi.mocked(buscarVendedorPorCodigo).mockReset();
});

describe('resolverDestinatario', () => {
  it('sem cookie: caixa padrão, sem consultar o CRM', async () => {
    await expect(resolverDestinatario(req())).resolves.toEqual({
      para: 'caixa@profills.test',
      vendedor: null
    });
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });

  it('cookie válido e CRM 200: e-mail do vendedor', async () => {
    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'encontrado',
      vendedor
    });
    const token = await assinarIndicacao(vendedor);
    await expect(resolverDestinatario(req(token))).resolves.toEqual({
      para: 'maria@profills.com.br',
      vendedor
    });
    expect(buscarVendedorPorCodigo).toHaveBeenCalledWith('MARIA-10');
  });

  it('cookie válido mas CRM 404 ou indisponível: caixa padrão', async () => {
    const token = await assinarIndicacao(vendedor);
    for (const tipo of ['nao-encontrado', 'indisponivel'] as const) {
      vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({ tipo });
      await expect(resolverDestinatario(req(token))).resolves.toEqual({
        para: 'caixa@profills.test',
        vendedor: null
      });
    }
  });

  it('vendedor com e-mail inválido: caixa padrão', async () => {
    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'encontrado',
      vendedor: { ...vendedor, email: 'a@b.com, evil@x.com' }
    });
    const token = await assinarIndicacao(vendedor);
    await expect(resolverDestinatario(req(token))).resolves.toEqual({
      para: 'caixa@profills.test',
      vendedor: null
    });
  });

  it('cookie adulterado: caixa padrão, sem consultar', async () => {
    await expect(resolverDestinatario(req('a.b.c'))).resolves.toEqual({
      para: 'caixa@profills.test',
      vendedor: null
    });
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });
});
