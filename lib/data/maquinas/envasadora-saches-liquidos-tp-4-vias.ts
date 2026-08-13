import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-saches-liquidos-tp-4-vias.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-saches-liquidos-tp-4-vias.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSachesLiquidosTp4Vias: MaquinaCatalogo = {
  slug: 'envasadora-saches-liquidos-tp-4-vias',
  legacyId: 5,
  nome: 'Linha TP 4 Vias',
  nomeCompleto: 'Linha TP 4 Vias - Envasadora de Sachês para Líquidos',
  headline:
    'Quatro vias simultâneas para ampliar a produtividade de líquidos, cremes e pastas em sachês.',
  seo: {
    titulo: 'Envasadora de Sachês TP 4 Vias | Profills',
    descricao:
      'Envasadora TP de quatro vias para líquidos, cremes e pastas, com produção simultânea de até 8.000 sachês por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.29',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha TP 4 Vias foi desenvolvida para realizar o envase simultâneo de quatro sachês por ciclo. A configuração aumenta a capacidade produtiva sem exigir quatro máquinas independentes, favorecendo o aproveitamento da área industrial. É indicada para operações de médio e grande porte que trabalham com líquidos, cremes ou pastas e precisam de repetibilidade e produção em paralelo.',
  recursos: [
    'Solda e corte',
    'Ferramental simples',
    'Produção simultânea em quatro vias',
    'Datação por hot stamping'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, cremes e pastosos',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Molho de tomate',
      'Ketchup',
      'Maionese',
      'Mostarda',
      'Molho de pimenta',
      'Mel',
      'Xaropes',
      'Polpas de frutas',
      'Bebidas concentradas',
      'Cremes alimentícios',
      'Sabão líquido',
      'Detergente',
      'Desinfetante',
      'Shampoo',
      'Condicionador',
      'Cremes cosméticos',
      'Loções',
      'Amostras líquidas',
      'Fertilizantes líquidos'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 8.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Hot stamping'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '3,46 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '2,45 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '580 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '2.100 x 1.430 mm'
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
      valor: '60 a 90 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '35 a 40 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '40 a 250 mm'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos'
    }
  ],
  capacidadeMaxima: 8000,
  embalagensCompativeis: ['Sachê'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 8.000 unidades/hora'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '3,46 kW'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '580 L/min'
    }
  ]
};
