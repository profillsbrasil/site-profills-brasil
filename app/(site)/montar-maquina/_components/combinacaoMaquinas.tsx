import {
  type CategoriaProduto,
  type MaquinaCatalogo,
  maquinasCatalogo
} from '@/lib/data/maquinas';

// Mapeamento dos tipos de embalagem da UI para o vocabulário de `embalagensCompativeis`
const packagingTypeMapping: Record<string, string> = {
  cartonada: 'Cartonada',
  pouch: 'Pouch',
  especiais: 'Especiais',
  sache: 'Sachê',
  garrafa: 'Garrafa',
  frasco: 'Frasco',
  fardo: 'Fardo',
  pote: 'Pote'
};

// Mapeamento dos tipos de produto da UI para `aplicacoes.categorias`
const productTypeMapping: Record<string, CategoriaProduto> = {
  liquidos: 'liquidos',
  viscoso: 'pastosos',
  pastoso: 'pastosos',
  po: 'pos',
  granular: 'graos',
  solido: 'solidos'
};

export interface MachineRecommendation {
  machine: MaquinaCatalogo;
}

/**
 * Recomenda a melhor máquina de prateleira (não-engenharia) do catálogo para
 * a combinação de embalagem + tipo de produto escolhida na UI.
 *
 * A embalagem é filtro obrigatório (a máquina precisa suportar fisicamente o
 * tipo escolhido); o tipo de produto pontua as candidatas via
 * `aplicacoes.categorias`, e a capacidade máxima desempata pontuações iguais.
 */
export function getBestMachineRecommendation(
  selectedPackaging: string,
  selectedProductType: string
): MachineRecommendation | null {
  const embalagemAlvo = packagingTypeMapping[selectedPackaging];
  const categoriaAlvo = productTypeMapping[selectedProductType];

  if (!embalagemAlvo || !categoriaAlvo) {
    return null;
  }

  const candidatas = maquinasCatalogo.filter(
    (maquina) =>
      maquina.tipoPagina !== 'engenharia' &&
      maquina.embalagensCompativeis.includes(embalagemAlvo)
  );

  if (candidatas.length === 0) {
    return null;
  }

  const melhor = candidatas.reduce((atual, candidata) => {
    const scoreAtual = pontuarProduto(atual, categoriaAlvo);
    const scoreCandidata = pontuarProduto(candidata, categoriaAlvo);

    if (scoreCandidata !== scoreAtual) {
      return scoreCandidata > scoreAtual ? candidata : atual;
    }

    const capacidadeAtual = atual.capacidadeMaxima ?? 0;
    const capacidadeCandidata = candidata.capacidadeMaxima ?? 0;
    return capacidadeCandidata > capacidadeAtual ? candidata : atual;
  });

  return { machine: melhor };
}

function pontuarProduto(
  maquina: MaquinaCatalogo,
  categoria: CategoriaProduto
): number {
  return maquina.aplicacoes.categorias.includes(categoria) ? 1 : 0;
}

// Dados do formulário de contato quando não há máquina compatível
export interface ContactFormData {
  nome: string;
  email: string;
  empresa: string;
  contato: string;
  detalhes: string;
}

export const initialContactFormData: ContactFormData = {
  nome: '',
  email: '',
  empresa: '',
  contato: '',
  detalhes: ''
};
