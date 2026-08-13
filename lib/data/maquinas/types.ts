import type { StaticImageData } from 'next/image';

export const categoriasCatalogo = [
  'Stand-up pouch',
  'Embalagens cartonadas e especiais',
  'Embalagens flexíveis',
  'Fim de linha e embalagens flexíveis',
  'Embalagens rígidas',
  'Embalagens rígidas e higienização',
  'Fim de linha',
  'Linhas completas e automação'
] as const;
export type CategoriaCatalogo = (typeof categoriasCatalogo)[number];

export const categoriasProduto = [
  'liquidos',
  'pastosos',
  'pos',
  'graos',
  'solidos'
] as const;
export type CategoriaProduto = (typeof categoriasProduto)[number];

export interface EspecificacaoItem {
  rotulo: string;
  valor: string;
}

export interface MaquinaCatalogo {
  slug: string;
  /** id numérico da URL antiga (1–33); ausente nas 3 máquinas novas do catálogo 2026 */
  legacyId?: number;
  nome: string;
  nomeCompleto: string;
  headline: string;
  seo: { titulo: string; descricao: string };
  categoria: CategoriaCatalogo;
  paginaCatalogo: string;
  tipoPagina: 'padrao' | 'engenharia';
  descritivo: string;
  recursos: string[];
  aplicacoes: {
    categoriaPrincipal: string;
    categorias: CategoriaProduto[];
    produtos: string[];
  };
  imagens: {
    maquina: StaticImageData;
    embalagem: StaticImageData;
    maquinaClassName?: string;
    embalagemClassName?: string;
  };
  embalagem3d?: { glb: string; cameraOrbit?: string };
  video?: { src: string; poster?: string };
  specsMaquina: EspecificacaoItem[];
  specsEmbalagem: EspecificacaoItem[];
  capacidadeMaxima?: number;
  embalagensCompativeis: string[];
  destaqueHero?: [EspecificacaoItem, EspecificacaoItem, EspecificacaoItem];
  conteudoEngenharia?: { escopo: string; blocos: EspecificacaoItem[] };
}
