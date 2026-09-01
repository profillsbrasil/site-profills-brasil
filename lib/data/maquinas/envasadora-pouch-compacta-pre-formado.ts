import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-pouch-compacta-pre-formado.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-pouch-compacta-pre-formado.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraPouchCompactaPreFormado: MaquinaCatalogo = {
  slug: 'envasadora-pouch-compacta-pre-formado',
  nome: 'Linha Pouch Compacta',
  nomeCompleto:
    'Linha Pouch Compacta - Envasadora para Stand-Up Pouch Pré-formado',
  headline:
    'Automação de alimentação, abertura, dosagem e selagem em uma solução compacta para áreas produtivas com espaço reduzido.',
  seo: {
    titulo: 'Envasadora Pouch Compacta Pré-formado',
    descricao:
      'Envasadora compacta para stand-up pouch pré-formado, indicada para líquidos, grãos e pós, com produção de até 900 unidades por hora.'
  },
  categoria: 'Stand-up pouch',
  paginaCatalogo: 'P.18',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha Pouch Compacta automatiza o envase em embalagens stand-up pouch pré-formadas com uma ocupação física reduzida. O conjunto integra alimentação da embalagem, abertura, dosagem e selagem, oferecendo controle operacional e acabamento profissional. É uma alternativa para empresas que desejam automatizar a produção sem implantar uma linha de grande porte.',
  recursos: [
    'Datação por inkjet ou hot stamping',
    'Dosagem temporizada ou volumétrica',
    'Configuração conforme produto e embalagem',
    'Integração com alimentadores e esteiras, sob projeto'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, pastosos, pós, grãos e sólidos',
    categorias: ['liquidos', 'pastosos', 'pos', 'graos', 'solidos'],
    produtos: [
      'Café em grãos',
      'Café moído',
      'Arroz',
      'Feijão',
      'Cereais',
      'Granola',
      'Castanhas',
      'Frutas secas',
      'Temperos',
      'Ervas',
      'Sementes',
      'Farinhas',
      'Whey protein',
      'Leite em pó',
      'Açúcar',
      'Ração pet',
      'Molho de tomate',
      'Molhos prontos',
      'Mel',
      'Sabão líquido',
      'Detergente',
      'Fertilizantes'
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
      valor: 'Até 900 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
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
      valor: '5,10 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '4,15 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '257 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '970 x 570 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '200 a 400 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '130 a 160 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '100 a 200 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '120 a 230 mm'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos, grãos e pós'
    }
  ],
  capacidadeMaxima: 900,
  embalagensCompativeis: ['Pouch'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 900 unidades/hora'
    },
    {
      rotulo: 'Área de operação',
      valor: '970 x 570 mm'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado ou volumétrico'
    }
  ]
};
