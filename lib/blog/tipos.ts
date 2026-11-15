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

export const ehAssunto = (valor: unknown): valor is Assunto =>
  typeof valor === 'string' && Object.hasOwn(assuntos, valor);

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

export const PROPORCAO_MINIMA = 25;
export const PROPORCAO_MAXIMA = 75;

export type Linha = {
  id: string;
  colunas: [Bloco] | [Bloco, Bloco];
  /** % da primeira coluna, de PROPORCAO_MINIMA a PROPORCAO_MAXIMA */
  proporcao: number;
};

/** `capa` e o `src` das imagens guardam o caminho público, como `/blog/<slug>/foto.webp`. */
export type Post = {
  assunto: Assunto;
  titulo: string;
  resumo: string;
  capa: string | null;
  linhas: Linha[];
};

export type Lado = 'esquerda' | 'direita';

export type EstadoPost = 'rascunho' | 'publicado';

/** O slug nasce do título na primeira gravação e nunca muda depois. */
export type PostGuardado = {
  slug: string;
  criadoEm: string;
  atualizadoEm: string;
  post: Post;
} & (
  | { estado: 'rascunho'; publicadoEm: null }
  | { estado: 'publicado'; publicadoEm: string }
);

export const IMAGEM_LIMITE_BYTES = 5 * 1024 * 1024;

export const IMAGEM_TIPOS_ACEITOS = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif'
] as const;
