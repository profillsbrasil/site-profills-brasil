const NBSP = '\u00a0';

/**
 * Mantém compostos técnicos juntos na quebra de linha: "PET + PE + alumínio"
 * não pode quebrar em "PET + PE + / alumínio". Troca o espaço ao redor de " + "
 * por NBSP, tornando cada composto atômico — a quebra cai nos separadores
 * de lista ("; "), onde ela é natural.
 */
export function compostosJuntos(valor: string): string {
  return valor.replaceAll(' + ', `${NBSP}+${NBSP}`);
}
