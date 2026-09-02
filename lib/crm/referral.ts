import type { VendedorIndicacao } from '@/lib/indicacao/tipos';
import { logger } from '@/lib/utils/logger';

import 'server-only';
import { z } from 'zod';

export type ResultadoBusca =
  | { tipo: 'encontrado'; vendedor: VendedorIndicacao }
  | { tipo: 'nao-encontrado' }
  | { tipo: 'indisponivel' };

/** Mesmo formato que o CRM aceita; validar aqui evita rede para lixo de querystring. */
const FORMATO_CODIGO = /^[A-Z0-9-]{3,20}$/;
const CACHE_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 4000;
/** Teto de entradas do cache; o processo é longo e o código vem de fora. */
const CACHE_MAX = 500;

/* Chaves fora do contrato são descartadas (`strip` é o padrão do zod): o que
   não está aqui nunca chega ao cookie nem ao e-mail. */
const RespostaCrm = z.object({
  nome: z.string().min(1),
  email: z.email(),
  referral_code: z.string().min(1),
  contato: z.string().nullable()
});

type Cacheado =
  | { tipo: 'encontrado'; vendedor: VendedorIndicacao }
  | { tipo: 'nao-encontrado' };

/* Cache em memória por bundle: o proxy e os route handlers são instâncias
   separadas, então cada um mantém o seu Map (e o `next: { revalidate }` do
   fetch abaixo só vale nos route handlers). O CRM roda num pool pequeno de
   conexões e não tem rate limit; este Map é o que segura a repetição. */
const cache = new Map<string, { ate: number; resultado: Cacheado }>();

/** Insere respeitando o teto: o Map mantém ordem, então sai a mais antiga. */
function guardar(
  codigo: string,
  entrada: { ate: number; resultado: Cacheado }
) {
  cache.delete(codigo);
  if (cache.size >= CACHE_MAX) {
    const maisAntiga = cache.keys().next().value;
    if (maisAntiga !== undefined) cache.delete(maisAntiga);
  }
  cache.set(codigo, entrada);
}

export function limparCacheReferral() {
  cache.clear();
}

/** Só para teste: quantas entradas o cache guarda agora. */
export function tamanhoCacheReferral(): number {
  return cache.size;
}

export function normalizarCodigo(
  valor: string | null | undefined
): string | null {
  const codigo = (valor ?? '').trim().toUpperCase();
  return FORMATO_CODIGO.test(codigo) ? codigo : null;
}

/**
 * Consulta o vendedor dono do código. Nunca lança: qualquer falha do CRM
 * vira `indisponivel`, e a página/handler segue sem Indicação.
 */
export async function buscarVendedorPorCodigo(
  valor: string | null | undefined
): Promise<ResultadoBusca> {
  const codigo = normalizarCodigo(valor);
  if (!codigo) return { tipo: 'nao-encontrado' };

  const agora = Date.now();
  const guardado = cache.get(codigo);
  if (guardado && guardado.ate > agora) return guardado.resultado;

  const base = process.env.CRM_BASE_URL;
  const chave = process.env.CRM_EXTERNAL_API_KEY;
  if (!base || !chave) {
    logger.warn('[crm-referral] CRM_BASE_URL ou CRM_EXTERNAL_API_KEY ausente');
    return { tipo: 'indisponivel' };
  }

  try {
    const resp = await fetch(
      `${base.replace(/\/$/, '')}/api/external/referral/${encodeURIComponent(codigo)}`,
      {
        headers: { 'X-API-Key': chave },
        cache: 'force-cache',
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(TIMEOUT_MS)
      }
    );

    if (resp.status === 404) {
      const resultado: Cacheado = { tipo: 'nao-encontrado' };
      guardar(codigo, { ate: agora + CACHE_MS, resultado });
      return resultado;
    }
    if (!resp.ok) {
      logger.error(
        `[crm-referral] CRM respondeu ${resp.status} para ${codigo}`
      );
      return { tipo: 'indisponivel' };
    }

    const validado = RespostaCrm.safeParse(await resp.json());
    if (!validado.success) {
      logger.error(`[crm-referral] resposta inválida do CRM para ${codigo}`);
      return { tipo: 'indisponivel' };
    }

    const vendedor: VendedorIndicacao = validado.data;
    const resultado: Cacheado = { tipo: 'encontrado', vendedor };
    guardar(codigo, { ate: agora + CACHE_MS, resultado });
    return resultado;
  } catch (erro) {
    logger.error('[crm-referral] falha ao consultar o CRM', erro);
    return { tipo: 'indisponivel' };
  }
}

export function formatarTelefoneBR(digitos: string | null): string {
  if (!digitos) return '';
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return digitos;
}

export function linkWhatsApp(digitos: string | null): string | null {
  return digitos ? `https://wa.me/55${digitos}` : null;
}
