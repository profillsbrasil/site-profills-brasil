import type { Armazem, ObjetoGuardado } from '@/lib/armazem/armazem';
import { escolherArmazem } from '@/lib/armazem/armazem';
import { consultar } from '@/lib/banco/conexao';
import type { Consulta, Linha, ValorSql } from '@/lib/banco/tipos';
import {
  postGuardadoSchema,
  resumoPublicadoSchema
} from '@/lib/schemas/post-blog';
import { logger } from '@/lib/utils/logger';
import { LIMITE_SLUG, gerarSlug, textoParaSlug } from '@/lib/utils/slug';

import { ErroBlog, motivosImagem } from './erro';
import { SLUGS_RESERVADOS, conferirVersao, transicao } from './regras';
import {
  type EntradaEditor,
  IMAGEM_LIMITE_BYTES,
  type Intencao,
  type Post,
  type PostGuardado,
  type PostPublicado,
  type ResumoAdmin,
  type ResumoPublicado
} from './tipos';
import { createHash } from 'node:crypto';
import path from 'node:path';
import 'server-only';
import { z } from 'zod';

export type RepositorioBlog = {
  /** Do atualizado mais recente para o mais antigo. */
  listar: () => Promise<ResumoAdmin[]>;
  ler: (slug: string) => Promise<PostGuardado | null>;
  /** Uma instrução SQL por gravação: salvar, publicar e despublicar nunca ficam pela metade. */
  gravar: (entrada: EntradaEditor, intencao: Intencao) => Promise<PostGuardado>;
  /** Devolve o caminho público da imagem, como `/blog/<slug>/foto-1a2b3c4d5e.webp`. O mesmo arquivo dá o mesmo caminho. */
  enviarImagem: (slug: string, arquivo: File) => Promise<string>;
  /** Recebe um caminho que já casou com PADRAO_CAMINHO_IMAGEM; null quando a imagem não existe. */
  lerImagem: (caminho: string) => Promise<ImagemGuardada | null>;
  /** Do publicado mais recente para o mais antigo. */
  listarPublicados: () => Promise<ResumoPublicado[]>;
  lerPublicado: (slug: string) => Promise<PostPublicado | null>;
};

export type ImagemGuardada = ObjetoGuardado & { tipo: string };

const COLUNAS =
  'slug, versao, estado, criado_em, atualizado_em, publicado_em, conteudo';

/** Até 5 tentativas quando outra gravação pega o mesmo slug entre a leitura e o insert. */
const TENTATIVAS_SLUG = 5;

const slugsLidos = z.array(z.object({ slug: z.string() }));

const iso = (valor: ValorSql) =>
  valor instanceof Date ? valor.toISOString() : valor;

/** A linha do banco passa pelo mesmo schema do editor antes de virar PostGuardado. */
function lerLinha(linha: Linha) {
  return postGuardadoSchema.safeParse({
    slug: linha.slug,
    versao: linha.versao,
    estado: linha.estado,
    criadoEm: iso(linha.criado_em),
    atualizadoEm: iso(linha.atualizado_em),
    publicadoEm: iso(linha.publicado_em),
    post: linha.conteudo
  });
}

function exigirLinha(linha: Linha) {
  const lida = lerLinha(linha);

  if (!lida.success) {
    throw new ErroBlog(
      `O post ${JSON.stringify(linha.slug)} está fora do formato.`
    );
  }

  return lida.data;
}

/** Só os campos do cartão: a listagem pública não traz o texto (`linhas`) dos posts. */
function lerResumo(linha: Linha) {
  return resumoPublicadoSchema.safeParse({
    slug: linha.slug,
    publicadoEm: iso(linha.publicado_em),
    atualizadoEm: iso(linha.atualizado_em),
    titulo: linha.titulo,
    resumo: linha.resumo,
    assunto: linha.assunto,
    capa: linha.capa
  });
}

/** Linha fora do formato some com um aviso, sem derrubar a lista nem a página pública. */
function lerLista<T>(
  linhas: Linha[],
  ler: (linha: Linha) => z.ZodSafeParseResult<T>
) {
  return linhas.flatMap((linha) => {
    const lida = ler(linha);

    if (lida.success) return [lida.data];

    logger.warn(
      `Post fora do formato ignorado: ${JSON.stringify(linha.slug)}`,
      lida.error
    );

    return [];
  });
}

/** O tipo vem dos bytes do arquivo, nunca do nome nem do MIME que o navegador mandou. */
const ascii = (bytes: Uint8Array, inicio: number, fim: number) =>
  String.fromCharCode(...bytes.subarray(inicio, fim));

const tiposImagem: {
  extensao: string;
  mime: string;
  confere: (b: Uint8Array) => boolean;
}[] = [
  {
    extensao: 'png',
    mime: 'image/png',
    confere: (b) => b[0] === 0x89 && ascii(b, 1, 4) === 'PNG'
  },
  {
    extensao: 'jpg',
    mime: 'image/jpeg',
    confere: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
  },
  {
    extensao: 'webp',
    mime: 'image/webp',
    confere: (b) => ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP'
  },
  {
    extensao: 'avif',
    mime: 'image/avif',
    confere: (b) =>
      ascii(b, 4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(b, 8, 12))
  }
];

const semExtensao = (nome: string) => nome.replace(/\.[^.]*$/, '');

/** O hash do conteúdo entra no nome: a URL nunca muda de bytes e o cache pode ser immutable. */
function nomearImagem(
  nomeEnviado: string,
  bytes: Uint8Array,
  extensao: string
) {
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 10);

  const base = textoParaSlug(semExtensao(nomeEnviado))
    .slice(0, LIMITE_SLUG)
    .replace(/-+$/, '');

  return `${base || 'imagem'}-${hash}.${extensao}`;
}

