import type { IndicacaoPayload, VendedorIndicacao } from './tipos';
import { SignJWT, jwtVerify } from 'jose';

export const INDICACAO_COOKIE = 'profills_indicacao';
/** 30 dias, em segundos (Max-Age). */
export const INDICACAO_MAX_AGE = 30 * 24 * 60 * 60;
/** Renova os dados do vendedor pelo CRM depois de 24 h. */
export const RENOVACAO_MS = 24 * 60 * 60 * 1000;

function segredo() {
  const valor = process.env.INDICACAO_COOKIE_SECRET;
  if (!valor) throw new Error('INDICACAO_COOKIE_SECRET não está definido');
  return new TextEncoder().encode(valor);
}

/**
 * Há segredo configurado? Sem ele o proxy não grava nem apaga cookie: uma
 * assinatura ilegível por falta de chave não é um cookie adulterado.
 */
export function temSegredoIndicacao(): boolean {
  return Boolean(process.env.INDICACAO_COOKIE_SECRET);
}

export function opcoesCookieIndicacao() {
  return {
    path: '/' as const,
    maxAge: INDICACAO_MAX_AGE,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV !== 'development',
    /* O browser lê o payload para trocar os contatos; nada nele é segredo. */
    httpOnly: false as const
  };
}

export async function assinarIndicacao(
  vendedor: VendedorIndicacao,
  agora: Date = new Date()
): Promise<string> {
  const payload: IndicacaoPayload = {
    codigo: vendedor.referral_code,
    nome: vendedor.nome,
    email: vendedor.email,
    contato: vendedor.contato,
    consultadoEm: agora.toISOString()
  };
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(Math.floor(agora.getTime() / 1000))
    .setExpirationTime(Math.floor(agora.getTime() / 1000) + INDICACAO_MAX_AGE)
    .sign(segredo());
}

function ehPayload(valor: unknown): valor is IndicacaoPayload {
  if (!valor || typeof valor !== 'object') return false;
  const o = valor as Record<string, unknown>;
  return (
    typeof o.codigo === 'string' &&
    typeof o.nome === 'string' &&
    typeof o.email === 'string' &&
    (typeof o.contato === 'string' || o.contato === null) &&
    typeof o.consultadoEm === 'string'
  );
}

/** Verifica assinatura e validade; qualquer problema vira null. */
export async function lerIndicacao(
  token: string | undefined
): Promise<IndicacaoPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, segredo(), {
      algorithms: ['HS256']
    });
    if (!ehPayload(payload)) return null;
    const { codigo, nome, email, contato, consultadoEm } = payload;
    return { codigo, nome, email, contato, consultadoEm };
  } catch {
    return null;
  }
}

export function precisaRenovar(
  payload: IndicacaoPayload,
  agora: Date = new Date()
): boolean {
  const consultado = Date.parse(payload.consultadoEm);
  if (Number.isNaN(consultado)) return true;
  return agora.getTime() - consultado > RENOVACAO_MS;
}
