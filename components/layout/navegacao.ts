import type { StaticImageData } from 'next/image';

import { ICONE_CATEGORIA } from '@/components/layout/iconesCategorias';
import {
  type CategoriaCatalogo,
  categoriasCatalogo
} from '@/lib/data/maquinas/types';
import fotoDobra from '@/lib/images/extras/servicos/dobra.webp';
import fotoLaser from '@/lib/images/extras/servicos/laser.webp';
import fotoSolda from '@/lib/images/extras/servicos/solda.webp';
import fotoUsinagem from '@/lib/images/extras/servicos/usinagem.webp';

import {
  Brain,
  Calendar,
  Cloud,
  Factory,
  Globe,
  GraduationCap,
  Home,
  Landmark,
  Layers,
  Leaf,
  type LucideIcon,
  Newspaper,
  Package,
  Settings2,
  Store,
  User,
  Users
} from 'lucide-react';

/** Caminho interno do site. Link externo não entra na navbar. */
export type Rota = `/${string}`;

/** Chave da vitrine de Máquinas, a mesma de VitrinesDoMenu. */
export type ChaveVitrine = CategoriaCatalogo | 'todas';

/** Tudo que vira <a> pela LinkDaArvore. */
export interface Destino {
  readonly id: string;
  readonly rotulo: string;
  readonly href: Rota;
}

export interface FolhaVitrine extends Destino {
  readonly icone: LucideIcon;
  readonly vitrine: ChaveVitrine;
}

export interface FolhaCartao extends Destino {
  readonly icone: LucideIcon;
  readonly descricao: string;
}

export interface FolhaFoto extends Destino {
  readonly foto: StaticImageData;
  readonly altFoto: string;
}

export type Painel =
  | { readonly forma: 'vitrine'; readonly folhas: readonly FolhaVitrine[] }
  | { readonly forma: 'cartoes'; readonly folhas: readonly FolhaCartao[] }
  | { readonly forma: 'fotos'; readonly folhas: readonly FolhaFoto[] };

export type Folha = Painel['folhas'][number];

/** A ordem dos menus na árvore é a ordem dos gatilhos e o sentido da troca na gaveta. */
export type IdMenu = 'maquinas' | 'projetos' | 'servicos';

export interface NoMenu {
  readonly id: IdMenu;
  readonly rotulo: string;
  /** Rótulo na placa quando o inteiro não cabe. */
  readonly rotuloCurto?: string;
  readonly icone: LucideIcon;
  readonly painel: Painel;
}

export interface NoMarca extends Destino {
  readonly id: 'inicio';
  readonly href: '/';
  readonly icone: LucideIcon;
}

export interface NoLink extends Destino {
  readonly icone: LucideIcon;
}

export interface NoMonte extends Destino {
  readonly icone: LucideIcon;
  /** Texto do botão da placa; o rótulo inteiro vira aria-label. */
  readonly rotuloCurto: string;
}

/**
 * Cada campo é uma zona das duas superfícies. Os dois "Monte a sua" são uma
 * tupla porque o dono exige os dois sempre visíveis: perder um não compila.
 */
export interface Navegacao {
  readonly marca: NoMarca;
  readonly menus: readonly NoMenu[];
  readonly links: readonly NoLink[];
  readonly monte: readonly [NoMonte, NoMonte];
}

const hrefCategoria = (c: CategoriaCatalogo) =>
  `/maquinas?categoria=${encodeURIComponent(c)}` satisfies Rota;

