import { abrirPglite } from '@/lib/banco/pglite';
import type { Consulta } from '@/lib/banco/tipos';
import { logger } from '@/lib/utils/logger';

import { hashSenha } from './senha.mjs';
import {
  COOKIE_SESSAO,
  LIMITE_TENTATIVAS,
  atalhoDev,
  autorAtual,
  contarTentativa,
  entrar,
  sair
} from './sessao';
import { SignJWT } from 'jose';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

type OpcoesCookie = {
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  secure?: boolean;
  maxAge?: number;
};

type CookieGuardado = { value: string; opcoes: OpcoesCookie };

type EstadoDoTeste = {
  banco: Consulta | null;
  jar: Map<string, CookieGuardado>;
};

const estado = vi.hoisted(() => {
  const inicial: EstadoDoTeste = { banco: null, jar: new Map() };

  return inicial;
});

vi.mock('@/lib/banco/conexao', () => ({
  consultar: (sql: string, valores?: (string | number | null)[]) => {
    if (!estado.banco) throw new Error('banco do teste não abriu');

    return estado.banco(sql, valores);
  }
}));

const leuCookies = vi.hoisted(() => ({ vezes: 0 }));

const jarFalso = {
  get: (nome: string) => {
    const guardado = estado.jar.get(nome);

    return guardado && { name: nome, value: guardado.value };
  },
  set: (nome: string, value: string, opcoes: OpcoesCookie) =>
    estado.jar.set(nome, { value, opcoes }),
  delete: ({ name }: { name: string }) => estado.jar.delete(name)
};

vi.mock('next/headers', () => ({
  cookies: async () => {
    leuCookies.vezes += 1;

    return jarFalso;
  }
}));

const SENHA = 'senha longa só do teste';
const SEGREDO = 'segredo-de-teste-com-mais-de-32-caracteres';
let hash = '';
let banco: Consulta;

const configurar = () => {
  vi.stubEnv('ADMIN_USUARIO', 'dono');
  vi.stubEnv('ADMIN_SENHA_HASH', hash);
  vi.stubEnv('ADMIN_SESSAO_SEGREDO', SEGREDO);
};

beforeAll(async () => {
  [hash, banco] = await Promise.all([hashSenha(SENHA), abrirPglite()]);
}, 30_000);

