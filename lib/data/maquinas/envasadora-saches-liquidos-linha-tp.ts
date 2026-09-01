import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-saches-liquidos-linha-tp.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-saches-liquidos-linha-tp.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSachesLiquidosLinhaTp: MaquinaCatalogo = {
  slug: 'envasadora-saches-liquidos-linha-tp',
  legacyId: 1,
  nome: 'Linha TP',
  nomeCompleto: 'Linha TP - Envasadora de Sachês para Líquidos',
  headline:
    'Versatilidade e precisão para envase de líquidos em sachês, com diferentes larguras, volumes e opções de acabamento.',
  seo: {
    titulo: 'Envasadora de Sachês para Líquidos Linha TP',
    descricao:
      'Linha TP para envase de líquidos em sachês de PEBD ou PEAD, com produção de até 3.000 unidades por hora e opções especiais de solda e formato.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.28',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha TP é uma envasadora vertical para produtos líquidos em sachês. Pode trabalhar com sistemas de dosagem temporizado, por bomba positiva ou volumétrico, conforme a viscosidade e o volume. A linha oferece opções de solda, corte e ferramental, além da possibilidade de envase duplo com injeção secundária. É indicada para empresas que buscam produtividade, padronização e flexibilidade de aplicação.',
  recursos: [
    'Solda e corte',
    'Solda larga',
    'Ferramental simples',
    'Ferramental trapezoidal',
    'Envase duplo com injeção secundária',
    'Datação por hot stamping'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos e pastosos',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Polpas de frutas',
      'Geladinhos',
      'Sucos',
      'Bebidas lácteas',
      'Iogurte líquido',
      'Molho de tomate',
      'Ketchup',
      'Maionese',
      'Mostarda',
      'Molho de pimenta',
      'Mel',
      'Xaropes',
      'Óleos',
      'Sabão líquido',
      'Detergente',
      'Amaciante',
      'Desinfetante',
      'Shampoo',
      'Condicionador',
      'Cremes',
      'Loções',
      'Fertilizantes líquidos',
      'Bioestimulantes',
      'Produtos veterinários líquidos'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 3.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Hot stamping'
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
      valor: '1,95 a 2,15 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '1,20 a 1,80 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '277 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '2.100 x 2.450 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '80 a 600 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '60 a 90 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '35 a 160 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '40 a 270 mm'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'PEBD e PEAD'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos'
    }
  ],
  capacidadeMaxima: 3000,
  embalagensCompativeis: ['Sachê'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 3.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Hot stamping'
    }
  ]
};
