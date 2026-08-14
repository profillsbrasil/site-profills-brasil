import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-rotativa-potes-copos.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-rotativa-potes-copos.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraRotativaPotesCopos: MaquinaCatalogo = {
  slug: 'envasadora-rotativa-potes-copos',
  legacyId: 32,
  nome: 'Linha Potes',
  nomeCompleto: 'Linha Potes - Envasadora Rotativa para Potes e Copos',
  headline:
    'Envase e fechamento automático de potes e copos para produtos líquidos ou secos.',
  seo: {
    titulo: 'Envasadora Rotativa para Potes e Copos | Profills',
    descricao:
      'Máquina rotativa para envase e fechamento automático de potes, copos e embalagens tubulares, com produção de até 1.000 unidades por hora.'
  },
  categoria: 'Embalagens cartonadas e especiais',
  paginaCatalogo: 'P.25',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha Potes automatiza o envase de produtos líquidos e secos em potes, copos ou embalagens tubulares. A configuração rotativa favorece a organização das etapas de alimentação, dosagem e fechamento, com comando por CLP e IHM touchscreen. É indicada para laticínios, sobremesas, alimentos pastosos, cosméticos e outras aplicações que utilizem recipientes compatíveis.',
  recursos: [
    'Fechamento automático',
    'Datação por inkjet',
    'Dosagem temporizada',
    'Adequação conforme pote, tampa ou selo'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, pastosos, pós e granulados',
    categorias: ['liquidos', 'pastosos', 'pos', 'graos'],
    produtos: [
      'Iogurtes',
      'Sobremesas lácteas',
      'Requeijão',
      'Cream cheese',
      'Manteiga',
      'Margarina',
      'Doce de leite',
      'Geleias',
      'Patês',
      'Molhos',
      'Açaí',
      'Sorvetes',
      'Cremes cosméticos',
      'Máscaras capilares',
      'Whey protein',
      'Leite em pó',
      'Café solúvel',
      'Temperos',
      'Granulados',
      'Castanhas'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/pote02.glb',
    cameraOrbit: '270deg 40deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.000 unidades/hora'
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
      valor: '1,30 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '1,15 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '114 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '3.100 x 2.500 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Diâmetro',
      valor: '40 a 80 mm'
    },
    {
      rotulo: 'Altura',
      valor: '60 a 150 mm'
    },
    {
      rotulo: 'Sistema de fechamento',
      valor: 'Automático'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'Plástico e estruturas cartonadas'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos e secos'
    }
  ],
  capacidadeMaxima: 1000,
  embalagensCompativeis: ['Pote'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.000 unidades/hora'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '1,30 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '1,15 kWh'
    }
  ]
};
