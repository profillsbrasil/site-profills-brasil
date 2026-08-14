import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-saches-pos-solidos-tcv.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-saches-pos-solidos-tcv.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSachesPosSolidosTcv: MaquinaCatalogo = {
  slug: 'envasadora-saches-pos-solidos-tcv',
  legacyId: 11,
  nome: 'Linha TCV',
  nomeCompleto: 'Linha TCV - Envasadora de Sachês 3 Soldas para Pós e Sólidos',
  headline:
    'Produtividade no envase de pós, grãos e sólidos em sachês três soldas.',
  seo: {
    titulo: 'Envasadora de Sachês para Pós e Sólidos TCV | Profills',
    descricao:
      'Linha TCV para pós, grãos e sólidos em sachês três soldas, com produção de até 4.000 unidades por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.40',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha TCV foi desenvolvida para o envase de pós, grãos e sólidos em sachês três soldas. Trabalha com diferentes estruturas de filme e pode utilizar dosagem temporizada, por bomba positiva ou volumétrica conforme a configuração do projeto. Recursos de abre-fácil e formato especial permitem adaptar a embalagem ao uso e à identidade do produto.',
  recursos: [
    'Abre-fácil simples',
    'Abre-fácil triangular',
    'Abre-fácil serrilhado',
    'Formato especial customizado',
    'Datação em alto-relevo, inkjet ou hot stamping'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Pós, grãos e sólidos',
    categorias: ['pos', 'graos', 'solidos'],
    produtos: [
      'Açúcar',
      'Adoçantes',
      'Sal',
      'Temperos',
      'Café',
      'Bebidas em pó',
      'Leite em pó',
      'Whey protein',
      'Creatina',
      'Colágeno',
      'Farinhas',
      'Fermento',
      'Sementes',
      'Ervas',
      'Chás',
      'Pequenos grãos',
      'Fertilizantes',
      'Ração animal',
      'Ingredientes industriais secos'
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
      valor: '2.350 x 2.600 mm'
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
      valor: 'Pós, grãos e sólidos'
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
