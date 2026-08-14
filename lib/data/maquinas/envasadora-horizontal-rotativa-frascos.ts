import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-horizontal-rotativa-frascos.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-horizontal-rotativa-frascos.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraHorizontalRotativaFrascos: MaquinaCatalogo = {
  slug: 'envasadora-horizontal-rotativa-frascos',
  legacyId: 14,
  nome: 'Linha de Frascos',
  nomeCompleto: 'Linha de Frascos - Envasadora Horizontal Rotativa',
  headline:
    'Envase rotativo de alta produtividade para frascos de diferentes formatos e volumes.',
  seo: {
    titulo: 'Envasadora Rotativa para Frascos | Profills',
    descricao:
      'Envasadora rotativa para líquidos em frascos de 0,5 a 5 litros, com 8, 12 ou 24 bicos e produção de até 5.000 unidades por hora.'
  },
  categoria: 'Embalagens rígidas',
  paginaCatalogo: 'P.48',
  tipoPagina: 'padrao',
  descritivo:
    'A Envasadora Horizontal Rotativa atende o envase de líquidos em frascos de 0,5 a 5 litros. Pode operar com 8, 12 ou 24 bicos e ser configurada com diferentes formas de alimentação e fechamento. A arquitetura rotativa é indicada para linhas que buscam produção contínua, precisão e integração com equipamentos anteriores e posteriores.',
  recursos: [
    'Configurações com 8, 12 ou 24 bicos',
    'Alimentação automática, por esteira ou manual',
    'Fechamento automático ou manual',
    'Datação por inkjet ou laser'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos e pastosos em frascos',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Sucos',
      'Bebidas',
      'Óleos alimentícios',
      'Vinagre',
      'Molho de tomate',
      'Ketchup',
      'Maionese',
      'Sabão líquido',
      'Detergente',
      'Amaciante',
      'Desinfetante',
      'Shampoo',
      'Condicionador',
      'Cremes',
      'Loções',
      'Lubrificantes',
      'Fertilizantes líquidos',
      'Produtos químicos compatíveis'
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
      valor: 'Até 5.000 unidades/hora'
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
      valor: '5,50 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '4,0 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '30 L/min'
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
      valor: 'Automática, por esteira ou manual'
    },
    {
      rotulo: 'Volume do frasco',
      valor: '0,5 a 5,0 L'
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
  capacidadeMaxima: 5000,
  embalagensCompativeis: ['Frasco', 'Garrafa'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 5.000 unidades/hora'
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
