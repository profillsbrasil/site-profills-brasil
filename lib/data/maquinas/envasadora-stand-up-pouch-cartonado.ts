import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-stand-up-pouch-cartonado.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-stand-up-pouch-cartonado.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraStandUpPouchCartonado: MaquinaCatalogo = {
  slug: 'envasadora-stand-up-pouch-cartonado',
  legacyId: 31,
  nome: 'Linha Pouch Cartonado',
  nomeCompleto: 'Linha Pouch Cartonado - Envasadora Stand-Up Pouch Mecânica',
  headline:
    'Alta velocidade de envase em stand-up pouch cartonado, combinando produtividade e diferenciação de embalagem.',
  seo: {
    titulo: 'Envasadora Stand-Up Pouch Cartonado | Profills',
    descricao:
      'Envasadora mecânica de alta velocidade para stand-up pouch cartonado, com produção de até 5.400 unidades por hora.'
  },
  categoria: 'Embalagens cartonadas e especiais',
  paginaCatalogo: 'P.26',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha Pouch Cartonado é uma solução mecânica para o envase de produtos em embalagens stand-up pouch com estrutura cartonada. A máquina combina alta velocidade, controle por CLP e IHM touchscreen e diferentes possibilidades de dosagem. A proposta atende projetos que buscam eficiência produtiva e uma embalagem com maior percepção de valor no ponto de venda.',
  recursos: [
    'Formato especial customizado',
    'Datação por inkjet ou hot stamping',
    'Dosagem temporizada, por bomba positiva ou volumétrica'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, pastosos, pós, grãos e sólidos',
    categorias: ['liquidos', 'pastosos', 'pos', 'graos', 'solidos'],
    produtos: [
      'Sucos',
      'Bebidas vegetais',
      'Molhos',
      'Mel',
      'Cafés especiais',
      'Whey protein',
      'Suplementos em pó',
      'Leite em pó',
      'Cereais',
      'Granola',
      'Arroz',
      'Feijão',
      'Castanhas',
      'Frutas secas',
      'Temperos',
      'Ervas',
      'Ração pet premium',
      'Fertilizantes especiais'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/pouch.glb',
    cameraOrbit: '27deg 80deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 5.400 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
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
      valor: '8,97 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '6,65 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '349 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '5.300 x 3.300 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '320 a 650 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '130 a 160 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '125 a 280 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '100 a 200 mm'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos, pós e alguns sólidos'
    }
  ],
  capacidadeMaxima: 5400,
  embalagensCompativeis: ['Pouch'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 5.400 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    }
  ]
};
