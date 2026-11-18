/** Mesmo formato que o CRM aceita; validar antes evita rede/eventos para lixo. */
export const FORMATO_CODIGO = /^[A-Z0-9-]{3,20}$/;

/**
 * Código em maiúsculas, ou null fora do formato do CRM. Este arquivo não é
 * server-only: o cliente importa daqui, e não de `lib/crm/referral.ts`.
 */
export function normalizarCodigo(
  valor: string | null | undefined
): string | null {
  const codigo = (valor ?? '').trim().toUpperCase();

  return FORMATO_CODIGO.test(codigo) ? codigo : null;
}
