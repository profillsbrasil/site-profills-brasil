import {
  type Bloco,
  type Lado,
  type Linha,
  PROPORCAO_MAXIMA,
  PROPORCAO_MINIMA,
  type Post
} from '@/lib/blog/tipos';

/** `posicao` conta os vãos entre linhas: 0 é antes da primeira, `linhas.length` é o fim. */
export type Destino =
  | { tipo: 'linha'; posicao: number }
  | { tipo: 'lado'; linhaId: string; lado: Lado };

export type DadosPost = Omit<Post, 'linhas'>;

export type AcaoEditor =
  | {
      tipo: 'inserirBloco';
      bloco: Bloco;
      destino: Destino;
      novaLinhaId: string;
    }
  | { tipo: 'moverLinha'; linhaId: string; posicao: number }
  | { tipo: 'porLadoALado'; linhaId: string; alvoId: string; lado: Lado }
  | { tipo: 'separarColunas'; linhaId: string; novaLinhaId: string }
  | { tipo: 'redimensionar'; linhaId: string; proporcao: number }
  | { tipo: 'removerBloco'; blocoId: string }
  | { tipo: 'editarBloco'; bloco: Bloco }
  | { tipo: 'editarDados'; dados: Partial<DadosPost> };

const mesmoConteudo = <T>(a: T, b: T) =>
  a === b || JSON.stringify(a) === JSON.stringify(b);

const mesmaLinha = (a: Linha, b: Linha) =>
  a === b ||
  (a.id === b.id &&
    a.proporcao === b.proporcao &&
    a.colunas.length === b.colunas.length &&
    a.colunas.every((bloco, i) => mesmoConteudo(bloco, b.colunas[i])));

export function mesmoPost(a: Post, b: Post) {
  const { linhas: linhasA, ...dadosA } = a;
  const { linhas: linhasB, ...dadosB } = b;

  return (
    mesmoConteudo(dadosA, dadosB) &&
    linhasA.length === linhasB.length &&
    linhasA.every((linha, i) => mesmaLinha(linha, linhasB[i]))
  );
}

const limitarProporcao = (valor: number) =>
  Math.min(PROPORCAO_MAXIMA, Math.max(PROPORCAO_MINIMA, Math.round(valor)));

const juntar = (bloco: Bloco, vizinho: Bloco, lado: Lado) =>
  (lado === 'esquerda'
    ? [bloco, vizinho]
    : [vizinho, bloco]) satisfies Linha['colunas'];

const inserirEm = (linhas: Linha[], posicao: number, nova: Linha) => {
  const limite = Math.min(Math.max(posicao, 0), linhas.length);

  return [...linhas.slice(0, limite), nova, ...linhas.slice(limite)];
};

export function editorReducer(post: Post, acao: AcaoEditor) {
  switch (acao.tipo) {
    case 'inserirBloco': {
      const { destino } = acao;

      if (destino.tipo === 'linha') {
        const nova: Linha = {
          id: acao.novaLinhaId,
          colunas: [acao.bloco],
          proporcao: 50
        };

        return {
          ...post,
          linhas: inserirEm(post.linhas, destino.posicao, nova)
        } satisfies Post;
      }

      return {
        ...post,
        linhas: post.linhas.map((l) =>
          l.id === destino.linhaId && l.colunas.length === 1
            ? {
                ...l,
                colunas: juntar(acao.bloco, l.colunas[0], destino.lado),
                proporcao: 50
              }
            : l
        )
      } satisfies Post;
    }

    case 'moverLinha': {
      const origem = post.linhas.findIndex((l) => l.id === acao.linhaId);

      if (origem < 0) return post;
      const movida = post.linhas[origem];
      const resto = post.linhas.filter((l) => l.id !== acao.linhaId);
      const posicao = acao.posicao > origem ? acao.posicao - 1 : acao.posicao;

      return {
        ...post,
        linhas: inserirEm(resto, posicao, movida)
      } satisfies Post;
    }

    case 'porLadoALado': {
      const fonte = post.linhas.find((l) => l.id === acao.linhaId);
      const alvo = post.linhas.find((l) => l.id === acao.alvoId);

      if (
        !fonte ||
        !alvo ||
        fonte === alvo ||
        fonte.colunas.length !== 1 ||
        alvo.colunas.length !== 1
      ) {
        return post;
      }

      const colunas = juntar(fonte.colunas[0], alvo.colunas[0], acao.lado);

      return {
        ...post,
        linhas: post.linhas
          .filter((l) => l !== fonte)
          .map((l) => (l === alvo ? { ...l, colunas, proporcao: 50 } : l))
      } satisfies Post;
    }

    case 'separarColunas': {
      return {
        ...post,
        linhas: post.linhas.flatMap<Linha>((l) =>
          l.id === acao.linhaId && l.colunas.length === 2
            ? [
                { ...l, colunas: [l.colunas[0]], proporcao: 50 },
                { id: acao.novaLinhaId, colunas: [l.colunas[1]], proporcao: 50 }
              ]
            : [l]
        )
      } satisfies Post;
    }

    case 'redimensionar': {
      return {
        ...post,
        linhas: post.linhas.map((l) =>
          l.id === acao.linhaId
            ? { ...l, proporcao: limitarProporcao(acao.proporcao) }
            : l
        )
      } satisfies Post;
    }

    case 'removerBloco': {
      return {
        ...post,
        linhas: post.linhas.flatMap<Linha>((l) => {
          const resto = l.colunas.filter((b) => b.id !== acao.blocoId);

          if (resto.length === l.colunas.length) return [l];

          if (resto.length === 0) return [];

          return [{ ...l, colunas: [resto[0]], proporcao: 50 }];
        })
      } satisfies Post;
    }

    case 'editarBloco': {
      const trocar = (b: Bloco) => (b.id === acao.bloco.id ? acao.bloco : b);

      return {
        ...post,
        linhas: post.linhas.map((l) => ({
          ...l,
          colunas:
            l.colunas.length === 1
              ? [trocar(l.colunas[0])]
              : [trocar(l.colunas[0]), trocar(l.colunas[1])]
        }))
      } satisfies Post;
    }

    case 'editarDados': {
      return { ...post, ...acao.dados } satisfies Post;
    }
  }
}
