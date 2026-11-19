import {
  type Assunto,
  type Bloco,
  type Post,
  type ResumoAdmin,
  type ResumoPublicado,
  type UsoImagem,
  assuntos,
  ehAssunto
} from './tipos';

const MESES = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez'
];

const partesData = new Intl.DateTimeFormat('en-CA', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo'
});

/** "10 nov 2026", no fuso de Brasília, igual no servidor e no navegador. */
export function dataCurta(iso: string) {
  const partes = Object.fromEntries(
    partesData.formatToParts(new Date(iso)).map((p) => [p.type, p.value])
  );

  return `${partes.day} ${MESES[Number(partes.month) - 1]} ${partes.year}`;
}

const FILTROS_POSTS = ['todos', 'publicados', 'rascunhos'] as const;

export type FiltroPosts = (typeof FILTROS_POSTS)[number];

type RegistroFiltro = {
  rotulo: string;
  titulo: string;
  href: string;
  inclui: (post: Pick<ResumoAdmin, 'estado'>) => boolean;
  vazio: { titulo: string; texto: string };
};

/** Os filtros da lista de posts do admin, na ordem da lateral. */
export const filtrosPosts: Record<FiltroPosts, RegistroFiltro> = {
  todos: {
    rotulo: 'Todos',
    titulo: 'Posts',
    href: '/admin/blog',
    inclui: () => true,
    vazio: {
      titulo: 'Nenhum post ainda',
      texto:
        'Clique em Novo post para escrever o primeiro. Ele fica guardado como rascunho até você publicar.'
    }
  },
  publicados: {
    rotulo: 'Publicados',
    titulo: 'Publicados',
    href: '/admin/blog?estado=publicados',
    inclui: (post) => post.estado === 'publicado',
    vazio: {
      titulo: 'Nenhum post publicado',
      texto: 'Abra um rascunho e clique em Publicar para ele aparecer no blog.'
    }
  },
  rascunhos: {
    rotulo: 'Rascunhos',
    titulo: 'Rascunhos',
    href: '/admin/blog?estado=rascunhos',
    inclui: (post) => post.estado === 'rascunho',
    vazio: {
      titulo: 'Nenhum rascunho',
      texto: 'Os posts que você salva sem publicar ficam aqui até a publicação.'
    }
  }
};

/** O valor de ?estado= da lista de posts; ausente ou desconhecido vira 'todos'. */
export function lerFiltroPosts(valor: string | string[] | undefined) {
  return FILTROS_POSTS.find((filtro) => filtro === valor) ?? 'todos';
}

export function totaisDosPosts(posts: readonly Pick<ResumoAdmin, 'estado'>[]) {
  return {
    posts: posts.length,
    publicados: posts.filter(filtrosPosts.publicados.inclui).length,
    rascunhos: posts.filter(filtrosPosts.rascunhos.inclui).length
  };
}

/** Cada assunto do registry, na ordem dele, com os posts que o usam; assunto sem post vem com a lista vazia. */
export function agruparPorAssunto(posts: ResumoAdmin[]) {
  return Object.keys(assuntos)
    .filter(ehAssunto)
    .map((assunto) => ({
      assunto,
      posts: posts.filter((p) => p.assunto === assunto)
    }));
}

/** O uso de cada caminho de imagem citado pelos posts; caminho fora do mapa está sem uso. */
export function usoDasImagens(posts: Post[]) {
  const usos = new Map<string, UsoImagem>();

  for (const post of posts) {
    for (const linha of post.linhas) {
      for (const bloco of linha.colunas) {
        if (bloco.tipo === 'imagem' && bloco.src && !usos.has(bloco.src)) {
          usos.set(bloco.src, 'texto');
        }
      }
    }
  }

  for (const post of posts) {
    if (post.capa) usos.set(post.capa, 'capa');
  }

  return usos;
}

const KIB = 1024;
const MIB = KIB * KIB;

const formatoMb = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

