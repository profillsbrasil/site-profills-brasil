import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/enfardadeira-produtos-acabados-tc4u.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/enfardadeira-produtos-acabados-tc4u.webp';

import type { MaquinaCatalogo } from './types';

export const enfardadeiraProdutosAcabadosTc4u: MaquinaCatalogo = {
  slug: 'enfardadeira-produtos-acabados-tc4u',
  legacyId: 22,
  nome: 'Linha TC4U',
  nomeCompleto: 'Linha TC4U - Enfardadeira para Produtos Acabados',
  headline:
    'Agrupamento e enfardamento automático de produtos pré-embalados para melhorar proteção, organização e transporte.',
  seo: {
    titulo: 'Enfardadeira Automática TC4U',
    descricao:
      'Enfardadeira TC4U para agrupamento, compactação e selagem de produtos acabados, com produção de até 1.100 fardos por hora.'
  },
  categoria: 'Fim de linha e embalagens flexíveis',
  paginaCatalogo: 'P.41',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha TC4U foi projetada para agrupar, compactar e selar produtos que já passaram pelo envase primário. A enfardadeira organiza diferentes formatos e volumes em embalagens secundárias, facilitando movimentação, armazenagem e expedição. Sensores e sistemas de contagem ou pesagem definem a composição do fardo conforme o projeto.',
  recursos: [
    'Controle por balança',
    'Sensor contador',
    'Sensor de tempo',
    'Datação por inkjet ou hot stamping',
    'Configuração do agrupamento conforme produto'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Produtos pré-embalados e fardos',
    categorias: [],
    produtos: [
      'Sachês de alimentos',
      'Sachês de saneantes',
      'Sachês de cosméticos',
      'Sticks',
      'Pouches',
      'Pacotes de arroz',
      'Pacotes de feijão',
      'Pacotes de café',
      'Pacotes de açúcar',
      'Pacotes de farinha',
      'Pacotes de ração',
      'Fraldas',
      'Produtos de higiene',
      'Kits promocionais',
      'Unidades agrupadas para expedição'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/fardo.glb',
    cameraOrbit: '52deg 68deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.100 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Balança, sensor contador ou sensor de tempo'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '1,95 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '1,70 kWh'
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
      valor: '450 a 1.200 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '50 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '210 a 560 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '190 a 450 mm'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Produtos acabados e pré-embalados'
    }
  ],
  capacidadeMaxima: 1100,
  embalagensCompativeis: ['Fardo'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.100 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Balança, sensor contador ou sensor de tempo'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
    }
  ]
};
