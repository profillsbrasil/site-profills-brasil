import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-horizontal-linear-frascos.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-horizontal-linear-frascos.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraHorizontalLinearFrascos: MaquinaCatalogo = {
  slug: 'envasadora-horizontal-linear-frascos',
  legacyId: 12,
  nome: 'Linha de Frascos',
  nomeCompleto:
    'Linha de Frascos - Envasadora Horizontal Linear 4, 6 ou 8 Bicos',
  headline:
    'Envase linear de líquidos e viscosos em frascos de diferentes materiais e volumes.',
  seo: {
    titulo: 'Envasadora Horizontal Linear para Frascos',
    descricao:
      'Linha linear para envase de líquidos e viscosos em frascos de 0,1 a 5 litros, com 4, 6 ou 8 bicos e até 1.800 unidades por hora.'
  },
  categoria: 'Embalagens rígidas',
  paginaCatalogo: 'P.46',
  tipoPagina: 'padrao',
  descritivo:
    'A Envasadora Horizontal Linear atende frascos de 0,1 a 5 litros e pode operar com 4, 6 ou 8 bicos. A configuração de dosagem volumétrica ou temporizada é definida conforme o produto e a capacidade desejada. O sistema pode receber alimentação e fechamento automáticos ou manuais, permitindo adequação ao nível de automação da fábrica.',
  recursos: [
    'Configurações com 4, 6 ou 8 bicos',
    'Alimentação automática ou manual',
    'Fechamento automático ou manual',
    'Dosagem volumétrica ou temporizada',
    'Datação por inkjet'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos e pastosos em frascos',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Água',
      'Sucos',
      'Bebidas não carbonatadas',
      'Leite',
      'Iogurte líquido',
      'Óleos alimentícios',
      'Molhos',
      'Ketchup',
      'Maionese',
      'Sabão líquido',
      'Detergente',
      'Amaciante',
      'Desinfetante',
      'Água sanitária',
      'Shampoo',
      'Condicionador',
      'Cremes',
      'Loções',
      'Fertilizantes líquidos',
      'Lubrificantes',
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
      valor: 'Até 1.800 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Volumétrico ou temporizado'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '2,69 a 7,80 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '2,35 a 6,60 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '102 a 180 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '7.500 x 3.600 mm'
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
      valor: '0,1 a 5 L'
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
      valor: 'Líquidos e viscosos'
    }
  ],
  capacidadeMaxima: 1800,
  embalagensCompativeis: ['Frasco', 'Garrafa'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.800 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Volumétrico ou temporizado'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet'
    }
  ]
};
