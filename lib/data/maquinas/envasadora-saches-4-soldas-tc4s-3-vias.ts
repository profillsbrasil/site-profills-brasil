import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-saches-4-soldas-tc4s-3-vias.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-saches-4-soldas-tc4s-3-vias.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSaches4SoldasTc4s3Vias: MaquinaCatalogo = {
  slug: 'envasadora-saches-4-soldas-tc4s-3-vias',
  legacyId: 4,
  nome: 'Linha TC4S 3 Vias',
  nomeCompleto: 'Linha TC4S 3 Vias - Envasadora de Sachês 4 Soldas',
  headline:
    'Três vias para demandas industriais de maior escala, mantendo precisão e acabamento em sachês quatro soldas.',
  seo: {
    titulo: 'Envasadora de Sachês 4 Soldas TC4S 3 Vias',
    descricao:
      'Envasadora TC4S de três vias para líquidos e secos, com produção de até 6.000 sachês quatro soldas por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.34',
  tipoPagina: 'padrao',
  descritivo:
    'A TC4S 3 Vias é a configuração de maior produtividade da família TC4S apresentada no catálogo. Realiza três envases simultâneos e atende produtos líquidos ou secos em diferentes estruturas flexíveis. Os recursos de abertura e formato permitem desenvolver embalagens funcionais e visualmente diferenciadas.',
  recursos: [
    'Abre-fácil simples',
    'Abre-fácil triangular',
    'Abre-fácil serrilhado',
    'Eurolock',
    'Formato especial customizado',
    'Datação em alto-relevo, inkjet ou hot stamping'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, pastosos, pós, grãos e granulados',
    categorias: ['liquidos', 'pastosos', 'pos', 'graos'],
    produtos: [
      'Whey protein',
      'Colágeno',
      'Creatina',
      'Vitaminas em pó',
      'Bebidas em pó',
      'Café solúvel',
      'Açúcar',
      'Adoçantes',
      'Temperos',
      'Molhos',
      'Mel',
      'Cosméticos',
      'Amostras',
      'Sementes',
      'Pequenos grãos',
      'Fertilizantes',
      'Produtos veterinários em dose individual'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/sache-4-soldas.glb',
    cameraOrbit: '32deg 86deg 100%'
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
      valor: 'Temporizado, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '3,19 a 3,43 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '2,75 a 3,05 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '360 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '2.250 x 2.400 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '204 a 400 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '50 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '34 a 67 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '70 a 180 mm'
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
  embalagensCompativeis: ['Sachê'],
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
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    }
  ]
};