beforeEach(async () => {
  estado.banco = banco;
  estado.jar.clear();
  await banco('delete from admin_tentativas_login');
  configurar();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('login do admin', () => {
  it('entra com usuário e senha certos e grava o cookie restrito ao admin', async () => {
    expect(await entrar('dono', SENHA)).toEqual({ tipo: 'ok' });
    expect(estado.jar.get(COOKIE_SESSAO)?.opcoes).toEqual({
      httpOnly: true,
      sameSite: 'strict',
      path: '/admin',
      secure: true,
      maxAge: 7 * 24 * 60 * 60
    });
    expect(await autorAtual()).toEqual({ usuario: 'dono' });
  });

  it('recusa senha ou usuário errados sem gravar cookie', async () => {
    expect(await entrar('dono', 'senha errada do teste')).toEqual({
      tipo: 'recusado'
    });
    expect(await entrar('outro', SENHA)).toEqual({ tipo: 'recusado' });
    expect(estado.jar.size).toBe(0);
    expect(await autorAtual()).toBeNull();
  });

  it('sair apaga a sessão', async () => {
    await entrar('dono', SENHA);
    await sair();

    expect(await autorAtual()).toBeNull();
  });

  it('trocar a senha derruba a sessão aberta', async () => {
    await entrar('dono', SENHA);
    vi.stubEnv(
      'ADMIN_SENHA_HASH',
      await hashSenha('outra senha longa do teste')
    );

    expect(await autorAtual()).toBeNull();
  });

  it('recusa cookie assinado com outra chave ou sem assinatura', async () => {
    const forjado = await new SignJWT()
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('dono')
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(SEGREDO));

    const semAssinatura = `${btoa('{"alg":"none"}')}.${btoa('{"sub":"dono"}')}.`;

    for (const token of [forjado, semAssinatura, 'lixo']) {
      estado.jar.set(COOKIE_SESSAO, { value: token, opcoes: {} });

      expect(await autorAtual()).toBeNull();
    }
  });

  it.each([
    ['sem usuário', 'ADMIN_USUARIO', ''],
    ['sem hash', 'ADMIN_SENHA_HASH', ''],
    ['com hash fora do formato', 'ADMIN_SENHA_HASH', 'senha-em-texto'],
    ['sem segredo', 'ADMIN_SESSAO_SEGREDO', ''],
    ['com segredo curto', 'ADMIN_SESSAO_SEGREDO', 'curto']
  ])('fica fechado %s', async (_, nome, valor) => {
    await entrar('dono', SENHA);
    vi.spyOn(logger, 'error').mockImplementation(() => undefined);
    vi.stubEnv(nome, valor);
    leuCookies.vezes = 0;

    expect(await autorAtual()).toBeNull();
    // Ler o cookie é o que torna a página do admin dinâmica no next build, que roda sem essas envs.
    expect(leuCookies.vezes).toBe(1);
    expect(await entrar('dono', SENHA)).toEqual({ tipo: 'indisponivel' });
  });

  it('fica fechado, sem lançar, com hash de custo que o scrypt recusa', async () => {
    vi.spyOn(logger, 'error').mockImplementation(() => undefined);
    vi.stubEnv('ADMIN_SENHA_HASH', hash.replace(':32768:', ':65536:'));

    await expect(entrar('dono', SENHA)).resolves.toEqual({
      tipo: 'indisponivel'
    });
  });

  it('fica fechado com o banco fora, mesmo com a senha certa', async () => {
    vi.spyOn(logger, 'error').mockImplementation(() => undefined);
    estado.banco = () => Promise.reject(new Error('ECONNREFUSED'));

    expect(await entrar('dono', SENHA)).toEqual({ tipo: 'indisponivel' });
    expect(estado.jar.size).toBe(0);
  });
});

describe('limite de tentativas', { timeout: 30_000 }, () => {
  it('bloqueia a tentativa seguinte à décima, até com a senha certa, e avisa no log', async () => {
    const aviso = vi.spyOn(logger, 'error').mockImplementation(() => undefined);

    for (let i = 0; i < LIMITE_TENTATIVAS; i++) {
      expect(await entrar('dono', `errada ${i}`)).toEqual({
        tipo: 'recusado'
      });
    }

    const bloqueado = await entrar('dono', SENHA);

    expect(bloqueado).toMatchObject({ tipo: 'bloqueado' });
    expect(
      bloqueado.tipo === 'bloqueado' && bloqueado.ate.getTime() - Date.now()
    ).toBeGreaterThan(14 * 60 * 1000);
    expect(estado.jar.size).toBe(0);
    expect(aviso).toHaveBeenCalledWith(expect.stringContaining('bloqueado'));
  });

  it('avisa no log só na tentativa que fecha o login, não nas seguintes', async () => {
    const aviso = vi.spyOn(logger, 'error').mockImplementation(() => undefined);

    for (let i = 0; i < LIMITE_TENTATIVAS + 5; i++)
      await entrar('dono', 'errada');

    expect(aviso).toHaveBeenCalledOnce();
    expect(aviso).toHaveBeenCalledWith(expect.stringContaining('bloqueado'));
  });

  it('libera quando a janela de 15 minutos passa', async () => {
    vi.spyOn(logger, 'error').mockImplementation(() => undefined);

    for (let i = 0; i <= LIMITE_TENTATIVAS; i++) await entrar('dono', 'errada');

    expect(await entrar('dono', SENHA)).toMatchObject({ tipo: 'bloqueado' });

    await banco(
      "update admin_tentativas_login set inicio = now() - interval '16 minutes'"
    );

    expect(await entrar('dono', SENHA)).toEqual({ tipo: 'ok' });
  });

  it('login certo zera a contagem', async () => {
    for (let i = 0; i < LIMITE_TENTATIVAS - 1; i++)
      await entrar('dono', 'errada');

    await entrar('dono', SENHA);

    for (let i = 0; i < LIMITE_TENTATIVAS; i++) {
      expect(await entrar('dono', 'errada')).toEqual({ tipo: 'recusado' });
    }
  });

  it('pedidos em paralelo não passam do limite', async () => {
    const resultados = await Promise.all(
      Array.from({ length: 15 }, () => contarTentativa(banco))
    );

    expect(resultados.filter((ate) => ate !== null)).toHaveLength(5);
  });
});

describe('atalho de dev sem login', () => {
  const ligar = (nodeEnv: string, url: string) => {
    vi.stubEnv('ADMIN_DEV_SEM_LOGIN', '1');
    vi.stubEnv('NODE_ENV', nodeEnv);
    vi.stubEnv('DATABASE_URL', url);
  };

  it('entra sem cookie nem env do login no next dev com PGlite', async () => {
    ligar('development', '');
    vi.stubEnv('ADMIN_SENHA_HASH', '');

    expect(atalhoDev()).toBe(true);
    expect(await autorAtual()).toEqual({ usuario: 'dev' });
  });

  it.each([
    ['production', ''],
    ['test', ''],
    ['development', 'postgres://usuario@banco.exemplo/blog']
  ])('é ignorado com NODE_ENV=%s e DATABASE_URL=%j', async (nodeEnv, url) => {
    ligar(nodeEnv, url);

    expect(atalhoDev()).toBe(false);
    expect(await autorAtual()).toBeNull();
  });

  it('só liga com o valor 1', async () => {
    ligar('development', '');
    vi.stubEnv('ADMIN_DEV_SEM_LOGIN', 'true');

    expect(await autorAtual()).toBeNull();
  });
});
