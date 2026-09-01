import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-horizontal-tribloc-frascos.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-horizontal-tribloc-frascos.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraHorizontalTriblocFrascos: MaquinaCatalogo = {
  slug: 'envasadora-horizontal-tribloc-frascos',
  legacyId: 13,
  nome: 'Linha de Frascos',
  nomeCompleto: 'Linha de Frascos - Envasadora Horizontal Tribloc',
  headline:
    'Alta produtividade em uma solução Tribloc para envase e fechamento automático de frascos.',
  seo: {
    titulo: 'Envasadora Tribloc para Frascos',
    descricao:
      'Envasadora automática Tribloc para líquidos, com 8, 12 ou 24 bicos e produção de até 5.000 frascos por hora.'
  },
  categoria: 'Embalagens rígidas',
  paginaCatalogo: 'P.47',
  tipoPagina: 'padrao',
  descritivo:
    'A Envasadora Horizontal Tribloc foi desenvolvida para operações de alta produtividade com líquidos. Pode trabalhar com 8, 12 ou 24 bicos e oferece flexibilidade para diferentes formatos de frascos. O fechamento automático e o controle por CLP e IHM touchscreen integram as etapas principais em uma linha compacta e sincronizada.',
  recursos: [
    'Configurações com 8, 12 ou 24 bicos',
    'Alimentação automática ou manual',
    'Fechamento automático',
    'Datação por inkjet ou laser'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos de baixa e média viscosidade em frascos',
    categorias: ['liquidos'],
    produtos: [
      'Água mineral',
      'Sucos',
      'Chás prontos',
      'Bebidas não carbonatadas',
      'Leite',
      'Óleos alimentícios',
      'Vinagre',
      'Molhos líquidos',
      'Sabão líquido',
      'Detergente',
      'Desinfetante',
      'Água sanitária',
      'Shampoo',
      'Condicionador',
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
      valor: '3,10 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '2,65 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '400 L/min'
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
      rotulo: 'Alimentação',
      valor: 'Automática ou manual'
    },
    {
      rotulo: 'Volume do frasco',
      valor: 'Acima de 50 ml'
    },
    {
      rotulo: 'Sistema de fechamento',
      valor: 'Automático'
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
