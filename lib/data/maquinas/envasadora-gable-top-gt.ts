import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/envasadora-gable-top-gt.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/envasadora-gable-top-gt.webp';

import type { MaquinaCatalogo } from './types';

export const envasadoraGableTopGt: MaquinaCatalogo = {
  slug: 'envasadora-gable-top-gt',
  legacyId: 27,
  nome: 'Linha GT',
  nomeCompleto: 'Linha GT - Envasadora para Embalagens Cartonadas Gable Top',
  headline:
    'Envase, esterilização e selagem térmica de embalagens gable top com precisão, higiene e apresentação premium.',
  seo: {
    titulo: 'Envasadora Gable Top GT',
    descricao:
      'Linha GT para envase em embalagens cartonadas gable top de 250 a 2.000 ml, com produção de até 3.000 unidades por hora.'
  },
  categoria: 'Embalagens cartonadas e especiais',
  paginaCatalogo: 'P.23',
  tipoPagina: 'padrao',
  descritivo:
    'A Linha GT foi desenvolvida para o envase em embalagens cartonadas gable top. O equipamento utiliza dosagem volumétrica, esterilização por lâmpada germicida ultravioleta e sistema de solda por barra quente, ar quente e pressão. Compatível com volumes de 250 a 2.000 ml, atende operações que buscam diferenciação de embalagem, boa área de comunicação da marca e processo controlado por CLP e IHM touchscreen.',
  recursos: [
    'Modelo GT-3000 citado na linha completa do catálogo',
    'Datação por inkjet ou hot stamping',
    'Esterilização por lâmpada germicida UV',
    'Solda por barra quente, ar quente e pressão',
    'Esteira de saída de 1,5 m'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Líquidos, pós, grãos e sólidos em embalagem cartonada',
    categorias: ['liquidos', 'pos', 'graos', 'solidos'],
    produtos: [
      'Leite',
      'Bebidas lácteas',
      'Iogurte líquido',
      'Sucos',
      'Néctares',
      'Água de coco',
      'Bebidas vegetais',
      'Cafés prontos',
      'Chás prontos',
      'Óleos alimentícios',
      'Molhos líquidos',
      'Sabão líquido',
      'Detergente',
      'Amaciante',
      'Desinfetante',
      'Arroz',
      'Café',
      'Cereais',
      'Farinhas'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/gable-top.glb',
    cameraOrbit: '45deg 75deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 3.000 unidades/hora'
    },
    {
      rotulo: 'Variação de dosagem',
      valor: '0,1 a 1%'
    },
    {
      rotulo: 'Sistema de datação',
      valor: 'Inkjet ou hot stamping'
    },
    {
      rotulo: 'Sistema de injeção',
      valor: 'Temporizado'
    },
    {
      rotulo: 'Sistema de dosagem',
      valor: 'Volumétrico'
    },
    {
      rotulo: 'Sistema de esterilização',
      valor: 'Lâmpada germicida ultravioleta'
    },
    {
      rotulo: 'Tensão operativa',
      valor: '220 V / 60 Hz'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
    },
    {
      rotulo: 'Sistema de solda',
      valor: 'Barra quente, ar quente e pressão'
    },
    {
      rotulo: 'Área de operação',
      valor: '3.000 x 2.500 mm'
    },
    {
      rotulo: 'Esteira de saída',
      valor: '1,5 m'
    },
    {
      rotulo: 'Material de fabricação',
      valor: 'Aço inoxidável AISI 304, alumínio, policarbonato e aço carbono'
    }
  ],
  specsEmbalagem: [
    {
      rotulo: 'Volume de envase',
      valor: '250 a 2.000 ml'
    },
    {
      rotulo: 'Estrutura compatível',
      valor: 'PEBD + papel-cartão + PEBD'
    },
    {
      rotulo: 'Tipos de produto',
      valor: 'Líquidos, pós, grãos e sólidos'
    }
  ],
  capacidadeMaxima: 3000,
  embalagensCompativeis: ['Cartonada'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 3.000 unidades/hora'
    },
    {
      rotulo: 'Sistema de esterilização',
      valor: 'Lâmpada germicida ultravioleta'
    },
    {
      rotulo: 'Sistema de solda',
      valor: 'Barra quente, ar quente e pressão'
    }
  ]
};
