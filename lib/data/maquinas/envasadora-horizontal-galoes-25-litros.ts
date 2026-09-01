import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-horizontal-galoes-25-litros.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-horizontal-galoes-25-litros.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraHorizontalGaloes25Litros: MaquinaCatalogo = {
  slug: 'envasadora-horizontal-galoes-25-litros',
  legacyId: 15,
  nome: 'Linha de Frascos',
  nomeCompleto: 'Linha de Frascos - Envasadora Horizontal para Galões',
  headline:
    'Dosagem gravimétrica para envase de líquidos em galões e recipientes de até 25 litros.',
  seo: {
    titulo: 'Envasadora para Galões de até 25 Litros',
    descricao:
      'Linha horizontal para envase gravimétrico de líquidos em galões de até 25 litros, com produção de até 2.000 unidades por hora.'
  },
  categoria: 'Embalagens rígidas',
  paginaCatalogo: 'P.50',
  tipoPagina: 'padrao',
  descritivo:
    'A Envasadora Horizontal para Galões atende recipientes de até 25 litros e utiliza dosagem gravimétrica. A linha pode receber alimentação automática, por esteira ou manual, além de fechamento automático ou manual. É indicada para operações que exigem controle de peso em volumes maiores e integração com linhas de movimentação de embalagens rígidas.',
  recursos: [
    'Alimentação automática, por esteira ou manual',
    'Fechamento automático ou manual',
    'Dosagem gravimétrica',
    'Datação: não especificada no catálogo'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos em galões e bombonas',
    categorias: ['liquidos'],
    produtos: [
      'Sabão líquido',
      'Detergente',
      'Amaciante',
      'Desinfetante',
      'Água sanitária',
      'Desengraxantes',
      'Óleos',
      'Lubrificantes',
      'Fluidos automotivos',
      'Fertilizantes líquidos',
      'Bioestimulantes',
      'Óleos alimentícios',
      'Xaropes',
      'Ingredientes líquidos a granel',
      'Produtos químicos compatíveis'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/galao.glb',
    cameraOrbit: '33deg 83deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 2.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Não especificado no catálogo'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Gravimétrico'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '6,74 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '4,71 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '613 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '2.700 x 10.000 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Alimentação',
      valor: 'Automática, por esteira ou manual'
    },
    {
      rotulo: 'Volume do galão',
      valor: 'Até 25 L'
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
  capacidadeMaxima: 2000,
  embalagensCompativeis: ['Galão'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 2.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Gravimétrico'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    }
  ]
};
