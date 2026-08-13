import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-frascos-tubulares.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-frascos-tubulares.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraFrascosTubulares: MaquinaCatalogo = {
  slug: 'envasadora-frascos-tubulares',
  legacyId: 33,
  nome: 'Linha de Frascos Tubulares',
  nomeCompleto:
    'Linha de Frascos Tubulares - Envasadora com Fechamento Automático',
  headline:
    'Envase e fechamento automático de frascos tubulares de pequeno volume.',
  seo: {
    titulo: 'Envasadora para Frascos Tubulares | Profills',
    descricao:
      'Envasadora para frascos tubulares plásticos de 50 a 150 ml, com fechamento automático e produção de até 1.000 unidades por hora.'
  },
  categoria: 'Embalagens rígidas',
  paginaCatalogo: 'P.49',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha de Frascos Tubulares foi desenvolvida para o envase de líquidos em recipientes plásticos de 50 a 150 ml. A máquina integra alimentação, dosagem e fechamento automático, oferecendo precisão e padronização para embalagens de pequeno formato. O sistema é controlado por CLP e IHM touchscreen.',
  recursos: [
    'Alimentação automática ou manual',
    'Fechamento automático',
    'Datação por inkjet ou laser',
    'Configuração conforme frasco e tampa'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos em frascos tubulares e pequenas doses',
    categorias: ['liquidos'],
    produtos: [
      'Bebidas energéticas',
      'Shots funcionais',
      'Suplementos líquidos',
      'Vitaminas líquidas',
      'Probióticos líquidos',
      'Aromas',
      'Essências',
      'Cosméticos líquidos',
      'Séruns',
      'Amostras',
      'Produtos de higiene',
      'Produtos farmacêuticos compatíveis',
      'Produtos veterinários líquidos'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/frascos-tubulares.glb',
    cameraOrbit: '43deg 77deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou laser'
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
      valor: '4,70 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '3,50 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '314 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '6.400 x 4.200 mm'
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
      valor: '50 a 150 ml'
    },
    {
      rotulo: 'Sistema de fechamento',
      valor: 'Automático'
    },
    {
      rotulo: 'Material compatível',
      valor: 'Plástico'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos'
    }
  ],
  capacidadeMaxima: 1000,
  embalagensCompativeis: ['Frasco'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou laser'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado'
    }
  ]
};
