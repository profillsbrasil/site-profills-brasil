// @vitest-environment node
import { MOTIVO_SEM_SESSAO } from '@/lib/blog/erro';

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const PASTA = path.join(process.cwd(), 'app', '(standalone)', 'admin');

const ORIGEM = 'https://www.profills.com';

// O login é a única entrada sem sessão: entrar cria a sessão, e sair só apaga o cookie.
const SEM_SESSAO = ['entrar/'];

// Cada export novo do login precisa entrar aqui, e o teste confere que ele não toca no blog.
const EXPORTS_SEM_SESSAO = new Map([
  ['entrar/acoes.ts', ['entrarNoAdmin', 'sairDoAdmin']],
  ['entrar/page.tsx', ['default']]
]);

const ENTRADA_POR_NOME = /(^|\/)(page|route)\.tsx?$/;

const toques = vi.hoisted((): string[] => []);

// O redirect do Next lança; aqui ele lança com o destino para o teste conferir.
const { Desviou } = vi.hoisted(() => ({
  Desviou: class extends Error {
    constructor(readonly destino: string) {
      super(destino);
    }
  }
}));

vi.mock('@/lib/admin/sessao', () => ({
  autorAtual: async () => null,
  entrar: async () => ({ tipo: 'recusado' }),
  sair: async () => undefined
}));

// Qualquer leitura do repositório ou consulta ao banco fica registrada e falha.
vi.mock('@/lib/blog/repositorio', () => ({
  repositorioBlog: new Proxy(
    {},
    {
      get(_, chave) {
        toques.push(`repositorio.${String(chave)}`);
        throw new Error('tocou no repositório sem sessão');
      }
    }
  )
}));

vi.mock('@/lib/banco/conexao', () => ({
  consultar: () => {
    toques.push('banco');
    throw new Error('tocou no banco sem sessão');
  }
}));

vi.mock('next/navigation', () => ({
  redirect: (destino: string) => {
    throw new Desviou(destino);
  },
  notFound: () => {
    throw new Error('notFound sem sessão');
  }
}));

async function arquivosDoAdmin() {
  const nomes = await readdir(PASTA, { recursive: true });

  return nomes.map((nome) => nome.split(path.sep).join('/'));
}

/** Página, route handler e todo arquivo com 'use server', de topo ou inline. */
async function entradasDoAdmin() {
  const entradas: string[] = [];

  for (const nome of await arquivosDoAdmin()) {
    if (!/\.[jt]sx?$/.test(nome) || /\.test\.[jt]sx?$/.test(nome)) continue;

    const codigo = await readFile(path.join(PASTA, nome), 'utf8');

    if (ENTRADA_POR_NOME.test(nome) || /['"]use server['"]/.test(codigo))
      entradas.push(nome);
  }

  return entradas.sort();
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
};

type Saida = Response | object | null | undefined;

type Exportado = (...args: (Request | Props)[]) => Saida | Promise<Saida>;

// O import dinâmico não tem tipo: o schema separa as funções do resto dos exports.
const exportadoSchema = z.custom<Exportado>(
  (valor) => valor instanceof Function
);

const props: Props = {
  params: Promise.resolve({ slug: 'catalogo-novo' }),
  searchParams: Promise.resolve({})
};

const pedido = () =>
  new Request(`${ORIGEM}/admin/blog/x/imagem`, {
    method: 'POST',
    headers: { origin: ORIGEM },
    body: new FormData()
  });

/** As funções exportadas pelo arquivo, como o Next as enxerga. */
async function exportsDe(nome: string) {
  const modulo: object = await import(
    /* @vite-ignore */ path.join(PASTA, nome)
  );

  const lista: [string, Exportado][] = [];

  for (const [exportado, valor] of Object.entries(modulo)) {
    const lido = exportadoSchema.safeParse(valor);

    if (lido.success) lista.push([exportado, lido.data]);
  }

  return lista;
}

/** Chama o export como o Next chamaria e diz se ele recusou: 401, motivo de sessão ou desvio ao login. */
async function recusou(nome: string, funcao: Exportado) {
  const ehRota = /(^|\/)route\.tsx?$/.test(nome);
  const ehPagina = /(^|\/)page\.tsx?$/.test(nome);
  const args = ehRota ? [pedido(), props] : ehPagina ? [props] : [];

  try {
    const resposta = await funcao(...args);

    if (resposta instanceof Response) return resposta.status === 401;

    return JSON.stringify(resposta ?? null).includes(MOTIVO_SEM_SESSAO);
  } catch (erro) {
    return erro instanceof Desviou && erro.destino.startsWith('/admin/entrar');
  }
}

beforeEach(() => {
  vi.stubEnv('SITE_URL', ORIGEM);
  toques.length = 0;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('guarda do admin', () => {
  it('não sobra rota com o sufixo .dev', async () => {
    expect(
      (await arquivosDoAdmin()).filter((nome) => /\.dev\.[jt]sx?$/.test(nome))
    ).toEqual([]);
  });

  it('acha as entradas conhecidas do admin', async () => {
    expect(await entradasDoAdmin()).toEqual(
      expect.arrayContaining([
        'blog/page.tsx',
        'blog/novo/page.tsx',
        'blog/[slug]/page.tsx',
        'blog/[slug]/imagem/route.ts',
        'blog/imagens/page.tsx',
        'blog/assuntos/page.tsx',
        'blog/acoes.ts',
        'entrar/acoes.ts',
        'entrar/page.tsx'
      ])
    );
  });

  it('as actions do blog que o guarda confere incluem gravar e apagar', async () => {
    expect((await exportsDe('blog/acoes.ts')).map(([nome]) => nome)).toEqual(
      expect.arrayContaining(['gravarPost', 'apagarRascunho'])
    );
  });

  it('todo export de página, action e route handler fora do login recusa sem sessão e sem tocar no repositório', async () => {
    const entradas = (await entradasDoAdmin()).filter(
      (nome) => !SEM_SESSAO.some((livre) => nome.startsWith(livre))
    );

    for (const nome of entradas) {
      for (const [exportado, funcao] of await exportsDe(nome)) {
        toques.length = 0;

        expect(await recusou(nome, funcao), `${nome} ${exportado}`).toBe(true);
        expect(toques, `${nome} ${exportado}`).toEqual([]);
      }
    }
    // Importa o admin inteiro: com a suíte em paralelo leva de 4 a 5 s, e 1,4 s sozinho.
  }, 30_000);

  it('o login só exporta o que a lista conhece e não toca no blog', async () => {
    const livres = (await entradasDoAdmin()).filter((nome) =>
      SEM_SESSAO.some((livre) => nome.startsWith(livre))
    );

    expect(livres).toEqual([...EXPORTS_SEM_SESSAO.keys()].sort());

    for (const nome of livres) {
      const lista = await exportsDe(nome);

      expect(lista.map(([exportado]) => exportado).sort(), nome).toEqual(
        EXPORTS_SEM_SESSAO.get(nome)
      );

      for (const [, funcao] of lista) await recusou(nome, funcao);

      expect(toques, nome).toEqual([]);
    }
  });
});
