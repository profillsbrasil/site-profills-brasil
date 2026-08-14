import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-saches-formatados-tc4s-3-vias.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-saches-formatados-tc4s-3-vias.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSachesFormatadosTc4s3Vias: MaquinaCatalogo = {
  slug: 'envasadora-saches-formatados-tc4s-3-vias',
  legacyId: 6,
  nome: 'Linha TC4S 3 Vias Formatado',
  nomeCompleto: 'Linha TC4S 3 Vias Formatado - Sachês 4 Soldas',
  headline:
    'Alta produtividade em sachês formatados, com três vias de envase e geometrias desenvolvidas para destacar o produto.',
  seo: {
    titulo: 'Envasadora de Sachês Formatados TC4S 3 Vias | Profills',
    descricao:
      'Linha TC4S de três vias para sachês formatados com quatro soldas, líquidos e secos, produzindo até 6.000 unidades por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.35',
  tipoPagina: 'padrao',
  descritivo:
    'A TC4S 3 Vias Formatado combina produção simultânea em três vias com ferramental para sachês de formatos especiais. A solução é indicada para marcas que desejam unir escala industrial, precisão de dosagem e diferenciação visual. O projeto do formato deve ser validado conforme dimensões, material, área de solda e comportamento do produto.',
  recursos: [
    'Abre-fácil simples',
    'Abre-fácil triangular',
    'Abre-fácil serrilhado',
    'Formato especial customizado',
    'Datação em alto-relevo, inkjet ou hot stamping'
  ],
  aplicacoes: {
    categoriaPrincipal:
      'Líquidos, pastosos e produtos secos em sachês formatados',
    categorias: ['liquidos', 'pastosos', 'solidos'],
    produtos: [
      'Amostras de cosméticos',
      'Cremes',
      'Géis',
      'Shampoo',
      'Condicionador',
      'Protetor solar',
      'Molhos',
      'Mel',
      'Suplementos em pó',
      'Vitaminas',
      'Bebidas em pó',
      'Produtos promocionais',
      'Produtos infantis',
      'Produtos pet',
      'Doses individuais customizadas'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/sache-especial.glb',
    cameraOrbit: '41deg 74deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 6.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Alto-relevo, inkjet ou hot stamping'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '4,86 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '3,40 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '572 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '1.900 x 2.000 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '400 a 500 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '50 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '70 a 80 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '80 a 170 mm'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos e produtos secos'
    }
  ],
  capacidadeMaxima: 6000,
  embalagensCompativeis: ['Sachê', 'Especiais'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 6.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Alto-relevo, inkjet ou hot stamping'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '4,86 kW'
    }
  ]
};
