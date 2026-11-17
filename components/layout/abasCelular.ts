import {
  type ChaveVitrine,
  type Destino,
  NAVEGACAO,
  type Navegacao,
  type NoLink,
  type NoMenu,
  type NoMonte,
  ehAtual
} from '@/components/layout/navegacao';

import { type LucideIcon, Menu, Plus } from 'lucide-react';

export type IdFolha = 'maquinas' | 'montar' | 'menu';

export type NoMenuVitrine = NoMenu & {
  readonly painel: Extract<NoMenu['painel'], { forma: 'vitrine' }>;
};

export type ConteudoFolha =
  | { readonly forma: 'montar'; readonly monte: readonly [NoMonte, NoMonte] }
  | { readonly forma: 'maquinas'; readonly menu: NoMenuVitrine }
  | {
      readonly forma: 'menu';
      readonly menus: readonly NoMenu[];
      readonly pe: readonly NoLink[];
    };

interface BaseAba {
  readonly rotulo: string;
  readonly icone: LucideIcon;
}

export interface AbaLink<
  I extends 'inicio' | 'blog' = 'inicio' | 'blog'
> extends BaseAba {
  readonly tipo: 'link';
  readonly id: I;
  readonly destino: NoLink;
}

export interface AbaFolha<F extends IdFolha = IdFolha> extends BaseAba {
  readonly tipo: 'folha';
  readonly id: F;
  readonly titulo: string;
  readonly altura: 'curta' | 'alta';
  readonly conteudo: Extract<ConteudoFolha, { forma: F }>;
}

/** A barra da esquerda para a direita, com Montar no centro. */
export type AbasDoCelular = readonly [
  AbaLink<'inicio'>,
  AbaFolha<'maquinas'>,
  AbaFolha<'montar'>,
  AbaLink<'blog'>,
  AbaFolha<'menu'>
];

export type Aba = AbasDoCelular[number];

export type IdAba = Aba['id'];

const ehMenuVitrine = (m: NoMenu): m is NoMenuVitrine =>
  m.painel.forma === 'vitrine';

/**
 * Menu é o complemento: menu sem vitrine e link que não virou aba caem nele,
 * então destino novo na árvore aparece no celular sem editar este arquivo.
 */
export function abasDoCelular(arvore: Navegacao = NAVEGACAO): AbasDoCelular {
  const vitrines = arvore.menus.filter(ehMenuVitrine);
  const [maquinas] = vitrines;

  if (!maquinas || vitrines.length > 1) {
    throw new Error(
      `A árvore precisa de exatamente um menu de vitrine; tem ${vitrines.length}.`
    );
  }

  const blog = arvore.links.find((l) => l.id === 'blog');

  if (!blog) throw new Error("A árvore não tem o link 'blog'.");

  return [
    {
      tipo: 'link',
      id: 'inicio',
      rotulo: arvore.marca.rotulo,
      icone: arvore.marca.icone,
      destino: arvore.marca
    },
    {
      tipo: 'folha',
      id: 'maquinas',
      rotulo: maquinas.rotulo,
      icone: maquinas.icone,
      titulo: maquinas.rotulo,
      altura: 'alta',
      conteudo: { forma: 'maquinas', menu: maquinas }
    },
    {
      tipo: 'folha',
      id: 'montar',
      rotulo: 'Montar',
      icone: Plus,
      titulo: 'Monte a sua',
      altura: 'curta',
      conteudo: { forma: 'montar', monte: arvore.monte }
    },
    {
      tipo: 'link',
      id: 'blog',
      rotulo: blog.rotulo,
      icone: blog.icone,
      destino: blog
    },
    {
      tipo: 'folha',
      id: 'menu',
      rotulo: 'Menu',
      icone: Menu,
      titulo: 'Menu',
      altura: 'alta',
      conteudo: {
        forma: 'menu',
        menus: arvore.menus.filter((m) => m !== maquinas),
        pe: arvore.links.filter((l) => l !== blog)
      }
    }
  ];
}

/** Calculada no import: árvore inválida derruba o teste e o build, não o celular. */
export const ABAS_DO_CELULAR = abasDoCelular();

export function destinosDaAba(aba: Aba): readonly Destino[] {
  if (aba.tipo === 'link') return [aba.destino];

  const { conteudo } = aba;

  switch (conteudo.forma) {
    case 'montar':
      return conteudo.monte;
    case 'maquinas':
      return conteudo.menu.painel.folhas;
    case 'menu':
      return [
        ...conteudo.menus.flatMap((m): readonly Destino[] => m.painel.folhas),
        ...conteudo.pe
      ];
  }
}

/** Rota fora da árvore (/download) não marca aba nenhuma. */
export function abaAtual(abas: AbasDoCelular, pathname: string): IdAba | null {
  return (
    abas.find((aba) => destinosDaAba(aba).some((d) => ehAtual(d, pathname)))
      ?.id ?? null
  );
}

export function rotuloVer(chave: ChaveVitrine, total: number): string {
  if (chave === 'todas') return `Ver as ${total} máquinas`;

  return total === 1 ? 'Ver 1 máquina' : `Ver ${total} máquinas`;
}
