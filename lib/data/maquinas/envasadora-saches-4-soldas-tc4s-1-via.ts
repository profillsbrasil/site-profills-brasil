import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-saches-4-soldas-tc4s-1-via.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-saches-4-soldas-tc4s-1-via.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSaches4SoldasTc4s1Via: MaquinaCatalogo = {
  slug: 'envasadora-saches-4-soldas-tc4s-1-via',
  legacyId: 2,
  nome: 'Linha TC4S 1 Via',
  nomeCompleto: 'Linha TC4S 1 Via - Envasadora de Sachês 4 Soldas',
  headline:
    'Sachês quatro soldas com precisão, acabamento profissional e opções de abertura e formato especial.',
  seo: {
    titulo: 'Envasadora de Sachês 4 Soldas TC4S 1 Via | Profills',
    descricao:
      'Envasadora TC4S de uma via para sachês quatro soldas, líquidos e secos, com produção de até 2.000 unidades por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.30',
  tipoPagina: 'padrao',
  descritivo:
    'A TC4S 1 Via produz sachês retangulares com quatro soldas laterais, atendendo produtos líquidos e secos. A linha combina controle por CLP, diferentes sistemas de dosagem e opções de datação. Recursos como abre-fácil, Eurolock e formatos customizados ampliam as possibilidades de apresentação e conveniência da embalagem.',
  recursos: [
    'Abre-fácil simples',
    'Abre-fácil triangular',
    'Abre-fácil serrilhado',
    'Eurolock',
    'Formato especial customizado',
    'Datação em alto-relevo, inkjet ou hot stamping'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, pastosos, pós, grãos e granulados',
    categorias: ['liquidos', 'pastosos', 'pos', 'graos'],
    produtos: [
      'Whey protein',
      'Colágeno',
      'Creatina',
      'Vitaminas em pó',
      'Bebidas em pó',
      'Café solúvel',
      'Açúcar',
      'Adoçantes',
      'Temperos',
      'Sal',
      'Molhos',
      'Mel',
      'Géis',
      'Cremes cosméticos',
      'Shampoo',
      'Sementes',
      'Pequenos grãos',
      'Amostras promocionais',
      'Produtos veterinários',
      'Fertilizantes'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/sache-4-soldas.glb',
    cameraOrbit: '32deg 86deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 2.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Alto-relevo, inkjet ou hot stamping'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '2,37 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '2,05 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '360 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '2.250 x 2.400 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '120 a 360 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '40 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '60 a 180 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '70 a 180 mm'
    },
    {
      rotulo: 'Materiais compatíveis',
      valor: 'PET + PE; PET + PE + alumínio; BOPP; BOPA; EVOH'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos e produtos secos'
    }
  ],
  capacidadeMaxima: 2000,
  embalagensCompativeis: ['Sachê'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 2.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Alto-relevo, inkjet ou hot stamping'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    }
  ]
};
