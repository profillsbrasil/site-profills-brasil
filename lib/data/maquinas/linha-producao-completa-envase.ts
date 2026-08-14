import type { MaquinaCatalogo } from './types';

export const linhaProducaoCompletaEnvase: MaquinaCatalogo = {
  slug: 'linha-producao-completa-envase',
  nome: 'Linha de Produção Ponta a Ponta',
  nomeCompleto: 'Linha de Produção Ponta a Ponta',
  headline:
    'Integração industrial do preparo do produto ao final de linha, com equipamentos sincronizados em um único projeto.',
  seo: {
    titulo: 'Linha de Produção Completa para Envase | Profills',
    descricao:
      'Projetos integrados de envase, transporte, acumulação, encaixotamento e acessórios, desenvolvidos conforme layout e meta de produção.'
  },
  categoria: 'Linhas completas e automação',
  paginaCatalogo: 'P.32-33',
  tipoPagina: 'engenharia',
  descritivo:
    'A Profills desenvolve linhas de produção completas para operações que exigem sincronismo entre preparo, dosagem, envase, transporte, acumulação e final de linha. O projeto considera layout, fluxo produtivo, embalagem, capacidade desejada, automação e requisitos operacionais. A solução pode integrar reatores, tanques, bombas, elevadores, envasadoras, esteiras, mesas acumuladoras, encaixotadoras e plataformas.',
  recursos: [
    'Reator',
    'Tanque encamisado',
    'Bomba de transferência',
    'Bomba dosadora',
    'Elevador de rosca',
    'Envasadora GT ou TC',
    'Esteiras de elevação e saída',
    'Mesa acumuladora',
    'Encaixotadeira',
    'Plataforma NR17'
  ],
  aplicacoes: {
    categoriaPrincipal:
      'Linhas completas para diferentes produtos e embalagens',
    categorias: [],
    produtos: [
      'Alimentos',
      'Bebidas',
      'Laticínios',
      'Molhos',
      'Saneantes',
      'Cosméticos',
      'Produtos farmacêuticos compatíveis',
      'Produtos veterinários',
      'Fertilizantes',
      'Bioestimulantes',
      'Lubrificantes',
      'Produtos químicos compatíveis',
      'Grãos',
      'Pós',
      'Rações',
      'Projetos de envase e embalagem sob medida'
    ]
  },
  specsMaquina: [],
  specsEmbalagem: [],
  embalagensCompativeis: [],
  conteudoEngenharia: {
    escopo: '',
    blocos: [
      {
        rotulo: 'Embalagens',
        valor: 'Definidas conforme a envasadora integrada'
      },
      {
        rotulo: 'Produto',
        valor: 'Definido conforme processo e dosador'
      },
      {
        rotulo: 'Layout',
        valor: 'Desenvolvido sob projeto'
      },
      {
        rotulo: 'Capacidade de produção',
        valor: 'Definida conforme o conjunto integrado'
      },
      {
        rotulo: 'Comando',
        valor: 'Integração por CLP e interfaces dos equipamentos'
      },
      {
        rotulo: 'Área de operação',
        valor: 'Definida no estudo de layout'
      },
      {
        rotulo: 'Energia, ar e utilidades',
        valor: 'Dimensionados no projeto executivo'
      },
      {
        rotulo: 'Observação',
        valor:
          'Não há ficha técnica única no catálogo; cadastrar como solução de engenharia, não como máquina padronizada'
      }
    ]
  }
};
