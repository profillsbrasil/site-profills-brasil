import type { Armazem, ObjetoGuardado } from '@/lib/armazem/armazem';
import { escolherArmazem } from '@/lib/armazem/armazem';
import { consultar } from '@/lib/banco/conexao';
import type { Consulta, Linha, ValorSql } from '@/lib/banco/tipos';
import {
  PADRAO_CAMINHO_IMAGEM,
  postGuardadoSchema,
  resumoPublicadoSchema
} from '@/lib/schemas/post-blog';
import { logger } from '@/lib/utils/logger';
import { LIMITE_SLUG, gerarSlug, textoParaSlug } from '@/lib/utils/slug';

import { usoDasImagens } from './apresentacao';
import { ErroBlog, motivosImagem } from './erro';
import {
  SLUGS_RESERVADOS,
  conferirApagamento,
  conferirVersao,
  transicao
} from './regras';
import {
  type EntradaEditor,
  IMAGEM_LIMITE_BYTES,
  type ImagemDoArmazem,
  type ImagensApagadas,
  type Intencao,
  type PedidoApagar,
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
  /**
   * Apaga o rascunho e depois as imagens da pasta dele que nenhum outro post usa. Falha no armazém
   * não desfaz o post apagado: volta na contagem. Repetir termina as imagens que ficaram.
   */
  apagarRascunho: (pedido: PedidoApagar) => Promise<ImagensApagadas>;
  /** Devolve o caminho público da imagem, como `/blog/<slug>/foto-1a2b3c4d5e.webp`. O mesmo arquivo dá o mesmo caminho. */
  enviarImagem: (slug: string, arquivo: File) => Promise<string>;
  /** Recebe um caminho que já casou com PADRAO_CAMINHO_IMAGEM; null quando a imagem não existe. */
  lerImagem: (caminho: string) => Promise<ImagemGuardada | null>;
  /** Toda imagem do armazém, da enviada mais recente para a mais antiga, com o uso que os posts fazem dela. */
  listarImagens: () => Promise<ImagemDoArmazem[]>;
  /** O total da lateral, guardado por VALIDADE_CONTAGEM_MS; null quando o armazém não respondeu, para a falha não derrubar a página. */
  contarImagens: () => Promise<number | null>;
  /** Do publicado mais recente para o mais antigo. */
  listarPublicados: () => Promise<ResumoPublicado[]>;
  lerPublicado: (slug: string) => Promise<PostPublicado | null>;
};

export type ImagemGuardada = ObjetoGuardado & { tipo: string };

const COLUNAS =
  'slug, versao, estado, criado_em, atualizado_em, publicado_em, conteudo';

const TENTATIVAS_SLUG = 5;

const slugsLidos = z.array(z.object({ slug: z.string() }));

const iso = (valor: ValorSql) =>
  valor instanceof Date ? valor.toISOString() : valor;

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

const chaveImagem = (caminho: string) => caminho.slice(1);

const PREFIXO_IMAGENS = 'blog/';

const VALIDADE_CONTAGEM_MS = 30_000;

