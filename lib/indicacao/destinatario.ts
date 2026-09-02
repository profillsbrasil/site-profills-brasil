import type { NextRequest } from 'next/server';

import { buscarVendedorPorCodigo } from '@/lib/crm/referral';

import { INDICACAO_COOKIE, lerIndicacao } from './cookie-server';
import type { VendedorIndicacao } from './tipos';
import 'server-only';

export type Destinatario = {
  /** E-mail que recebe o Lead. */
  para: string;
  /** Vendedor da Indicação, ou null quando o Lead vai para a Caixa padrão. */
  vendedor: VendedorIndicacao | null;
};

/**
 * Decide para quem vai o Lead: o vendedor do cookie, revalidado no CRM, ou a
 * Caixa padrão (GMAIL_USER_RECEIVER) em qualquer outro caso.
 */
export async function resolverDestinatario(
  request: NextRequest
): Promise<Destinatario> {
  const padrao: Destinatario = {
    para: process.env.GMAIL_USER_RECEIVER!,
    vendedor: null
  };

  const payload = await lerIndicacao(
    request.cookies.get(INDICACAO_COOKIE)?.value
  );
  if (!payload) return padrao;

  const busca = await buscarVendedorPorCodigo(payload.codigo);
  if (busca.tipo !== 'encontrado') return padrao;

  return { para: busca.vendedor.email, vendedor: busca.vendedor };
}
