export const assuntos = {
  maquina: { nome: 'Máquina', descricao: 'Máquina nova ou versão nova' },
  embalagem: {
    nome: 'Embalagem',
    descricao: 'Formato que a Profills passa a envasar'
  },
  parceiro: { nome: 'Parceiro', descricao: 'Fornecedor ou parceria nova' },
  evento: { nome: 'Evento', descricao: 'Feira, visita ou encontro' },
  nota: { nome: 'Nota', descricao: 'Lançamento curto, catálogo, novidade' },
  aviso: { nome: 'Aviso', descricao: 'Recesso, mudança de horário' }
} as const;

export type Assunto = keyof typeof assuntos;

export type Bloco = { id: string } & (
  | { tipo: 'titulo'; texto: string }
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'imagem'; src: string | null; legenda: string }
  | { tipo: 'lista'; itens: string[] }
  | { tipo: 'citacao'; texto: string; autor: string }
  | { tipo: 'tabela'; linhas: string[][] }
  | { tipo: 'video'; url: string; legenda: string }
  | { tipo: 'link'; titulo: string; url: string }
  | { tipo: 'aviso'; titulo: string; texto: string }
  | { tipo: 'maquina'; slug: string }
  | { tipo: 'download'; titulo: string; arquivo: string }
);

export type TipoBloco = Bloco['tipo'];

export type BlocoDoTipo<T extends TipoBloco> = Extract<Bloco, { tipo: T }>;

export type Linha = {
  id: string;
  colunas: [Bloco] | [Bloco, Bloco];
  /** % da primeira coluna, de 25 a 75 */
  proporcao: number;
};

export type Post = {
  assunto: Assunto;
  titulo: string;
  resumo: string;
  capa: string | null;
  linhas: Linha[];
};

export type Lado = 'esquerda' | 'direita';
