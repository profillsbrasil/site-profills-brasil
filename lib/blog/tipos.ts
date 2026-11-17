/**
 * `chamada` fecha o cartão do post na listagem. `fim` escolhe o que vem
 * depois do texto: a máquina e o especialista, os contatos ou só outros posts.
 */
export const assuntos = {
  maquina: {
    nome: 'Máquina',
    plural: 'Máquinas',
    descricao: 'Máquina nova ou versão nova',
    chamada: 'Ver a máquina',
    fim: 'maquina'
  },
  embalagem: {
    nome: 'Embalagem',
    plural: 'Embalagens',
    descricao: 'Formato que a Profills passa a envasar',
    chamada: 'Ver a embalagem',
    fim: 'leitura'
  },
  parceiro: {
    nome: 'Parceiro',
    plural: 'Parceiros',
    descricao: 'Fornecedor ou parceria nova',
    chamada: 'Conhecer o parceiro',
    fim: 'leitura'
  },
  evento: {
    nome: 'Evento',
    plural: 'Eventos',
    descricao: 'Feira, visita ou encontro',
    chamada: 'Ler a cobertura',
    fim: 'leitura'
  },
  nota: {
    nome: 'Nota',
    plural: 'Notas',
    descricao: 'Lançamento curto, catálogo, novidade',
    chamada: 'Ler a nota',
    fim: 'leitura'
  },
  aviso: {
    nome: 'Aviso',
    plural: 'Avisos',
    descricao: 'Recesso, mudança de horário',
    chamada: 'Ler o aviso',
    fim: 'contato'
  }
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

export type Intencao = 'salvar' | 'publicar' | 'despublicar';

/** O slug nasce do título na primeira gravação e nunca muda depois. */
export type PostGuardado = {
  slug: string;
  /** Sobe 1 a cada gravação; o editor devolve a que leu, e outra aba que gravou antes ganha. */
  versao: number;
  criadoEm: string;
  atualizadoEm: string;
  post: Post;
} & (
  | { estado: 'rascunho'; publicadoEm: null }
  | { estado: 'publicado'; publicadoEm: string }
);

export type PostPublicado = Extract<PostGuardado, { estado: 'publicado' }>;

/** O que o editor manda ao gravar: post novo sem slug e sem versão, post gravado com os dois. */
export type EntradaEditor = { post: Post } & (
  | { slug: null; versao: null }
  | { slug: string; versao: number }
);

/** O que a tela manda para apagar: o slug e a versão que ela leu. */
export type PedidoApagar = { slug: string; versao: number };

/**
 * As imagens da pasta do post depois de apagar; a que outro post usa fica e não conta.
 * null quando o armazém não listou a pasta: o post saiu, e as imagens aparecem como sem uso.
 */
export type ImagensApagadas = { apagadas: number; falharam: number } | null;

export type ResumoAdmin = Pick<
  PostGuardado,
  'slug' | 'estado' | 'atualizadoEm'
> &
  Pick<Post, 'titulo' | 'assunto'>;

/** Capa vence texto: a imagem que é capa de um post e aparece no texto de outro conta como capa. */
export type UsoImagem = 'capa' | 'texto' | 'semUso';

/** Uma imagem do armazém, cruzada com os posts que apontam para ela. Não existe tabela de imagens (ADR 0005). */
export type ImagemDoArmazem = {
  /** O caminho público, como `/blog/<slug>/foto-1a2b3c4d5e.webp`. */
  caminho: string;
  arquivo: string;
  tamanho: number;
  enviadaEm: string;
  /** O slug da pasta da imagem; o título é null quando nenhum post tem esse slug. */
  slug: string;
  tituloDoPost: string | null;
  uso: UsoImagem;
};

export type AssuntoComPosts = { assunto: Assunto; posts: ResumoAdmin[] };

export type ResumoPublicado = Pick<
  PostPublicado,
  'slug' | 'publicadoEm' | 'atualizadoEm'
> &
  Pick<Post, 'titulo' | 'resumo' | 'assunto' | 'capa'>;

export const IMAGEM_LIMITE_BYTES = 5 * 1024 * 1024;

export const IMAGEM_TIPOS_ACEITOS = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif'
] as const;