export const NAVEGACAO = {
  marca: { id: 'inicio', rotulo: 'Início', href: '/', icone: Home },
  menus: [
    {
      id: 'maquinas',
      rotulo: 'Máquinas',
      icone: Package,
      painel: {
        forma: 'vitrine',
        folhas: [
          {
            id: 'maquinas-todas',
            rotulo: 'Todas as máquinas',
            href: '/maquinas',
            icone: Layers,
            vitrine: 'todas'
          },
          ...categoriasCatalogo.map((c) => ({
            id: `maquinas-${c}`,
            rotulo: c,
            href: hrefCategoria(c),
            icone: ICONE_CATEGORIA[c],
            vitrine: c
          }))
        ]
      }
    },
    {
      id: 'projetos',
      rotulo: 'Projetos',
      icone: Brain,
      painel: {
        forma: 'cartoes',
        folhas: [
          {
            id: 'projeto-pd',
            rotulo: 'Profills P&D',
            href: '/projetos/profills-pd',
            icone: Brain,
            descricao: 'IA e Indústria 4.0, com menos paradas e falhas.'
          },
          {
            id: 'projeto-erp',
            rotulo: 'Profills ERP',
            href: '/projetos/profills-erp',
            icone: Cloud,
            descricao: 'Gestão integrada em nuvem, automação e menos erros.'
          },
          {
            id: 'projeto-bank',
            rotulo: 'Profills Bank',
            href: '/projetos/profills-bank',
            icone: Landmark,
            descricao: 'Finanças digitais acessíveis e seguras.'
          },
          {
            id: 'projeto-hub',
            rotulo: 'Profills HUB',
            href: '/projetos/profills-hub',
            icone: Globe,
            descricao:
              'Presença internacional, embalagens seguras e soluções completas'
          },
          {
            id: 'projeto-locacao',
            rotulo: 'Profills Locação',
            href: '/projetos/profills-locacao',
            icone: Calendar,
            descricao: 'Máquinas por assinatura, acesso fácil e baixo risco.'
          },
          {
            id: 'projeto-marketplace',
            rotulo: 'Profills Marketplace',
            href: '/projetos/profills-marketplace',
            icone: Store,
            descricao:
              'Conexão digital segura entre produtores, clientes e parceiros.'
          },
          {
            id: 'projeto-school',
            rotulo: 'Profills School',
            href: '/projetos/profills-school',
            icone: GraduationCap,
            descricao:
              'Educação técnica acessível para capacitar e gerar impacto.'
          },
          {
            id: 'projeto-sustentabilidade',
            rotulo: 'Profills Sustentabilidade',
            href: '/projetos/profills-sustentabilidade',
            icone: Leaf,
            descricao: 'Soluções em alimento, educação e futuro com impacto.'
          }
        ]
      }
    },
    {
      id: 'servicos',
      rotulo: 'Outros Serviços',
      rotuloCurto: 'Serviços',
      icone: Layers,
      painel: {
        forma: 'fotos',
        folhas: [
          {
            id: 'servico-laser',
            rotulo: 'Corte a Laser',
            href: '/servicos-personalizados',
            foto: fotoLaser,
            altFoto: 'Corte a laser em chapa de inox'
          },
          {
            id: 'servico-dobra',
            rotulo: 'Dobra e Corte CNC',
            href: '/servicos-personalizados',
            foto: fotoDobra,
            altFoto: 'Dobra CNC de chapa'
          },
          {
            id: 'servico-usinagem',
            rotulo: 'Usinagem CNC',
            href: '/servicos-personalizados',
            foto: fotoUsinagem,
            altFoto: 'Usinagem CNC de peça'
          },
          {
            id: 'servico-solda',
            rotulo: 'Soldagem',
            href: '/servicos-personalizados',
            foto: fotoSolda,
            altFoto: 'Soldagem TIG'
          }
        ]
      }
    }
  ],
  links: [
    { id: 'clientes', rotulo: 'Clientes', href: '/clientes', icone: Users },
    { id: 'blog', rotulo: 'Blog', href: '/blog', icone: Newspaper },
    { id: 'sobre', rotulo: 'Sobre', href: '/sobre', icone: User }
  ],
  monte: [
    {
      id: 'monte-fabrica',
      rotulo: 'Monte a sua fábrica',
      rotuloCurto: 'fábrica',
      href: '/montar-fabrica',
      icone: Factory
    },
    {
      id: 'monte-maquina',
      rotulo: 'Monte a sua máquina',
      rotuloCurto: 'máquina',
      href: '/montar-maquina',
      icone: Settings2
    }
  ]
} as const satisfies Navegacao;

/** Todo destino clicável, por id: o gabarito do teste de paridade. O gatilho de menu não é destino. */
export function destinos(arvore: Navegacao = NAVEGACAO) {
  const todos: Destino[] = [
    arvore.marca,
    ...arvore.menus.flatMap<Destino>((m) => m.painel.folhas),
    ...arvore.links,
    ...arvore.monte
  ];

  return new Map(todos.map((d) => [d.id, d.href]));
}

function pathnameDe(href: Rota) {
  return href.split('?')[0] ?? href;
}

/**
 * O destino, ou alguma folha do menu, corresponde à página atual? Compara só
 * o pathname e acende também as subpáginas: "/maquinas/<slug>" acende Máquinas.
 */
// oxlint-disable-next-line landmines-types/no-explicit-return-types -- recursiva: sem a anotação o tsc dá TS7023 e TS7024
export function ehAtual(alvo: Destino | NoMenu, pathname: string): boolean {
  if ('painel' in alvo) {
    return alvo.painel.folhas.some((f) => ehAtual(f, pathname));
  }

  const base = pathnameDe(alvo.href);

  if (base === '/') return pathname === '/';

  return pathname === base || pathname.startsWith(`${base}/`);
}
