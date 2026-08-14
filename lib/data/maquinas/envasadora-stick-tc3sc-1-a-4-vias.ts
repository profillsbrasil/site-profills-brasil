import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-stick-tc3sc-1-a-4-vias.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-stick-tc3sc-1-a-4-vias.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraStickTc3sc1A4Vias: MaquinaCatalogo = {
  slug: 'envasadora-stick-tc3sc-1-a-4-vias',
  legacyId: 9,
  nome: 'Linha TC3SC Stick 1 a 4 Vias',
  nomeCompleto: 'Linha TC3SC Stick 1 a 4 Vias - Envasadora de Sachês Stick',
  headline:
    'Sachês stick em até quatro vias para porções individuais de líquidos, pós e granulados.',
  seo: {
    titulo: 'Envasadora Stick TC3SC de 1 a 4 Vias | Profills',
    descricao:
      'Envasadora de sachês stick TC3SC com uma a quatro vias para líquidos e secos, produzindo até 4.000 unidades por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.38',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha TC3SC Stick produz embalagens estreitas em formato stick e pode operar com uma a quatro vias de envase. A solução atende produtos líquidos e secos e oferece diferentes sistemas de dosagem, datação e abertura. A solda diagonal e os formatos especiais ampliam as possibilidades de design e uso da embalagem.',
  recursos: [
    'Uma a quatro vias',
    'Abre-fácil simples',
    'Abre-fácil triangular',
    'Abre-fácil serrilhado',
    'Solda diagonal',
    'Formato especial customizado',
    'Datação em alto-relevo, inkjet ou hot stamping'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, pastosos, pós e granulados em stick',
    categorias: ['liquidos', 'pastosos', 'pos', 'graos'],
    produtos: [
      'Açúcar',
      'Adoçantes',
      'Café solúvel',
      'Cappuccino',
      'Bebidas em pó',
      'Whey protein',
      'Creatina',
      'Colágeno',
      'Vitaminas',
      'Eletrólitos',
      'Temperos',
      'Sal',
      'Mel',
      'Géis energéticos',
      'Molhos',
      'Suplementos líquidos',
      'Alimento pastoso para cães',
      'Alimento pastoso para gatos',
      'Fertilizantes em pó',
      'Bioestimulantes líquidos',
      'Produtos veterinários em dose individual'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/stick.glb',
    cameraOrbit: '20deg 120deg 100%'
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
      valor: '2,00 kWh'
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
      valor: '200 a 360 mm'
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
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Alto-relevo, inkjet ou hot stamping'
    }
  ]
};
