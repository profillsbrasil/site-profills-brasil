import type { Rota } from '@/components/layout/navegacao';

/** Cor do fundo que fica atrás da placa no topo da página. */
export type TemaDoTopo = 'navy' | 'claro';

/**
 * Uma entrada por pasta de rota de app/(site), conferida no navegador. A chave
 * cobre a rota e as subpáginas: "/projetos" vale para "/projetos/profills-erp".
 * O teste ao lado reprova a pasta nova que nenhuma chave cobre.
 */
export const TEMA_POR_ROTA = {
  '/': 'navy',
  '/blog': 'navy',
  '/clientes': 'claro',
  '/download': 'navy',
  '/maquinas': 'navy',
  '/montar-fabrica': 'navy',
  '/montar-maquina': 'navy',
  '/projetos': 'claro',
  '/servicos-personalizados': 'navy',
  '/sobre': 'claro'
} as const satisfies Record<Rota, TemaDoTopo>;

function entrada(pathname: string) {
  const achada: readonly [string, TemaDoTopo] | undefined = Object.entries(
    TEMA_POR_ROTA
  )
    .filter(([rota]) =>
      rota === '/'
        ? pathname === '/'
        : pathname === rota || pathname.startsWith(`${rota}/`)
    )
    .sort(([a], [b]) => b.length - a.length)
    .at(0);

  return achada;
}

/** A chave mais longa que cobre o pathname; "/" cobre só a home. */
export function rotaClassificada(pathname: string) {
  return entrada(pathname)?.[0] ?? null;
}

/** O 404 de rota desconhecida redireciona para a home, que é navy. */
export function temaDoTopo(pathname: string) {
  return entrada(pathname)?.[1] ?? 'navy';
}
