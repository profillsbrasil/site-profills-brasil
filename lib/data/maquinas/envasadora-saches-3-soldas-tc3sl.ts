import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-saches-3-soldas-tc3sl.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-saches-3-soldas-tc3sl.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSaches3SoldasTc3sl: MaquinaCatalogo = {
  slug: 'envasadora-saches-3-soldas-tc3sl',
  legacyId: 10,
  nome: 'Linha TC3SL',
  nomeCompleto:
    'Linha TC3SL - Envasadora de Sachês 3 Soldas para Líquidos e Secos',
  headline:
    'Uma linha de alta produtividade para líquidos e secos em sachês três soldas de formato estreito.',
  seo: {
    titulo: 'Envasadora de Sachês TC3SL',
    descricao:
      'Linha TC3SL para líquidos e secos em sachês três soldas, com sistemas avançados de dosagem e produção de até 4.000 unidades por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.39',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha TC3SL atende produtos líquidos e secos em sachês três soldas. A configuração combina diferentes possibilidades de dosagem com uma faixa de embalagem estreita e comprimentos variados. O equipamento oferece recursos de abertura e formato customizado para atender necessidades de consumo individual e apresentação de marca.',
  recursos: [
    'Abre-fácil simples',
    'Abre-fácil triangular',
    'Abre-fácil serrilhado',
    'Formato especial customizado',
    'Datação em alto-relevo, inkjet ou hot stamping'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, pastosos, pós e granulados',
    categorias: ['liquidos', 'pastosos', 'pos', 'graos'],
    produtos: [
      'Bebidas em pó',
      'Whey protein',
      'Creatina',
      'Colágeno',
      'Açúcar',
      'Adoçantes',
      'Café solúvel',
      'Temperos',
      'Molhos',
      'Mel',
      'Xaropes',
      'Géis',
      'Shampoo',
      'Condicionador',
      'Cremes cosméticos',
      'Amostras promocionais',
      'Fertilizantes',
      'Produtos veterinários'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/3-soldas-duplo.glb',
    cameraOrbit: '38deg 72deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 4.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Alto-relevo, inkjet ou hot stamping'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '2,35 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '2,00 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '245 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '2.300 x 2.600 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '140 a 220 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '50 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '35 a 55 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '70 a 230 mm'
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
  capacidadeMaxima: 4000,
  embalagensCompativeis: ['Sachê'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 4.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Alto-relevo, inkjet ou hot stamping'
    }
  ]
};
