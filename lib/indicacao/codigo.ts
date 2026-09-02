/* Formato do código de vendedor, compartilhado entre servidor (CRM) e cliente
   (analytics). Fica aqui, sem `server-only`, porque `lib/crm/referral.ts` é
   server-only e o bundle do browser não pode importar de lá. */

/** Mesmo formato que o CRM aceita; validar antes evita rede/eventos para lixo. */
export const FORMATO_CODIGO = /^[A-Z0-9-]{3,20}$/;

export function normalizarCodigo(
  valor: string | null | undefined
): string | null {
  const codigo = (valor ?? '').trim().toUpperCase();
  return FORMATO_CODIGO.test(codigo) ? codigo : null;
}
