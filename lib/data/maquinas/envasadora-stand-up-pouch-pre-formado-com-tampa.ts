import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-stand-up-pouch-pre-formado-com-tampa.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-stand-up-pouch-pre-formado-com-tampa.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraStandUpPouchPreFormadoComTampa: MaquinaCatalogo = {
  slug: 'envasadora-stand-up-pouch-pre-formado-com-tampa',
  legacyId: 20,
  nome: 'Linha Pouch',
  nomeCompleto:
    'Linha Pouch - Envasadora para Stand-Up Pouch Pré-formado com Tampa',
  headline:
    'Envase e fechamento automático de pouches pré-formados com tampa rosqueável, com foco em higiene, segurança e praticidade.',
  seo: {
    titulo: 'Envasadora de Pouch Pré-formado com Tampa | Profills',
    descricao:
      'Linha automática para envase e aplicação de tampas rosqueáveis em stand-up pouches pré-formados, com produção de até 2.400 unidades por hora.'
  },
  categoria: 'Stand-up pouch',
  paginaCatalogo: 'P.17',
  tipoPagina: 'padrao',
  descritivo:
    'Esta linha foi desenvolvida para o envase de stand-up pouches pré-formados com aplicação automática de tampas rosqueáveis. O equipamento reúne dosagem, posicionamento e fechamento em uma solução controlada por CLP e IHM touchscreen. A configuração é indicada para produtos que exigem uma embalagem prática, reutilizável e com boa apresentação no ponto de venda.',
  recursos: [
    'Formato especial customizado',
    'Fechamento automático por tampa rosqueável',
    'Datação por inkjet',
    'Configuração conforme bico, tampa, produto e volume'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos e pastosos',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Polpas de frutas',
      'Purês de frutas',
      'Papinhas',
      'Molho de tomate',
      'Ketchup',
      'Maionese',
      'Mostarda',
      'Molhos para salada',
      'Mel',
      'Xaropes',
      'Sucos concentrados',
      'Bebidas lácteas',
      'Sabão líquido',
      'Detergente',
      'Amaciante',
      'Desinfetante',
      'Shampoo',
      'Condicionador',
      'Cremes cosméticos',
      'Fertilizantes líquidos',
      'Bioestimulantes'
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
      valor: 'Até 2.400 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet'
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
      valor: '130 a 160 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '130 a 160 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '157 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '180 a 280 mm'
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
  capacidadeMaxima: 2400,
  embalagensCompativeis: ['Pouch'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 2.400 unidades/hora'
    },
    {
      rotulo: 'Área de operação',
      valor: '5.300 x 3.300 mm'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '5,10 kW'
    }
  ]
};