/** A chave no armazém é o caminho público sem a barra inicial. */
const chaveImagem = (caminho: string) => caminho.slice(1);

export function criarRepositorioBlog({
  consulta,
  armazem,
  agora = () => new Date()
}: {
  consulta: Consulta;
  armazem: Armazem;
  agora?: () => Date;
}): RepositorioBlog {
  async function ler(slug: string) {
    const { rows } = await consulta(
      `select ${COLUNAS} from blog_posts where slug = $1`,
      [slug]
    );

    return rows[0] ? exigirLinha(rows[0]) : null;
  }

  async function inserirNovo(
    post: Post,
    intencao: Intencao,
    quando: string,
    tentativa = 1
  ): Promise<PostGuardado> {
    if (tentativa > TENTATIVAS_SLUG) {
      throw new ErroBlog(
        'Não foi possível reservar um endereço para o post. Tente de novo.'
      );
    }

    const { rows: slugs } = await consulta('select slug from blog_posts');

    const ocupados = new Set([
      ...SLUGS_RESERVADOS,
      ...slugsLidos.parse(slugs).map((linha) => linha.slug)
    ]);

    const novo = transicao(
      null,
      post,
      intencao,
      quando,
      gerarSlug(post.titulo, ocupados)
    );

    const { rows } = await consulta(
      `insert into blog_posts (${COLUNAS}) values ($1, $2, $3, $4, $5, $6, $7::jsonb)
       on conflict (slug) do nothing returning ${COLUNAS}`,
      [
        novo.slug,
        novo.versao,
        novo.estado,
        novo.criadoEm,
        novo.atualizadoEm,
        novo.publicadoEm,
        JSON.stringify(novo.post)
      ]
    );

    return rows[0]
      ? exigirLinha(rows[0])
      : inserirNovo(post, intencao, quando, tentativa + 1);
  }

  return {
    ler,

    async listar() {
      const { rows } = await consulta(
        `select ${COLUNAS} from blog_posts order by atualizado_em desc`
      );

      return lerLista(rows, lerLinha).map(
        ({ slug, estado, atualizadoEm, post }) => ({
          slug,
          estado,
          atualizadoEm,
          titulo: post.titulo,
          assunto: post.assunto
        })
      );
    },

    async gravar(entrada, intencao) {
      const quando = agora().toISOString();

      if (entrada.slug === null) {
        return inserirNovo(entrada.post, intencao, quando);
      }

      const atual = await ler(entrada.slug);

      conferirVersao(atual, entrada.versao);

      const novo = transicao(atual, entrada.post, intencao, quando, atual.slug);

      const { rows } = await consulta(
        `update blog_posts
         set versao = $2, estado = $3, atualizado_em = $4, publicado_em = $5, conteudo = $6::jsonb
         where slug = $1 and versao = $7
         returning ${COLUNAS}`,
        [
          novo.slug,
          novo.versao,
          novo.estado,
          novo.atualizadoEm,
          novo.publicadoEm,
          JSON.stringify(novo.post),
          atual.versao
        ]
      );

      if (rows[0]) return exigirLinha(rows[0]);

      // Outra gravação entrou entre a leitura e o update.
      conferirVersao(await ler(atual.slug), atual.versao);

      throw new ErroBlog('O post mudou durante a gravação. Tente de novo.');
    },

    async enviarImagem(slug, arquivo) {
      if (!(await ler(slug))) {
        throw new ErroBlog('Salve o post antes de enviar imagem.');
      }

      if (arquivo.size > IMAGEM_LIMITE_BYTES) {
        throw new ErroBlog(motivosImagem.tamanho);
      }

      const bytes = new Uint8Array(await arquivo.arrayBuffer());
      const tipo = tiposImagem.find((t) => t.confere(bytes));

      if (!tipo) throw new ErroBlog(motivosImagem.tipo);

      const nomeEnviado = arquivo.name.split(/[/\\]/).at(-1) ?? '';

      const caminho = `/blog/${slug}/${nomearImagem(nomeEnviado, bytes, tipo.extensao)}`;

      await armazem.gravar(chaveImagem(caminho), bytes, tipo.mime);

      return caminho;
    },

    async lerImagem(caminho) {
      const tipo = tiposImagem.find((t) => caminho.endsWith(`.${t.extensao}`));

      if (!tipo) return null;

      const objeto = await armazem.ler(chaveImagem(caminho));

      return objeto && { ...objeto, tipo: tipo.mime };
    },

    async listarPublicados() {
      const { rows } = await consulta(
        `select slug, publicado_em, atualizado_em, conteudo->'titulo' as titulo, conteudo->'resumo' as resumo,
                conteudo->'assunto' as assunto, conteudo->'capa' as capa
         from blog_posts where estado = 'publicado' order by publicado_em desc`
      );

      return lerLista(rows, lerResumo);
    },

    async lerPublicado(slug) {
      const { rows } = await consulta(
        `select ${COLUNAS} from blog_posts where slug = $1 and estado = 'publicado'`,
        [slug]
      );

      const [guardado] = lerLista(rows, lerLinha);

      return guardado?.estado === 'publicado' ? guardado : null;
    }
  };
}

/** Imagens no bucket pelas AWS_*; no bun dev sem elas, em .dados/armazem. */
export const repositorioBlog = criarRepositorioBlog({
  consulta: consultar,
  armazem: escolherArmazem(
    process.env,
    path.join(process.cwd(), '.dados', 'armazem')
  )
});
