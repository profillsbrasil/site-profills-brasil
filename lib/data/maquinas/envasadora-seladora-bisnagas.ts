import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-seladora-bisnagas.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-seladora-bisnagas.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSeladoraBisnagas: MaquinaCatalogo = {
  slug: 'envasadora-seladora-bisnagas',
  legacyId: 26,
  nome: 'Linha Bisnagas',
  nomeCompleto: 'Linha Bisnagas - Envasadora e Seladora de Bisnagas',
  headline:
    'Envase preciso e fechamento automático de bisnagas para produtos de diferentes viscosidades.',
  seo: {
    titulo: 'Envasadora e Seladora de Bisnagas',
    descricao:
      'Máquina automática para envase e fechamento de bisnagas plásticas, metálicas ou cartonadas, com produção de até 1.800 unidades por hora.'
  },
  categoria: 'Embalagens cartonadas e especiais',
  paginaCatalogo: 'P.22',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha Bisnagas foi projetada para dosar e fechar tubos de diferentes diâmetros, comprimentos e materiais. Pode utilizar prensa extrusora, bomba positiva ou sistema volumétrico, conforme a viscosidade e o comportamento do produto. A solução oferece controle por CLP e IHM touchscreen, permitindo atender aplicações em cosméticos, alimentos e produtos farmacêuticos.',
  recursos: [
    'Dosagem por prensa extrusora',
    'Dosagem por bomba positiva',
    'Dosagem volumétrica',
    'Configuração de fechamento conforme material da bisnaga'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, cremes, géis e pastosos',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Cremes hidratantes',
      'Loções',
      'Protetor solar',
      'Shampoo',
      'Condicionador',
      'Gel capilar',
      'Gel dental',
      'Pomadas',
      'Géis farmacêuticos',
      'Adesivos',
      'Selantes',
      'Graxas',
      'Molho de tomate',
      'Ketchup',
      'Maionese',
      'Mostarda',
      'Patês',
      'Pastas de amendoim',
      'Leite condensado',
      'Doce de leite'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/bisnaga.glb',
    cameraOrbit: '28deg 78deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.800 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Prensa extrusora, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '6,00 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '4,85 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '255 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '3.400 x 3.000 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Diâmetro do tubo',
      valor: '10 a 52 mm'
    },
    {
      rotulo: 'Comprimento do tubo',
      valor: '60 a 250 mm'
    },
    {
      rotulo: 'Volume do tubo',
      valor: '1,5 a 350 ml'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'Plástico, metal e estruturas cartonadas'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos e pastosos compatíveis'
    }
  ],
  capacidadeMaxima: 1800,
  embalagensCompativeis: ['Bisnaga'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.800 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Prensa extrusora, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '6,00 kW'
    }
  ]
};
