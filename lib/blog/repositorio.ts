import type { Armazem } from '@/lib/armazem/armazem';
import { criarArmazemDisco } from '@/lib/armazem/armazem';
import { consultar } from '@/lib/banco/conexao';
import type { Consulta, Linha, ValorSql } from '@/lib/banco/tipos';
import { postGuardadoSchema } from '@/lib/schemas/post-blog';
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
import path from 'node:path';
import 'server-only';
import { z } from 'zod';

export type RepositorioBlog = {
  /** Do atualizado mais recente para o mais antigo. */
  listar: () => Promise<ResumoAdmin[]>;
  ler: (slug: string) => Promise<PostGuardado | null>;
  /** Uma instrução SQL por gravação: salvar, publicar e despublicar nunca ficam pela metade. */
  gravar: (entrada: EntradaEditor, intencao: Intencao) => Promise<PostGuardado>;
  /** Devolve o caminho público da imagem, como `/blog/<slug>/foto.webp`. */
  enviarImagem: (slug: string, arquivo: File) => Promise<string>;
  /** Do publicado mais recente para o mais antigo. */
  listarPublicados: () => Promise<ResumoPublicado[]>;
  lerPublicado: (slug: string) => Promise<PostPublicado | null>;
};

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

/** Linha fora do formato some da lista com um aviso, sem derrubar as outras. */
function lerLista(linhas: Linha[]) {
  return linhas.flatMap((linha) => {
    const lida = lerLinha(linha);

    if (lida.success) return [lida.data];

    logger.warn(
      `Post ignorado na lista: ${JSON.stringify(linha.slug)}`,
      lida.error
    );

    return [];
  });
}

/** O tipo vem dos bytes do arquivo, nunca do nome nem do MIME que o navegador mandou. */
const ascii = (bytes: Uint8Array, inicio: number, fim: number) =>
  String.fromCharCode(...bytes.subarray(inicio, fim));

const tiposImagem: { extensao: string; confere: (b: Uint8Array) => boolean }[] =
  [
    {
      extensao: 'png',
      confere: (b) => b[0] === 0x89 && ascii(b, 1, 4) === 'PNG'
    },
    {
      extensao: 'jpg',
      confere: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
    },
    {
      extensao: 'webp',
      confere: (b) => ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP'
    },
    {
      extensao: 'avif',
      confere: (b) =>
        ascii(b, 4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(b, 8, 12))
    }
  ];

const semExtensao = (nome: string) => nome.replace(/\.[^.]*$/, '');

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

  /** foto.png, depois foto-2.png: nunca sobrescreve outra imagem do post. */
  async function nomeLivre(
    slug: string,
    base: string,
    extensao: string,
    ocupados = new Set<string>()
  ): Promise<string> {
    const nome = `${gerarSlug(base, ocupados)}.${extensao}`;

    if (!(await armazem.ler(`blog/${slug}/${nome}`))) return nome;

    return nomeLivre(slug, base, extensao, ocupados.add(semExtensao(nome)));
  }

  return {
    ler,

    async listar() {
      const { rows } = await consulta(
        `select ${COLUNAS} from blog_posts order by atualizado_em desc`
      );

      return lerLista(rows).map(({ slug, estado, atualizadoEm, post }) => ({
        slug,
        estado,
        atualizadoEm,
        titulo: post.titulo,
        assunto: post.assunto
      }));
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

      const nomeEnviado = semExtensao(arquivo.name.split(/[/\\]/).at(-1) ?? '');

      const base = textoParaSlug(nomeEnviado).slice(0, LIMITE_SLUG) || 'imagem';

      const nome = await nomeLivre(slug, base, tipo.extensao);

      await armazem.gravar(`blog/${slug}/${nome}`, bytes);

      return `/blog/${slug}/${nome}`;
    },

    async listarPublicados() {
      const { rows } = await consulta(
        `select ${COLUNAS} from blog_posts where estado = 'publicado' order by publicado_em desc`
      );

      return lerLista(rows).flatMap((guardado) =>
        guardado.estado === 'publicado'
          ? [
              {
                slug: guardado.slug,
                publicadoEm: guardado.publicadoEm,
                titulo: guardado.post.titulo,
                resumo: guardado.post.resumo,
                assunto: guardado.post.assunto,
                capa: guardado.post.capa
              }
            ]
          : []
      );
    },

    async lerPublicado(slug) {
      const guardado = await ler(slug);

      return guardado?.estado === 'publicado' ? guardado : null;
    }
  };
}

/** Imagens ainda em public/, servidas pelo próprio Next, até o bucket entrar. */
export const repositorioBlog = criarRepositorioBlog({
  consulta: consultar,
  armazem: criarArmazemDisco(path.join(process.cwd(), 'public'))
});
