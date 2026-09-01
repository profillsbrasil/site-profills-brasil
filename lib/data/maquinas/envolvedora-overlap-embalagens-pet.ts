import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envolvedora-overlap-embalagens-pet.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envolvedora-overlap-embalagens-pet.webp';

import type { MaquinaCatalogo } from './types';

export const envolvedoraOverlapEmbalagensPet: MaquinaCatalogo = {
  slug: 'envolvedora-overlap-embalagens-pet',
  legacyId: 30,
  nome: 'Envolvedora Overlap para Embalagens PET',
  nomeCompleto: 'Envolvedora Overlap para Embalagens PET',
  headline:
    'Envolvimento automático de conjuntos de embalagens PET para proteção, estabilidade e transporte.',
  seo: {
    titulo: 'Envolvedora Overlap para Embalagens PET',
    descricao:
      'Máquina envolvedora overlap para agrupamento e proteção de garrafas PET, com esteira alimentada e capacidade de até 90 unidades por hora.'
  },
  categoria: 'Fim de linha',
  paginaCatalogo: 'P.54',
  tipoPagina: 'padrao',
  descritivo:
    'A Envolvedora Overlap aplica filme ao redor de conjuntos de garrafas PET para formar embalagens secundárias estáveis. A linha utiliza esteira alimentada, permite ajuste do processo e é indicada para operações de fim de linha e distribuição. O sistema favorece proteção da carga, organização logística e melhor aproveitamento do filme.',
  recursos: [
    'Esteira com alimentação',
    'Ajustes conforme tamanho e agrupamento',
    'Integração com linha de envase e paletização',
    'Controle por CLP e IHM touchscreen'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Garrafas e frascos PET agrupados',
    categorias: [],
    produtos: [
      'Fardos de água mineral',
      'Fardos de refrigerantes',
      'Fardos de sucos',
      'Fardos de bebidas não carbonatadas',
      'Fardos de leite',
      'Fardos de óleo',
      'Fardos de detergente',
      'Fardos de água sanitária',
      'Fardos de produtos de limpeza',
      'Agrupamentos de frascos PET para transporte e distribuição'
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
      valor: 'Até 90 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Não aplicável'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Alimentação por esteira'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 ou 380 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '38,50 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '27,35 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '120 L/min'
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
      rotulo: 'Largura do filme',
      valor: '750 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '40 a 230 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '500 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '350 mm; altura final de 300 mm'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'PEBD'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Garrafas PET'
    }
  ],
  capacidadeMaxima: 90,
  embalagensCompativeis: ['Fardo'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 90 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Alimentação por esteira'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 ou 380 V / 60 Hz'
    }
  ]
};