/** "412 KB" abaixo de 1 MB e "1,2 MB" daí para cima, em base 1.024. */
export function tamanhoDoArquivo(bytes: number) {
  if (bytes < MIB) return `${Math.max(1, Math.round(bytes / KIB))} KB`;

  return `${formatoMb.format(bytes / MIB)} MB`;
}

const PALAVRAS_POR_MINUTO = 200;

function textosDoBloco(bloco: Bloco) {
  switch (bloco.tipo) {
    case 'titulo':
    case 'paragrafo':
      return [bloco.texto];
    case 'imagem':
    case 'video':
      return [bloco.legenda];
    case 'lista':
      return bloco.itens;
    case 'citacao':
      return [bloco.texto, bloco.autor];
    case 'tabela':
      return bloco.linhas.flat();
    case 'link':
    case 'download':
      return [bloco.titulo];
    case 'aviso':
      return [bloco.titulo, bloco.texto];
    case 'maquina':
      return [];
  }
}

export function minutosDeLeitura(post: Post) {
  const palavras = [
    post.titulo,
    post.resumo,
    ...post.linhas.flatMap((l) => l.colunas.flatMap(textosDoBloco))
  ]
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(palavras / PALAVRAS_POR_MINUTO));
}

/** Slug da primeira máquina citada no post; o fim do post de máquina leva a ela. */
export function primeiraMaquina(post: Post) {
  for (const linha of post.linhas) {
    for (const bloco of linha.colunas) {
      if (bloco.tipo === 'maquina') return bloco.slug;
    }
  }

  return null;
}

const DIAS_AVISO_FIXADO = 30;
const DIA_MS = 24 * 60 * 60 * 1000;

export type Listagem = {
  fixado: ResumoPublicado | null;
  /** Assuntos com ao menos um post, na ordem do registry. */
  contagem: { assunto: Assunto; total: number }[];
  /** Com capa: cartão com imagem. */
  destaques: ResumoPublicado[];
  /** Sem capa: linha na coluna de notas. */
  notas: ResumoPublicado[];
};

/** `publicados` chega do mais novo para o mais antigo, como o repositório devolve. */
export function montarListagem(
  publicados: ResumoPublicado[],
  filtro: Assunto | null,
  agora: Date
) {
  const fixado =
    publicados.find(
      (p) =>
        p.assunto === 'aviso' &&
        agora.getTime() - new Date(p.publicadoEm).getTime() <
          DIAS_AVISO_FIXADO * DIA_MS
    ) ?? null;

  const contagem = Object.keys(assuntos)
    .filter(ehAssunto)
    .map((assunto) => ({
      assunto,
      total: publicados.filter((p) => p.assunto === assunto).length
    }))
    .filter((c) => c.total > 0);

  const filtrados = filtro
    ? publicados.filter((p) => p.assunto === filtro)
    : publicados;

  return {
    fixado,
    contagem,
    destaques: filtrados.filter((p) => p.capa !== null),
    notas: filtrados.filter((p) => p.capa === null)
  };
}

/** Outros posts para o fim da leitura: os mais novos, menos o atual. */
export function outrosPosts(
  publicados: ResumoPublicado[],
  slug: string,
  quantos = 3
) {
  return publicados.filter((p) => p.slug !== slug).slice(0, quantos);
}

const HOSTS_YOUTUBE = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtube-nocookie.com'
]);

const ID_YOUTUBE = /^[\w-]{11}$/;

/** Id do vídeo num endereço do YouTube (watch, youtu.be, shorts, embed); null fora dele. */
export function idYoutube(endereco: string) {
  let url: URL;

  try {
    url = new URL(endereco);
  } catch {
    return null;
  }

  if (!HOSTS_YOUTUBE.has(url.hostname)) return null;

  const caminho = url.pathname.split('/').filter(Boolean);

  const id =
    url.hostname === 'youtu.be'
      ? caminho[0]
      : caminho[0] === 'watch'
        ? url.searchParams.get('v')
        : ['shorts', 'embed', 'live'].includes(caminho[0] ?? '')
          ? caminho[1]
          : null;

  return id && ID_YOUTUBE.test(id) ? id : null;
}
