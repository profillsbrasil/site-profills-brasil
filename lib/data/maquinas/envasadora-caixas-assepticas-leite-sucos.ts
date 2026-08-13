import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-caixas-assepticas-leite-sucos.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-caixas-assepticas-leite-sucos.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraCaixasAssepticasLeiteSucos: MaquinaCatalogo = {
  slug: 'envasadora-caixas-assepticas-leite-sucos',
  legacyId: 28,
  nome: 'Linha Caixas Assépticas',
  nomeCompleto: 'Linha Caixas Assépticas - Envasadora para Leite e Sucos',
  headline:
    'Processo integrado para bebidas de longa vida em embalagem cartonada asséptica, com produtividade contínua e controle automatizado.',
  seo: {
    titulo: 'Envasadora para Caixas Assépticas | Profills',
    descricao:
      'Linha automática para esterilização, envase e selagem de bebidas em caixas assépticas de 100 a 1.000 ml, com até 6.000 unidades por hora.'
  },
  categoria: 'Embalagens cartonadas e especiais',
  paginaCatalogo: 'P.24',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha Caixas Assépticas integra esterilização, envase e selagem em uma solução automatizada para produtos como leite UHT, sucos, cafés e bebidas vegetais não carbonatadas. O conjunto é controlado por CLP com IHM touchscreen e foi concebido para operações que exigem produtividade, segurança do processo e maior vida útil do produto. A aplicação final deve ser validada conforme formulação, tratamento térmico e requisitos sanitários do projeto.',
  recursos: [
    'Linha totalmente automatizada',
    'Integração de esterilização, envase e selagem',
    'Datação por inkjet',
    'Projeto sujeito à validação sanitária e de processo'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos não carbonatados',
    categorias: ['liquidos'],
    produtos: [
      'Leite UHT',
      'Leite sem lactose',
      'Bebidas lácteas',
      'Achocolatados',
      'Sucos',
      'Néctares',
      'Água de coco',
      'Bebidas vegetais',
      'Café pronto',
      'Chá pronto',
      'Bebidas proteicas',
      'Preparados líquidos não carbonatados'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/uht.glb',
    cameraOrbit: '36deg 79deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 6.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Prensa extrusora, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '35 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '35 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '500 a 1.000 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '4.800 x 3.760 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Volume de envase',
      valor: '100 a 1.000 ml'
    },
    {
      rotulo: 'Estrutura compatível',
      valor: 'PEBD + papel-cartão + alumínio'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos não carbonatados compatíveis'
    }
  ],
  capacidadeMaxima: 6000,
  embalagensCompativeis: ['Cartonada'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 6.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Prensa extrusora, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '35 kW'
    }
  ]
};
