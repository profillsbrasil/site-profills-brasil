import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-stand-up-pouch-speed.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-stand-up-pouch-speed.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraStandUpPouchSpeed: MaquinaCatalogo = {
  slug: 'envasadora-stand-up-pouch-speed',
  legacyId: 16,
  nome: 'Linha Pouch Speed',
  nomeCompleto: 'Linha Pouch Speed - Envasadora Stand-Up Pouch Mecânica',
  headline:
    'Alta produtividade para operações que precisam automatizar alimentação, abertura, dosagem e selagem de embalagens stand-up pouch.',
  seo: {
    titulo: 'Envasadora Stand-Up Pouch Speed | Profills',
    descricao:
      'Envasadora automática stand-up pouch de alta velocidade para líquidos, pós, grãos e sólidos, com produção de até 5.400 unidades por hora.'
  },
  categoria: 'Stand-up pouch',
  paginaCatalogo: 'P.16',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha Pouch Speed é uma solução mecânica de alta velocidade para o envase em embalagens stand-up pouch. Foi desenvolvida para integrar as principais etapas do processo em um fluxo contínuo, com controle por CLP e IHM touchscreen. A configuração de dosagem é definida de acordo com a característica do produto, permitindo trabalhar com líquidos, pós e determinados sólidos. É indicada para indústrias que buscam produtividade, repetibilidade e acabamento padronizado da embalagem.',
  recursos: [
    'Formato especial customizado',
    'Datação por inkjet ou hot stamping',
    'Dosagem temporizada, por bomba positiva ou volumétrica',
    'Configuração definida após testes com produto e embalagem'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, pastosos, pós, grãos e sólidos',
    categorias: ['liquidos', 'pastosos', 'pos', 'graos', 'solidos'],
    produtos: [
      'Molho de tomate',
      'Ketchup',
      'Maionese',
      'Mostarda',
      'Molhos prontos',
      'Polpas de frutas',
      'Sucos concentrados',
      'Bebidas funcionais',
      'Mel',
      'Sabão líquido',
      'Detergente',
      'Amaciante',
      'Desinfetante',
      'Shampoo',
      'Condicionador',
      'Fertilizante líquido',
      'Whey protein',
      'Café',
      'Arroz',
      'Feijão',
      'Castanhas',
      'Temperos',
      'Ração pet'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/pouch.glb',
    cameraOrbit: '27deg 80deg 100%'
  },
  specsEmbalagem: [
    { rotulo: 'Largura do filme', valor: '320 a 650 mm' },
    { rotulo: 'Espessura do filme', valor: '130 a 160 µm' },
    { rotulo: 'Largura final da embalagem', valor: '125 a 280 mm' },
    { rotulo: 'Comprimento final da embalagem', valor: '100 a 200 mm' },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH'
    },
    { rotulo: 'Tipos de produto', valor: 'Líquidos, pós e alguns sólidos' }
  ],
  specsMaquina: [
    { rotulo: 'Capacidade de produção', valor: 'Até 5.400 unidades/hora' },
    { rotulo: 'Sistema de datação', valor: 'Inkjet ou hot stamping' },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    },
    { rotulo: 'Tensão operativa', valor: '220 V / 60 Hz' },
    { rotulo: 'Potência ativa instalada', valor: '8,97 kW' },
    { rotulo: 'Consumo de energia', valor: '6,65 kWh' },
    { rotulo: 'Comando', valor: 'CLP com IHM touchscreen' },
    { rotulo: 'Consumo de ar', valor: '349 L/min' },
    { rotulo: 'Área de operação', valor: '5.300 x 3.300 mm' },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  capacidadeMaxima: 5400,
  embalagensCompativeis: ['Pouch'],
  destaqueHero: [
    { rotulo: 'Capacidade', valor: 'até 5.400 un/h' },
    { rotulo: 'Dosagem', valor: 'temporizada · bomba · volumétrica' },
    { rotulo: 'Comando', valor: 'CLP + IHM touchscreen' }
  ]
};
