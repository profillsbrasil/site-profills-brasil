import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/empacotadeira-vertical-ptc-speed.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/empacotadeira-vertical-ptc-speed.webp';

import type { MaquinaCatalogo } from './types';

export const empacotadeiraVerticalPtcSpeed: MaquinaCatalogo = {
  slug: 'empacotadeira-vertical-ptc-speed',
  legacyId: 23,
  nome: 'Linha PTC Speed',
  nomeCompleto: 'Linha PTC Speed - Empacotadeira Vertical para Pós e Sólidos',
  headline:
    'Empacotamento vertical de pós, grãos e sólidos com diferentes sistemas de alimentação e dosagem.',
  seo: {
    titulo: 'Empacotadeira Vertical PTC Speed',
    descricao:
      'Empacotadeira vertical PTC Speed para pós, grãos e sólidos, com múltiplos dosadores e produção de até 4.200 unidades por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.42',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha PTC Speed forma, dosa e sela embalagens verticais para produtos secos. Pode ser configurada com balança multicabeçote, alimentador de gaveta, copos volumétricos ou rosca sem-fim, conforme granulometria, fluidez e peso desejado. É indicada para linhas que precisam de versatilidade e padronização no empacotamento de produtos em maiores volumes.',
  recursos: [
    'Balança multicabeçote',
    'Alimentador de gaveta',
    'Copos volumétricos',
    'Rosca sem-fim',
    'Datação por inkjet ou hot stamping',
    'Integração com elevadores e esteiras'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Pós, grãos, granulados e sólidos',
    categorias: ['pos', 'graos', 'solidos'],
    produtos: [
      'Arroz',
      'Feijão',
      'Café em grãos',
      'Café moído',
      'Açúcar',
      'Sal',
      'Farinhas',
      'Leite em pó',
      'Whey protein',
      'Cereais',
      'Granola',
      'Castanhas',
      'Amendoim',
      'Frutas secas',
      'Temperos',
      'Ervas',
      'Sementes',
      'Ração pet',
      'Ração para gado',
      'Fertilizantes',
      'Adubos granulados',
      'Gelo',
      'Produtos congelados compatíveis'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/sache-saco.glb',
    cameraOrbit: '29deg 84deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 4.200 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor:
        'Balança multicabeçote, alimentador de gaveta, copos volumétricos ou rosca sem-fim'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '4,36 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '3,85 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '250 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '9.300 x 4.100 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '200 a 600 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '70 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '80 a 280 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '100 a 500 mm'
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
  capacidadeMaxima: 4200,
  embalagensCompativeis: ['Sachê'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 4.200 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor:
        'Balança multicabeçote, alimentador de gaveta, copos volumétricos ou rosca sem-fim'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
    }
  ]
};
