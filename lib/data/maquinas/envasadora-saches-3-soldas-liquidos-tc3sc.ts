import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-saches-3-soldas-liquidos-tc3sc.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-saches-3-soldas-liquidos-tc3sc.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSaches3SoldasLiquidosTc3sc: MaquinaCatalogo = {
  slug: 'envasadora-saches-3-soldas-liquidos-tc3sc',
  legacyId: 8,
  nome: 'Linha TC3SC',
  nomeCompleto: 'Linha TC3SC - Envasadora de Sachês 3 Soldas para Líquidos',
  headline:
    'Dosagem precisa de líquidos em sachês três soldas, com flexibilidade de materiais e formatos.',
  seo: {
    titulo: 'Envasadora de Sachês para Líquidos TC3SC | Profills',
    descricao:
      'Envasadora TC3SC para líquidos em sachês três soldas, com dosagem temporizada, positiva ou volumétrica e até 1.800 unidades por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.37',
  tipoPagina: 'padrao',
  descritivo:
    'A TC3SC para líquidos foi projetada para produzir sachês com três soldas em diferentes materiais flexíveis. Conforme a viscosidade e o volume, pode utilizar dosagem temporizada, bomba positiva ou sistema volumétrico. Os recursos de abertura e formato especial ajudam a adaptar a apresentação da embalagem ao uso final.',
  recursos: [
    'Abre-fácil simples',
    'Abre-fácil triangular',
    'Abre-fácil serrilhado',
    'Formato especial customizado',
    'Datação em alto-relevo, inkjet ou hot stamping'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos e pastosos',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Ketchup',
      'Maionese',
      'Mostarda',
      'Molho de pimenta',
      'Molhos para delivery',
      'Mel',
      'Xaropes',
      'Géis energéticos',
      'Leite condensado',
      'Doce de leite',
      'Shampoo',
      'Condicionador',
      'Sabonete líquido',
      'Cremes',
      'Loções',
      'Sabão líquido',
      'Detergente',
      'Fertilizantes líquidos',
      'Amostras promocionais'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/3-soldas-duplo.glb',
    cameraOrbit: '38deg 72deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.800 unidades/hora'
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
      valor: '2,14 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '2,00 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '245 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '2.300 x 2.600 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '100 a 350 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '50 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '40 a 150 mm'
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
      valor: 'Líquidos'
    }
  ],
  capacidadeMaxima: 1800,
  embalagensCompativeis: ['Sachê'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.800 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Alto-relevo, inkjet ou hot stamping'
    }
  ]
};
