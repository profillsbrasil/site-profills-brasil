/** Distância fixa entre um sketch e o próximo: a do protótipo aprovado, medida numa página cheia. */
export const PASSO_PX = { listagem: 400, leitura: 770 } as const;

/** Onde o primeiro sketch começa, a partir do topo da página. */
export const INICIO_PX = { listagem: 48, leitura: 120 } as const;

/**
 * Quantos sketches cabem na altura da página sem se empilhar. Página curta (listagem vazia, aviso
 * de um parágrafo) mostra poucos; página longa ganha mais, no mesmo espaçamento.
 */
export function quantosDesenhos(alturaPx: number, passoPx: number) {
  return Math.max(1, Math.ceil(alturaPx / passoPx));
}
