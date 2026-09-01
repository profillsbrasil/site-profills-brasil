import imgEmbalagem from '@/lib/images/catalogo2026/embalagens/maquina-lavagem-galoes.webp';
import imgMaquina from '@/lib/images/catalogo2026/maquinas/maquina-lavagem-galoes.webp';

import type { MaquinaCatalogo } from './types';

export const maquinaLavagemGaloes: MaquinaCatalogo = {
  slug: 'maquina-lavagem-galoes',
  legacyId: 29,
  nome: 'Linha Galões',
  nomeCompleto: 'Linha Galões - Máquina de Lavagem de Galões',
  headline:
    'Higienização automatizada de galões reutilizáveis em etapas de lavagem e aplicação de solução de limpeza.',
  seo: {
    titulo: 'Máquina de Lavagem de Galões',
    descricao:
      'Lavadora automática para galões reutilizáveis de 10 e 20 litros, com cinco bicos de lavagem e capacidade de até 1.600 unidades por hora.'
  },
  categoria: 'Embalagens rígidas e higienização',
  paginaCatalogo: 'P.53',
  tipoPagina: 'padrao',
  descritivo:
    'A Máquina de Lavagem de Galões foi projetada para a higienização de recipientes reutilizáveis de 10 e 20 litros. O processo contempla alimentação por esteira, cinco bicos de lavagem e cinco bicos para solução de limpeza. O sistema é comandado por CLP e IHM touchscreen e pode ser integrado à linha de reenvase.',
  recursos: [
    'Alimentação manual com esteira de 3.760 mm',
    'Cinco bicos de lavagem',
    'Cinco bicos para solução de lavagem',
    'Esteira de saída de 2.560 mm',
    'Integração com linha de envase, sob projeto'
  ],
  aplicacoes: {
    categoriaPrincipal: 'Higienização de galões reutilizáveis',
    categorias: [],
    produtos: [
      'Galões de água mineral de 10 litros',
      'Galões de água mineral de 20 litros',
      'Garrafões retornáveis',
      'Recipientes reutilizáveis tecnicamente compatíveis'
    ]
  },
  imagens: { maquina: imgMaquina, embalagem: imgEmbalagem },
  embalagem3d: {
    glb: '/embalagens-3d/galao.glb',
    cameraOrbit: '33deg 83deg 100%'
  },
  specsMaquina: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.600 unidades/hora'
    },
    {
      rotulo: 'Alimentação do galão',
      valor: 'Manual, com esteira de 3.760 mm'
    },
    {
      rotulo: 'Bicos de lavagem',
      valor: '5'
    },
    {
      rotulo: 'Bicos para solução de lavagem',
      valor: '5'
    },
    {
      rotulo: 'Esteira de saída',
      valor: '2.560 mm'
    },
    {
      rotulo: 'Comando',
      valor: 'CLP com IHM touchscreen'
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
      rotulo: 'Embalagens compatíveis',
      valor: 'Galões reutilizáveis'
    },
    {
      rotulo: 'Volumes',
      valor: '10 e 20 L'
    }
  ],
  capacidadeMaxima: 1600,
  embalagensCompativeis: ['Galão'],
  destaqueHero: [
    {
      rotulo: 'Capacidade de produção',
      valor: 'Até 1.600 unidades/hora'
    },
    {
      rotulo: 'Bicos de lavagem',
      valor: '5'
    },
    {
      rotulo: 'Bicos para solução de lavagem',
      valor: '5'
    }
  ]
};
