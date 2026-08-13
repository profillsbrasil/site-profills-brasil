import type { MaquinaCatalogo } from './types';

function intersecao(a: string[], b: string[]) {
  return a.filter((x) => b.includes(x)).length;
}

function difRelativaCapacidade(a?: number, b?: number) {
  if (!a || !b) return 0; // critério ignorado quando um lado não tem valor
  return Math.abs(a - b) / Math.max(a, b);
}

/**
 * Algoritmo do spec §3.9: mesma categoria primeiro (ranking por embalagens em
 * comum, desempate por menor diferença relativa de capacidade); completa com
 * máquinas de outras categorias que compartilham embalagem.
 */
export function getMaquinasRelacionadas(
  maquina: MaquinaCatalogo,
  todas: MaquinaCatalogo[],
  limite = 3
): MaquinaCatalogo[] {
  const candidatas = todas.filter((m) => m.slug !== maquina.slug);

  const pontuar = (m: MaquinaCatalogo) => ({
    maquina: m,
    embalagens: intersecao(
      m.embalagensCompativeis,
      maquina.embalagensCompativeis
    ),
    capacidade: difRelativaCapacidade(
      m.capacidadeMaxima,
      maquina.capacidadeMaxima
    )
  });

  const ordenar = (lista: ReturnType<typeof pontuar>[]) =>
    lista
      .sort(
        (a, b) => b.embalagens - a.embalagens || a.capacidade - b.capacidade
      )
      .map((x) => x.maquina);

  const mesmaCategoria = ordenar(
    candidatas.filter((m) => m.categoria === maquina.categoria).map(pontuar)
  );
  const outras = ordenar(
    candidatas
      .filter((m) => m.categoria !== maquina.categoria)
      .map(pontuar)
      .filter((x) => x.embalagens > 0)
  );

  return [...mesmaCategoria, ...outras].slice(0, limite);
}
