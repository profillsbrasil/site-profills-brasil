import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/embaladora-horizontal-flowpack.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/embaladora-horizontal-flowpack.webp';

import type { MaquinaCatalogo } from './types';

export const embaladoraHorizontalFlowpack: MaquinaCatalogo = {
  slug: 'embaladora-horizontal-flowpack',
  legacyId: 25,
  nome: 'Linha Flowpack',
  nomeCompleto: 'Linha Flowpack - Embaladora Horizontal para Sólidos',
  headline:
    'Embalagem horizontal contínua para itens sólidos unitários ou agrupados, com velocidade, precisão e apresentação padronizada.',
  seo: {
    titulo: 'Embaladora Horizontal Flowpack | Profills',
    descricao:
      'Embaladora horizontal flowpack para produtos sólidos unitários ou agrupados, com produção de até 3.000 unidades por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.44',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha Flowpack embala produtos sólidos em fluxo horizontal, formando uma embalagem contínua ao redor do item. O controle temporizado e por fotocélula favorece o sincronismo com produtos unitários ou agrupados. É indicada para alimentos, cosméticos, produtos farmacêuticos e outros itens acabados que necessitem proteção e boa apresentação.',
  recursos: [
    'Controle temporizado',
    'Fotocélula',
    'Datação por inkjet ou hot stamping',
    'Configuração de esteira conforme produto'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Produtos sólidos unitários ou agrupados',
    categorias: ['solidos'],
    produtos: [
      'Barras de cereal',
      'Barras proteicas',
      'Biscoitos',
      'Cookies',
      'Chocolates',
      'Bombons',
      'Pães',
      'Bolos individuais',
      'Torradas',
      'Massas',
      'Macarrão instantâneo',
      'Frutas e legumes',
      'Picolés',
      'Queijos',
      'Sabonetes',
      'Esponjas',
      'Escovas',
      'Produtos médicos compatíveis',
      'Peças e kits',
      'Itens promocionais'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/flowpack.glb',
    cameraOrbit: '18deg 82deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 3.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado e fotocélula'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '2,77 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '2,55 kWh'
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
      valor: '4.500 x 2.500 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '500 a 600 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '50 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '235 a 285 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '70 a 250 mm'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Sólidos'
    }
  ],
  capacidadeMaxima: 3000,
  embalagensCompativeis: ['Flowpack'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 3.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado e fotocélula'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
    }
  ]
};
