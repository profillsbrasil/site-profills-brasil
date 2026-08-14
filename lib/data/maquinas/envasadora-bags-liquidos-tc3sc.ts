import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-bags-liquidos-tc3sc.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-bags-liquidos-tc3sc.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraBagsLiquidosTc3sc: MaquinaCatalogo = {
  slug: 'envasadora-bags-liquidos-tc3sc',
  legacyId: 24,
  nome: 'Linha TC3SC Bag',
  nomeCompleto: 'Linha TC3SC Bag - Envasadora para Bags de Líquidos',
  headline:
    'Envase preciso de líquidos em bags de maior capacidade, com excelente vedação e controle do processo.',
  seo: {
    titulo: 'Envasadora para Bags de Líquidos TC3SC | Profills',
    descricao:
      'Linha TC3SC Bag para envase de líquidos em embalagens de maior volume, com dosagem volumétrica e até 1.200 unidades por hora.'
  },
  categoria: 'Embalagens flexíveis',
  paginaCatalogo: 'P.43',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha TC3SC Bag atende o envase de líquidos em embalagens flexíveis de maior volume. A configuração pode utilizar dosagem temporizada, bomba positiva ou sistema volumétrico, adequando-se a diferentes viscosidades. O equipamento oferece controle por CLP e IHM touchscreen e foi desenvolvido para produzir bags resistentes e bem selados.',
  recursos: [
    'Datação por inkjet ou hot stamping',
    'Dosagem temporizada',
    'Bomba positiva',
    'Dosagem volumétrica',
    'Projeto conforme volume e viscosidade'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos e pastosos em bags',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Polpas de frutas',
      'Purês',
      'Molho de tomate',
      'Molhos industriais',
      'Bases alimentícias',
      'Sucos concentrados',
      'Óleos alimentícios',
      'Xaropes',
      'Sabão líquido',
      'Detergente',
      'Desinfetante',
      'Amaciante',
      'Lubrificantes',
      'Óleos industriais',
      'Fertilizantes líquidos',
      'Bioestimulantes',
      'Produtos químicos compatíveis'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/sache-saco.glb',
    cameraOrbit: '29deg 84deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.200 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
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
      valor: '5,19 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '4,85 kWh'
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
      valor: '2.300 x 3.500 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Largura do filme',
      valor: '600 mm'
    },
    {
      rotulo: 'Espessura do filme',
      valor: '50 a 100 µm'
    },
    {
      rotulo: 'Largura final da embalagem',
      valor: '270 mm'
    },
    {
      rotulo: 'Comprimento final da embalagem',
      valor: '100 a 500 mm'
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
  capacidadeMaxima: 1200,
  embalagensCompativeis: ['Bag'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.200 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Temporizado, bomba positiva ou volumétrico'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
    }
  ]
};