export function criarRepositorioBlog({
  consulta,
  armazem,
  agora = () => new Date()
}: {
  consulta: Consulta;
  armazem: Armazem;
  agora?: () => Date;
}) {
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

  async function imagensGuardadas() {
    const objetos = await armazem.listar(PREFIXO_IMAGENS);

    return objetos.flatMap((objeto) => {
      const caminho = `/${objeto.chave}`;

      return PADRAO_CAMINHO_IMAGEM.test(caminho)
        ? [{ ...objeto, caminho }]
        : [];
    });
  }

  let contagem: {
    caminhos: Promise<Set<string> | null>;
    ate: number;
  } | null = null;

  function caminhosContados() {
    const instante = agora().getTime();

    if (contagem && instante < contagem.ate) return contagem.caminhos;

    const caminhos = (async () => {
      try {
        const objetos = await imagensGuardadas();

        return new Set(objetos.map((objeto) => objeto.caminho));
      } catch (erro) {
        logger.warn('O armazém não respondeu à contagem de imagens', erro);

        return null;
      }
    })();

    contagem = { caminhos, ate: instante + VALIDADE_CONTAGEM_MS };

    return caminhos;
  }

  async function apagarImagensDaPasta(slug: string) {
    let objetos;

    try {
      objetos = await armazem.listar(`${PREFIXO_IMAGENS}${slug}/`);
    } catch (erro) {
      logger.warn(`O armazém não listou as imagens de ${slug}`, erro);

      return null;
    }

    const { rows } = await consulta(`select ${COLUNAS} from blog_posts`);
    const usos = usoDasImagens(lerLista(rows, lerLinha).map((g) => g.post));

    const chaves = objetos
      .map((objeto) => objeto.chave)
      .filter((chave) => !usos.has(`/${chave}`));

    let ficaram: Set<string>;

    try {
      ficaram = new Set(await armazem.apagar(chaves));
    } catch (erro) {
      logger.warn(`O armazém não apagou as imagens de ${slug}`, erro);
      ficaram = new Set(chaves);
    }

    const contados = await contagem?.caminhos;

    for (const chave of chaves) {
      if (!ficaram.has(chave)) contados?.delete(`/${chave}`);
    }

    return { apagadas: chaves.length - ficaram.size, falharam: ficaram.size };
  }

  const repositorio: RepositorioBlog = {
    ler,

    async apagarRascunho({ slug, versao }) {
      const atual = await ler(slug);

      conferirApagamento(atual, versao);

      if (atual) {
        const { rows } = await consulta(
          `delete from blog_posts where slug = $1 and versao = $2 and estado = 'rascunho' returning slug`,
          [slug, atual.versao]
        );

        if (!rows[0]) {
          const depois = await ler(slug);

          conferirApagamento(depois, atual.versao);

          if (depois) {
            throw new ErroBlog(
              'O post mudou durante a gravação. Tente de novo.'
            );
          }
        }
      }

      return apagarImagensDaPasta(slug);
    },

    async listarImagens() {
      const [objetos, { rows }] = await Promise.all([
        imagensGuardadas(),
        consulta(`select ${COLUNAS} from blog_posts`)
      ]);

      const posts = lerLista(rows, lerLinha);
      const usos = usoDasImagens(posts.map((guardado) => guardado.post));

      const titulos = new Map(
        posts.map((guardado) => [guardado.slug, guardado.post.titulo])
      );

      return objetos
        .map(({ caminho, tamanho, modificadoEm }) => {
          const [, , slug = '', arquivo = ''] = caminho.split('/');

          return {
            caminho,
            arquivo,
            tamanho,
            enviadaEm: modificadoEm.toISOString(),
            slug,
            tituloDoPost: titulos.get(slug) ?? null,
            uso: usos.get(caminho) ?? 'semUso'
          } satisfies ImagemDoArmazem;
        })
        .sort(
          (a, b) =>
            b.enviadaEm.localeCompare(a.enviadaEm) ||
            a.caminho.localeCompare(b.caminho)
        );
    },

    async contarImagens() {
      return (await caminhosContados())?.size ?? null;
    },

    async listar() {
      const { rows } = await consulta(
        `select ${COLUNAS} from blog_posts order by atualizado_em desc`
      );

      return lerLista(rows, lerLinha).map(
        ({ slug, versao, estado, atualizadoEm, post }) => ({
          slug,
          versao,
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
      (await contagem?.caminhos)?.add(caminho);

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

  return repositorio;
}

/** Imagens no bucket pelas AWS_*; no bun dev sem elas, em .dados/armazem. */
export const repositorioBlog = criarRepositorioBlog({
  consulta: consultar,
  armazem: escolherArmazem(
    process.env,
    path.join(process.cwd(), '.dados', 'armazem')
  )
});
