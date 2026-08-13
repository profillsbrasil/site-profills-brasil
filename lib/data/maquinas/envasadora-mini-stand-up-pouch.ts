import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-mini-stand-up-pouch.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-mini-stand-up-pouch.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraMiniStandUpPouch: MaquinaCatalogo = {
  slug: 'envasadora-mini-stand-up-pouch',
  legacyId: 21,
  nome: 'Linha Pouch Mini',
  nomeCompleto: 'Linha Pouch Mini - Envasadora para Mini Stand-Up Pouch',
  headline:
    'Precisão no envase de pequenos pouches líquidos, com dosagem servoacionada, vedação segura e apresentação profissional.',
  seo: {
    titulo: 'Envasadora Mini Stand-Up Pouch | Profills',
    descricao:
      'Envasadora para mini stand-up pouch de líquidos, com dosagem volumétrica servoacionada e produção de até 1.500 unidades por hora.'
  },
  categoria: 'Stand-up pouch',
  paginaCatalogo: 'P.19',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha Pouch Mini atende o envase de líquidos em embalagens mini stand-up pouch. O sistema de dosagem volumétrica com servoacionamento favorece precisão e repetibilidade, enquanto o fechamento automático entrega vedação segura. É indicada para porções menores, amostras e produtos de consumo individual que precisam de uma embalagem diferenciada.',
  recursos: [
    'Datação por inkjet ou hot stamping',
    'Dosagem temporizada ou volumétrica',
    'Ajustes conforme viscosidade, volume e embalagem'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos e pastosos em pequenas porções',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Mel',
      'Xaropes',
      'Géis energéticos',
      'Molho de tomate',
      'Ketchup',
      'Maionese',
      'Mostarda',
      'Molho de pimenta',
      'Molhos para delivery',
      'Polpas de frutas',
      'Concentrados',
      'Suplementos líquidos',
      'Shampoo',
      'Condicionador',
      'Sabonete líquido',
      'Cremes cosméticos',
      'Amostras promocionais'
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
      valor: 'Até 1.500 unidades/hora'
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
      valor: '3,55 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '3,10 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '363 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '3.800 x 2.500 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '200 a 280 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '50 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '86,5 a 125 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '75 a 95 mm'
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
  capacidadeMaxima: 1500,
  embalagensCompativeis: ['Pouch'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.500 unidades/hora'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '3,55 kW'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '363 L/min'
    }
  ]
};
