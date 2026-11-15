import {
  type EntradaEditor,
  postGuardadoSchema,
  slugSchema
} from '@/lib/schemas/post-blog';
import { logger } from '@/lib/utils/logger';
import { LIMITE_SLUG, gerarSlug, textoParaSlug } from '@/lib/utils/slug';

import { ErroBlog, motivosImagem } from './erro';
import { IMAGEM_LIMITE_BYTES, type PostGuardado } from './tipos';
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';
import 'server-only';

/** A costura que o banco vai substituir: quem chama não sabe que é arquivo. */
export type RepositorioPosts = {
  listarPosts: () => Promise<PostGuardado[]>;
  lerPost: (slug: string) => Promise<PostGuardado | null>;
  salvarPost: (entrada: EntradaEditor) => Promise<PostGuardado>;
  publicarPost: (slug: string) => Promise<PostGuardado>;
  despublicarPost: (slug: string) => Promise<PostGuardado>;
  apagarPost: (slug: string) => Promise<void>;
  /** Devolve o caminho público da imagem, como `/blog/<slug>/foto.webp`. */
  salvarImagem: (slug: string, arquivo: File) => Promise<string>;
};

type Pastas = { posts: string; imagens: string };

/** `novo` é o endereço do editor de post novo em /admin/blog/novo. */
const SLUGS_RESERVADOS = ['novo'];

const ascii = (bytes: Uint8Array, inicio: number, fim: number) =>
  String.fromCharCode(...bytes.subarray(inicio, fim));

/** O tipo vem dos bytes do arquivo, nunca do nome nem do MIME que o navegador mandou. */
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

function validarSlug(slug: string) {
  const lido = slugSchema.safeParse(slug);

  if (!lido.success) throw new ErroBlog('Endereço do post inválido.');

  return lido.data;
}

const semExtensao = (nome: string) => nome.replace(/\.[^.]*$/, '');

/** Arquivo ou pasta que ainda não existe vira null; outro erro de disco sobe. */
async function ouNuloSeAusente<T>(leitura: () => Promise<T>) {
  try {
    return await leitura();
  } catch (erro) {
    if (erro instanceof Error && 'code' in erro && erro.code === 'ENOENT') {
      return null;
    }

    throw erro;
  }
}

const lerPasta = async (pasta: string) =>
  (await ouNuloSeAusente(() => readdir(pasta))) ?? [];

async function gravarInteiro(arquivo: string, conteudo: string | Uint8Array) {
  const temporario = path.join(
    path.dirname(arquivo),
    `.${path.basename(arquivo)}.${crypto.randomUUID()}.tmp`
  );

  await mkdir(path.dirname(arquivo), { recursive: true });
  await writeFile(temporario, conteudo);
  await rename(temporario, arquivo);
}

export function criarRepositorioArquivo(
  pastas: Pastas,
  agora: () => Date = () => new Date()
): RepositorioPosts {
  const arquivoPost = (slug: string) =>
    path.join(pastas.posts, `${validarSlug(slug)}.json`);

  async function slugsOcupados() {
    const nomes = await lerPasta(pastas.posts);

    return new Set([
      ...SLUGS_RESERVADOS,
      ...nomes.filter((n) => n.endsWith('.json')).map(semExtensao)
    ]);
  }

  async function gravar(guardado: PostGuardado) {
    const canonico = postGuardadoSchema.parse(guardado);

    await gravarInteiro(
      arquivoPost(canonico.slug),
      `${JSON.stringify(canonico, null, 2)}\n`
    );

    return canonico;
  }

  async function lerPost(slug: string) {
    const caminho = arquivoPost(slug);
    const texto = await ouNuloSeAusente(() => readFile(caminho, 'utf8'));

    if (texto === null) return null;

    let json: unknown;

    try {
      json = JSON.parse(texto);
    } catch {
      throw new ErroBlog(`O arquivo do post ${slug} não é JSON válido.`);
    }

    const lido = postGuardadoSchema.safeParse(json);

    if (!lido.success || lido.data.slug !== slug) {
      throw new ErroBlog(`O arquivo do post ${slug} está fora do formato.`);
    }

    return lido.data;
  }

  async function exigirPost(slug: string) {
    const atual = await lerPost(slug);

    if (!atual) throw new ErroBlog('Esse post não existe mais no disco.');

    return atual;
  }

  return {
    lerPost,

    async listarPosts() {
      const nomes = await lerPasta(pastas.posts);

      const lidos = await Promise.all(
        nomes
          .filter((n) => n.endsWith('.json') && !n.startsWith('.'))
          .map(async (nome) => {
            try {
              return await lerPost(semExtensao(nome));
            } catch (erro) {
              logger.warn(`Post ignorado na lista: ${nome}`, erro);

              return null;
            }
          })
      );

      return lidos
        .filter((p) => p !== null)
        .toSorted((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
    },

    async salvarPost({ slug, post }) {
      const atualizadoEm = agora().toISOString();

      if (slug === null) {
        return gravar({
          slug: gerarSlug(post.titulo, await slugsOcupados()),
          estado: 'rascunho',
          criadoEm: atualizadoEm,
          atualizadoEm,
          publicadoEm: null,
          post
        });
      }

      return gravar({ ...(await exigirPost(slug)), atualizadoEm, post });
    },

    async publicarPost(slug) {
      const atual = await exigirPost(slug);
      const atualizadoEm = agora().toISOString();

      return gravar({
        ...atual,
        estado: 'publicado',
        atualizadoEm,
        publicadoEm: atual.publicadoEm ?? atualizadoEm
      });
    },

    async despublicarPost(slug) {
      return gravar({
        ...(await exigirPost(slug)),
        estado: 'rascunho',
        atualizadoEm: agora().toISOString(),
        publicadoEm: null
      });
    },

    async apagarPost(slug) {
      await rm(arquivoPost(slug), { force: true });
    },

    async salvarImagem(slug, arquivo) {
      const valido = validarSlug(slug);

      await exigirPost(valido);

      if (arquivo.size > IMAGEM_LIMITE_BYTES) {
        throw new ErroBlog(motivosImagem.tamanho);
      }

      const bytes = new Uint8Array(await arquivo.arrayBuffer());
      const tipo = tiposImagem.find((t) => t.confere(bytes));

      if (!tipo) throw new ErroBlog(motivosImagem.tipo);

      const pasta = path.join(pastas.imagens, valido);
      const ocupados = new Set((await lerPasta(pasta)).map(semExtensao));

      const nomeOriginal = semExtensao(
        arquivo.name.split(/[/\\]/).at(-1) ?? ''
      );

      const base =
        textoParaSlug(nomeOriginal).slice(0, LIMITE_SLUG) || 'imagem';

      const nome = `${gerarSlug(base, ocupados)}.${tipo.extensao}`;

      await gravarInteiro(path.join(pasta, nome), bytes);

      return `/blog/${valido}/${nome}`;
    }
  };
}

export const {
  listarPosts,
  lerPost,
  salvarPost,
  publicarPost,
  despublicarPost,
  apagarPost,
  salvarImagem
} = criarRepositorioArquivo({
  posts: path.join(process.cwd(), 'conteudo', 'blog', 'posts'),
  imagens: path.join(process.cwd(), 'public', 'blog')
});
