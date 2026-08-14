import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-linear-frascos-fechamento-automatico.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-linear-frascos-fechamento-automatico.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraLinearFrascosFechamentoAutomatico: MaquinaCatalogo = {
  slug: 'envasadora-linear-frascos-fechamento-automatico',
  legacyId: 17,
  nome: 'Linha de Frascos',
  nomeCompleto:
    'Linha de Frascos - Envasadora Linear com Fechamento Automático',
  headline:
    'Envase linear e fechamento integrado para frascos pequenos, com bomba volumétrica e cilindro pneumático.',
  seo: {
    titulo: 'Envasadora Linear com Fechamento Automático | Profills',
    descricao:
      'Linha automática para envase de líquidos em frascos de 0,5 a 500 ml, com bomba volumétrica e produção de até 3.000 unidades por hora.'
  },
  categoria: 'Embalagens rígidas',
  paginaCatalogo: 'P.51',
  tipoPagina: 'padrao',
  descritivo:
    'Esta Linha de Frascos combina envase linear e sistema de fechamento em um fluxo automatizado. A dosagem é realizada por bomba volumétrica com cilindro pneumático, atendendo volumes de 0,5 a 500 ml. A solução pode trabalhar com alimentação e fechamento automáticos ou manuais, conforme a configuração da linha.',
  recursos: [
    'Alimentação automática ou manual',
    'Fechamento automático ou manual',
    'Bomba volumétrica com cilindro pneumático',
    'Datação: não especificada no catálogo'
  ],
  aplicacoes: {
    categoriaPrincipal:
      'Líquidos e pastosos em frascos de pequeno e médio volume',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Cosméticos líquidos',
      'Séruns',
      'Loções',
      'Shampoo',
      'Condicionador',
      'Sabonete líquido',
      'Aromas',
      'Essências',
      'Corantes',
      'Molhos',
      'Mel',
      'Xaropes',
      'Suplementos líquidos',
      'Saneantes concentrados',
      'Produtos farmacêuticos compatíveis',
      'Produtos veterinários',
      'Amostras comerciais'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/garrafas-02.glb',
    cameraOrbit: '57deg 70deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 3.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Não especificado no catálogo'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Bomba volumétrica com cilindro pneumático'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '10,2 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '7,19 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '888 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '10.000 x 4.100 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Alimentação',
      valor: 'Automática ou manual'
    },
    {
      rotulo: 'Volume do frasco',
      valor: '0,5 a 500 ml'
    },
    {
      rotulo: 'Sistema de fechamento',
      valor: 'Automático ou manual'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'Qualquer material compatível com o processo'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos'
    }
  ],
  capacidadeMaxima: 3000,
  embalagensCompativeis: ['Frasco'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 3.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Bomba volumétrica com cilindro pneumático'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    }
  ]
};
