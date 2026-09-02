// @vitest-environment node
import { NextRequest } from 'next/server';

import { buscarVendedorPorCodigo } from '@/lib/crm/referral';
import {
  INDICACAO_COOKIE,
  assinarIndicacao,
  lerIndicacao
} from '@/lib/indicacao/cookie-server';

import proxy, { config } from './proxy';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/utils/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() }
}));
vi.mock('@/lib/crm/referral', async () => {
  const real =
    await vi.importActual<typeof import('@/lib/crm/referral')>(
      '@/lib/crm/referral'
    );
  return { ...real, buscarVendedorPorCodigo: vi.fn() };
});

const vendedor = {
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  referral_code: 'MARIA-10',
  contato: '11987654321'
};

function req(url: string, cookie?: string) {
  return new NextRequest(url, {
    headers: cookie ? { cookie: `${INDICACAO_COOKIE}=${cookie}` } : {}
  });
}

beforeAll(() => {
  process.env.INDICACAO_COOKIE_SECRET =
    'segredo-de-teste-com-bytes-suficientes-para-hs256';
});

beforeEach(() => {
  vi.mocked(buscarVendedorPorCodigo).mockReset();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

/* Quem avalia o matcher é o Next; aqui só compilamos a string para provar
   que o negative lookahead separa `/api/...` de uma rota que começa com api. */
describe('config.matcher', () => {
  const re = new RegExp(`^${config.matcher[0]}$`);

  it('deixa de fora API, assets e arquivos com extensão', () => {
    for (const rota of [
      '/api/contact',
      '/_next/static/x.js',
      '/sitemap.xml',
      '/robots.txt',
      '/logo.png'
    ]) {
      expect(re.test(rota)).toBe(false);
    }
  });

  it('pega páginas, inclusive as que começam com api', () => {
    for (const rota of ['/', '/sobre', '/maquinas/envasadora', '/apicultura']) {
      expect(re.test(rota)).toBe(true);
    }
  });
});

describe('proxy com ?ref', () => {
  it('grava o cookie e redireciona para a URL sem ref, mantendo os outros parâmetros', async () => {
    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'encontrado',
      vendedor
    });
    const res = await proxy(
      req('http://localhost:3000/maquinas?q=pouch&ref=maria-10')
    );

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe(
      'http://localhost:3000/maquinas?q=pouch'
    );
    const payload = await lerIndicacao(
      res.cookies.get(INDICACAO_COOKIE)?.value
    );
    expect(payload).toMatchObject({
      codigo: 'MARIA-10',
      email: 'maria@profills.com.br'
    });
    expect(buscarVendedorPorCodigo).toHaveBeenCalledWith('MARIA-10');
  });

  it('código inválido: redireciona sem consultar e sem cookie', async () => {
    const res = await proxy(req('http://localhost:3000/?ref=ab'));
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('http://localhost:3000/');
    expect(res.cookies.get(INDICACAO_COOKIE)).toBeUndefined();
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });

  it('sem INDICACAO_COOKIE_SECRET: redireciona limpo, sem CRM e sem cookie', async () => {
    vi.stubEnv('INDICACAO_COOKIE_SECRET', '');
    const res = await proxy(req('http://localhost:3000/?ref=MARIA-10'));
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('http://localhost:3000/');
    expect(res.cookies.get(INDICACAO_COOKIE)).toBeUndefined();
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });

  it('404 ou CRM indisponível: redireciona sem gravar cookie', async () => {
    for (const tipo of ['nao-encontrado', 'indisponivel'] as const) {
      vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({ tipo });
      const res = await proxy(
        req('http://localhost:3000/?ref=OUTRO-1', 'antigo')
      );
      expect(res.status).toBe(302);
      expect(res.cookies.get(INDICACAO_COOKIE)).toBeUndefined();
    }
  });
});

describe('proxy sem ?ref', () => {
  it('sem cookie: segue sem consultar', async () => {
    const res = await proxy(req('http://localhost:3000/sobre'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });

  it('cookie recente: segue sem consultar', async () => {
    const token = await assinarIndicacao(vendedor, new Date());
    const res = await proxy(req('http://localhost:3000/sobre', token));
    expect(res.status).toBe(200);
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });

  it('cookie com mais de 24 h: renova pelo CRM e regrava', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-02T12:00:00Z'));
    const token = await assinarIndicacao(
      vendedor,
      new Date('2026-09-01T11:00:00Z')
    );
    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'encontrado',
      vendedor: { ...vendedor, contato: '11900000000' }
    });

    const res = await proxy(req('http://localhost:3000/sobre', token));

    expect(res.status).toBe(200);
    const payload = await lerIndicacao(
      res.cookies.get(INDICACAO_COOKIE)?.value
    );
    expect(payload).toMatchObject({
      contato: '11900000000',
      consultadoEm: '2026-09-02T12:00:00.000Z'
    });
  });

  it('renovação com 404 apaga o cookie; indisponível mantém', async () => {
    const token = await assinarIndicacao(
      vendedor,
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    );

    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'nao-encontrado'
    });
    const apagado = await proxy(req('http://localhost:3000/sobre', token));
    expect(apagado.cookies.get(INDICACAO_COOKIE)?.value).toBe('');

    vi.mocked(buscarVendedorPorCodigo).mockResolvedValue({
      tipo: 'indisponivel'
    });
    const mantido = await proxy(req('http://localhost:3000/sobre', token));
    expect(mantido.cookies.get(INDICACAO_COOKIE)).toBeUndefined();
  });

  it('cookie com assinatura inválida é apagado', async () => {
    const res = await proxy(
      req('http://localhost:3000/sobre', 'lixo.lixo.lixo')
    );
    expect(res.status).toBe(200);
    expect(res.cookies.get(INDICACAO_COOKIE)?.value).toBe('');
  });

  it('sem INDICACAO_COOKIE_SECRET não apaga o cookie de quem já tem', async () => {
    const token = await assinarIndicacao(vendedor, new Date());
    vi.stubEnv('INDICACAO_COOKIE_SECRET', '');
    const res = await proxy(req('http://localhost:3000/sobre', token));
    expect(res.status).toBe(200);
    expect(res.cookies.get(INDICACAO_COOKIE)).toBeUndefined();
    expect(buscarVendedorPorCodigo).not.toHaveBeenCalled();
  });

  it('nunca bloqueia a página quando algo lança', async () => {
    const token = await assinarIndicacao(
      vendedor,
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    );
    vi.mocked(buscarVendedorPorCodigo).mockRejectedValue(new Error('boom'));
    const res = await proxy(req('http://localhost:3000/sobre', token));
    expect(res.status).toBe(200);
  });
});
