import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-saches-4-soldas-tc4s-2-vias.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-saches-4-soldas-tc4s-2-vias.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSaches4SoldasTc4s2Vias: MaquinaCatalogo = {
  slug: 'envasadora-saches-4-soldas-tc4s-2-vias',
  legacyId: 3,
  nome: 'Linha TC4S 2 Vias',
  nomeCompleto: 'Linha TC4S 2 Vias - Envasadora de Sachês 4 Soldas',
  headline:
    'Duas vias de envase para elevar a velocidade de produção de sachês quatro soldas.',
  seo: {
    titulo: 'Envasadora de Sachês 4 Soldas TC4S 2 Vias',
    descricao:
      'Envasadora TC4S de duas vias para líquidos e secos, com produção simultânea de até 4.000 sachês quatro soldas por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.31',
  tipoPagina: 'padrao',
  descritivo:
    'A TC4S 2 Vias realiza o envase simultâneo de dois sachês por ciclo. Desenvolvida para produtos líquidos e secos, combina produtividade, precisão e acabamento padronizado. A linha aceita diferentes estruturas de filme e pode receber recursos de abertura, Eurolock e formato especial, permitindo adequar a embalagem ao posicionamento do produto.',
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
      'Suplementos',
      'Bebidas em pó',
      'Café solúvel',
      'Açúcar',
      'Adoçantes',
      'Temperos',
      'Molhos',
      'Mel',
      'Géis energéticos',
      'Shampoo',
      'Condicionador',
      'Cremes cosméticos',
      'Sementes',
      'Pequenos grãos',
      'Amostras promocionais',
      'Fertilizantes'
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
      valor: '2,75 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '2,40 kWh'
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
      valor: '340 a 720 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '50 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '50 a 90 mm'
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
  capacidadeMaxima: 4000,
  embalagensCompativeis: ['Sachê'],
  destaqueHero: [
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
    }
  ]
};
