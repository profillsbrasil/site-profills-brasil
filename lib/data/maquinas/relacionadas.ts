import type { MaquinaCatalogo } from './types';

export type MaquinaRelacionada = MaquinaCatalogo & {
  imagens: NonNullable<MaquinaCatalogo['imagens']>;
};

function intersecao(a: string[], b: string[]) {
  return a.filter((x) => b.includes(x)).length;
}

/** Comparação pairwise de capacidade: sem informação (algum lado ausente) → 0 (neutro). */
function cmpCapacidade(
  referencia: number | undefined,
  a: number | undefined,
  b: number | undefined
) {
  if (referencia == null || a == null || b == null) return 0;
  const difA = Math.abs(a - referencia) / Math.max(a, referencia);
  const difB = Math.abs(b - referencia) / Math.max(b, referencia);
  return difA - difB;
}

/**
 * Algoritmo do spec §3.9: mesma categoria primeiro (ranking por embalagens em
 * comum, desempate por menor diferença relativa de capacidade — ausência de
 * capacidade em qualquer lado é neutra, preserva ordem do registry); completa
 * com máquinas de outras categorias que compartilham embalagem.
 * Sem `limite`, devolve o pool ranqueado inteiro (uso: carrossel).
 * `minimo` garante fileira cheia: pool menor que isso é completado com as
 * demais máquinas com foto, na ordem do registry, após as ranqueadas.
 */
export function getMaquinasRelacionadas(
  maquina: MaquinaCatalogo,
  todas: MaquinaCatalogo[],
  opcoes: { limite?: number; minimo?: number } = {}
): MaquinaRelacionada[] {
  const { limite, minimo } = opcoes;
  const candidatas = todas.filter(
    (m): m is MaquinaRelacionada =>
      m.slug !== maquina.slug && m.imagens !== undefined
  );

  const ordenar = <T extends MaquinaCatalogo>(lista: T[]): T[] =>
    lista
      .map((m, i) => ({
        m,
        i,
        emb: intersecao(m.embalagensCompativeis, maquina.embalagensCompativeis)
      }))
      .sort(
        (a, b) =>
          b.emb - a.emb ||
          cmpCapacidade(
            maquina.capacidadeMaxima,
            a.m.capacidadeMaxima,
            b.m.capacidadeMaxima
          ) ||
          a.i - b.i // estabilidade explícita: sem info, preserva ordem do registry
      )
      .map((x) => x.m);

  const mesmaCategoria = ordenar(
    candidatas.filter((m) => m.categoria === maquina.categoria)
  );
  const outras = ordenar(
    candidatas.filter(
      (m) =>
        m.categoria !== maquina.categoria &&
        intersecao(m.embalagensCompativeis, maquina.embalagensCompativeis) > 0
    )
  );

  const resultado = [...mesmaCategoria, ...outras];
  if (minimo != null && resultado.length < minimo) {
    const complemento = candidatas
      .filter((m) => !resultado.includes(m))
      .slice(0, minimo - resultado.length);
    resultado.push(...complemento);
  }
  return limite == null ? resultado : resultado.slice(0, limite);
}
