import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-semiautomatica-baldes.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-semiautomatica-baldes.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraSemiautomaticaBaldes: MaquinaCatalogo = {
  slug: 'envasadora-semiautomatica-baldes',
  legacyId: 19,
  nome: 'Linha Baldes',
  nomeCompleto:
    'Linha Baldes - Envasadora Semiautomática para Líquidos e Pastosos',
  headline:
    'Envase semiautomático de líquidos e pastosos em recipientes de diferentes volumes, com operação simples e controlada.',
  seo: {
    titulo: 'Envasadora Semiautomática para Baldes',
    descricao:
      'Envasadora semiautomática para líquidos e pastosos em frascos, baldes, latas e bombonas, com produção de até 800 unidades por hora.'
  },
  categoria: 'Embalagens rígidas',
  paginaCatalogo: 'P.52',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha Baldes utiliza bomba de engrenagem para o envase semiautomático de produtos líquidos ou pastosos. Compatível com frascos, baldes, latas e bombonas, é indicada para operações que precisam de flexibilidade entre recipientes e controle operacional simplificado. A estrutura industrial e o comando por CLP e IHM touchscreen favorecem repetibilidade e facilidade de ajuste.',
  recursos: [
    'Uso com frascos, baldes, latas e bombonas',
    'Dosagem por bomba de engrenagem',
    'Datação: não especificada no catálogo',
    'Configuração conforme viscosidade e recipiente'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, cremes e produtos pastosos em baldes',
    categorias: ['liquidos', 'pastosos'],
    produtos: [
      'Molhos',
      'Maionese',
      'Margarina',
      'Geleias',
      'Doce de leite',
      'Pastas alimentícias',
      'Tintas',
      'Revestimentos',
      'Selantes',
      'Adesivos',
      'Graxas',
      'Lubrificantes',
      'Sabão líquido',
      'Detergente',
      'Desengraxantes',
      'Cremes cosméticos',
      'Máscaras capilares',
      'Produtos químicos compatíveis'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/lata-tinta.glb',
    cameraOrbit: '190deg 66deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 800 unidades/hora'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Não especificado no catálogo'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Bomba de engrenagem'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '0,3 kW'
    },
    {
      rotulo: 'Consumo de energia',
      valor: '0,21 kWh'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Consumo de ar',
      valor: '90 L/min'
    },
    {
      rotulo: 'Área de operação',
      valor: '4.690 x 3.760 mm'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Recipientes compatíveis',
      valor: 'Frascos, baldes, latas e bombonas'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos e pastosos compatíveis'
    }
  ],
  capacidadeMaxima: 800,
  embalagensCompativeis: ['Balde'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 800 unidades/hora'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Bomba de engrenagem'
    },
    {
      rotulo: 'Potência ativa instalada',
      valor: '0,3 kW'
    }
  ]
};
