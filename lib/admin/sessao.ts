import { cookies } from 'next/headers';

import { consultar } from '@/lib/banco/conexao';
import type { Consulta } from '@/lib/banco/tipos';
import { logger } from '@/lib/utils/logger';

import { conferirSenha, hashValido } from './senha.mjs';
import { SignJWT, jwtVerify } from 'jose';
import { createHash, timingSafeEqual } from 'node:crypto';
import 'server-only';
import { z } from 'zod';

export const COOKIE_SESSAO = 'admin_sessao';
export const LIMITE_TENTATIVAS = 10;
export const JANELA_MINUTOS = 15;

const DURACAO_SEGUNDOS = 7 * 24 * 60 * 60;
const TAMANHO_MINIMO_SEGREDO = 32;

export type Autor = { usuario: string };

export type ResultadoEntrada =
  | { tipo: 'ok' }
  | { tipo: 'recusado' }
  | { tipo: 'bloqueado'; ate: Date }
  | { tipo: 'indisponivel' };

type ConfigAdmin = { usuario: string; hash: string; chave: Uint8Array };

/** null quando falta ou sobra algo na env: o login fica fechado, nunca aberto. */
function configAdmin(): ConfigAdmin | null {
  const usuario = process.env.ADMIN_USUARIO;
  const hash = process.env.ADMIN_SENHA_HASH;
  const segredo = process.env.ADMIN_SESSAO_SEGREDO;

  if (
    !usuario ||
    !hash ||
    !segredo ||
    segredo.length < TAMANHO_MINIMO_SEGREDO ||
    !hashValido(hash)
  )
    return null;

  // A chave do JWT mistura o hash: trocar a senha derruba todas as sessões abertas.
  const chave = createHash('sha256')
    .update(segredo)
    .update('\0')
    .update(hash)
    .digest();

  return { usuario, hash, chave: new Uint8Array(chave) };
}

/**
 * Entrar sem senha só num PGlite local: ADMIN_DEV_SEM_LOGIN=1, next dev e nenhuma DATABASE_URL.
 * Com DATABASE_URL o admin grava num Postgres de verdade, então pede senha mesmo no dev.
 */
export function atalhoDev() {
  return (
    process.env.ADMIN_DEV_SEM_LOGIN === '1' &&
    process.env.NODE_ENV === 'development' &&
    !process.env.DATABASE_URL
  );
}

export async function autorAtual(): Promise<Autor | null> {
  // O cookie vem antes de tudo: sem ele, uma página do admin sem env no build vira HTML estático com o redirect congelado.
  const token = (await cookies()).get(COOKIE_SESSAO)?.value;

  if (atalhoDev()) return { usuario: 'dev' };

  const config = configAdmin();

  if (!config || !token) return null;

  try {
    const { payload } = await jwtVerify(token, config.chave, {
      algorithms: ['HS256']
    });

    return payload.sub === config.usuario ? { usuario: config.usuario } : null;
  } catch {
    return null;
  }
}

const contagemLida = z.object({ tentativas: z.number(), ate: z.date() });

/** acabouDeFechar só na tentativa que passa do limite: o log sai uma vez por janela, não a cada pedido bloqueado. */
export type Bloqueio = { ate: Date; acabouDeFechar: boolean };

/**
 * Soma a tentativa numa instrução só, antes do scrypt: pedidos em paralelo não passam do limite.
 * A janela é fixa e começa na primeira tentativa depois da anterior expirar.
 * Devolve até quando o login fica fechado, ou null quando ainda pode tentar.
 */
export async function contarTentativa(
  consulta: Consulta
): Promise<Bloqueio | null> {
  const { rows } = await consulta(
    `insert into admin_tentativas_login as t (chave, inicio, tentativas)
     values ('global', now(), 1)
     on conflict (chave) do update set
       inicio = case when t.inicio <= now() - make_interval(mins => $1) then now() else t.inicio end,
       tentativas = case when t.inicio <= now() - make_interval(mins => $1) then 1 else t.tentativas + 1 end
     returning tentativas, inicio + make_interval(mins => $1) as ate`,
    [JANELA_MINUTOS]
  );

  const { tentativas, ate } = contagemLida.parse(rows[0]);

  return tentativas > LIMITE_TENTATIVAS
    ? { ate, acabouDeFechar: tentativas === LIMITE_TENTATIVAS + 1 }
    : null;
}

/** Depois de um login certo, as tentativas anteriores deixam de contar. */
export async function zerarTentativas(consulta: Consulta) {
  await consulta(
    "update admin_tentativas_login set tentativas = 0, inicio = now() where chave = 'global'"
  );
}

function mesmoTexto(a: string, b: string) {
  const resumo = (texto: string) => createHash('sha256').update(texto).digest();

  return timingSafeEqual(resumo(a), resumo(b));
}

export async function entrar(
  usuario: string,
  senha: string
): Promise<ResultadoEntrada> {
  const config = configAdmin();

  if (!config) {
    logger.error(
      'Login do admin sem ADMIN_USUARIO, ADMIN_SENHA_HASH ou ADMIN_SESSAO_SEGREDO válidos.'
    );

    return { tipo: 'indisponivel' };
  }

  let bloqueio: Bloqueio | null;

  try {
    bloqueio = await contarTentativa(consultar);
  } catch (erro) {
    logger.error('O banco não respondeu ao contar a tentativa de login.', erro);

    return { tipo: 'indisponivel' };
  }

  if (bloqueio) {
    // error e não warn: o logger de produção só escreve error sem LOG_LEVEL.
    if (bloqueio.acabouDeFechar)
      logger.error(
        `Login do admin bloqueado até ${bloqueio.ate.toISOString()}: mais de ${LIMITE_TENTATIVAS} tentativas em ${JANELA_MINUTOS} minutos.`
      );

    return { tipo: 'bloqueado', ate: bloqueio.ate };
  }

  // O scrypt roda mesmo com o usuário errado: o tempo da resposta não conta qual dos dois errou.
  const senhaConfere = await conferirSenha(senha, config.hash);

  if (!senhaConfere || !mesmoTexto(usuario, config.usuario))
    return { tipo: 'recusado' };

  try {
    await zerarTentativas(consultar);
  } catch (erro) {
    logger.error('O banco não zerou as tentativas de login.', erro);
  }

  const token = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(config.usuario)
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_SEGUNDOS}s`)
    .sign(config.chave);

  (await cookies()).set(COOKIE_SESSAO, token, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/admin',
    secure: process.env.NODE_ENV !== 'development',
    maxAge: DURACAO_SEGUNDOS
  });

  return { tipo: 'ok' };
}

export async function sair() {
  (await cookies()).delete({ name: COOKIE_SESSAO, path: '/admin' });
}
