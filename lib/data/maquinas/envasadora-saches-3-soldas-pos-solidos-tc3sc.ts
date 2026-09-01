import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-saches-3-soldas-pos-solidos-tc3sc.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-saches-3-soldas-pos-solidos-tc3sc.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSaches3SoldasPosSolidosTc3sc: MaquinaCatalogo = {
  slug: 'envasadora-saches-3-soldas-pos-solidos-tc3sc',
  legacyId: 7,
  nome: 'Linha TC3SC',
  nomeCompleto:
    'Linha TC3SC - Envasadora de Sachês 3 Soldas para Pós e Sólidos',
  headline:
    'Envase de pós, grãos e sólidos em sachês três soldas com diferentes opções de abertura e formato.',
  seo: {
    titulo: 'Envasadora de Sachês para Pós e Sólidos TC3SC',
    descricao:
      'Envasadora TC3SC para pós, grãos e sólidos em sachês três soldas, com produção de até 1.800 unidades por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.36',
  tipoPagina: 'padrao',
  descritivo:
    'A TC3SC para pós e sólidos utiliza dosagem temporizada ou volumétrica e produz sachês com três soldas. A máquina trabalha com diferentes estruturas flexíveis e oferece recursos de abre-fácil e formato especial. É uma solução para dosagem fracionada de produtos secos com controle por CLP e IHM touchscreen.',
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
      'Pimenta',
      'Temperos',
      'Café solúvel',
      'Cappuccino',
      'Chocolate em pó',
      'Leite em pó',
      'Bebidas em pó',
      'Whey protein',
      'Creatina',
      'Colágeno',
      'Vitaminas em pó',
      'Fermento',
      'Sementes',
      'Ervas',
      'Chás',
      'Pequenos grãos',
      'Fertilizantes granulados',
      'Produtos veterinários em pó'
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
      valor: 'Até 1.800 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Alto-relevo, inkjet ou hot stamping'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado ou volumétrico'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '1,97 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '1,80 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '145 L/min'
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
      valor: '140 a 360 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '50 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '40 a 160 mm'
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
      valor: 'Pós, grãos e sólidos'
    }
  ],
  capacidadeMaxima: 1800,
  embalagensCompativeis: ['Sachê'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.800 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado ou volumétrico'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Alto-relevo, inkjet ou hot stamping'
    }
  ]
};
