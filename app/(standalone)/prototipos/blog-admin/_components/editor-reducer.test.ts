import { editorReducer } from './editor-reducer';
import type { Bloco, Linha, Post } from './tipos';
import { describe, expect, it } from 'vitest';

const paragrafo = (id: string): Bloco => ({
  id,
  tipo: 'paragrafo',
  texto: id
});

const linha = (id: string, ...ids: [string] | [string, string]): Linha => ({
  id,
  colunas:
    ids.length === 1
      ? [paragrafo(ids[0])]
      : [paragrafo(ids[0]), paragrafo(ids[1])],
  proporcao: 50
});

const postCom = (...linhas: Linha[]): Post => ({
  assunto: 'maquina',
  titulo: '',
  resumo: '',
  capa: null,
  linhas
});

const blocosPorLinha = (post: Post) =>
  post.linhas.map((l) => l.colunas.map((b) => b.id));

describe('editorReducer', () => {
  it('insere um bloco numa linha nova no meio do texto', () => {
    const antes = postCom(linha('l1', 'a'), linha('l2', 'b'));

    const depois = editorReducer(antes, {
      tipo: 'inserirBloco',
      bloco: paragrafo('novo'),
      destino: { tipo: 'linha', posicao: 1 },
      novaLinhaId: 'l3'
    });

    expect(blocosPorLinha(depois)).toEqual([['a'], ['novo'], ['b']]);
    expect(depois.linhas[1].id).toBe('l3');
  });

  it('insere um bloco ao lado de um parágrafo e cria duas colunas', () => {
    const antes = postCom(linha('l1', 'a'));

    const depois = editorReducer(antes, {
      tipo: 'inserirBloco',
      bloco: paragrafo('img'),
      destino: { tipo: 'lado', linhaId: 'l1', lado: 'direita' },
      novaLinhaId: 'l9'
    });

    expect(blocosPorLinha(depois)).toEqual([['a', 'img']]);
    expect(depois.linhas[0].proporcao).toBe(50);
  });

  it('não põe um terceiro bloco numa linha que já tem duas colunas', () => {
    const antes = postCom(linha('l1', 'a', 'b'));

    const depois = editorReducer(antes, {
      tipo: 'inserirBloco',
      bloco: paragrafo('c'),
      destino: { tipo: 'lado', linhaId: 'l1', lado: 'esquerda' },
      novaLinhaId: 'l9'
    });

    expect(blocosPorLinha(depois)).toEqual([['a', 'b']]);
  });

  it('move uma linha para baixo e para cima', () => {
    const antes = postCom(linha('l1', 'a'), linha('l2', 'b'), linha('l3', 'c'));

    const desceu = editorReducer(antes, {
      tipo: 'moverLinha',
      linhaId: 'l1',
      posicao: 3
    });

    expect(blocosPorLinha(desceu)).toEqual([['b'], ['c'], ['a']]);

    const subiu = editorReducer(desceu, {
      tipo: 'moverLinha',
      linhaId: 'l1',
      posicao: 1
    });

    expect(blocosPorLinha(subiu)).toEqual([['b'], ['a'], ['c']]);
  });

  it('põe duas linhas de uma coluna lado a lado', () => {
    const antes = postCom(linha('l1', 'a'), linha('l2', 'b'), linha('l3', 'c'));

    const depois = editorReducer(antes, {
      tipo: 'porLadoALado',
      linhaId: 'l3',
      alvoId: 'l1',
      lado: 'esquerda'
    });

    expect(blocosPorLinha(depois)).toEqual([['c', 'a'], ['b']]);
  });

  it('separa as colunas em duas linhas na mesma ordem', () => {
    const antes = postCom(linha('l1', 'a', 'b'), linha('l2', 'c'));

    const depois = editorReducer(antes, {
      tipo: 'separarColunas',
      linhaId: 'l1',
      novaLinhaId: 'l9'
    });

    expect(blocosPorLinha(depois)).toEqual([['a'], ['b'], ['c']]);
    expect(depois.linhas.map((l) => l.id)).toEqual(['l1', 'l9', 'l2']);
  });

  it('redimensiona a primeira coluna e para em 25 e em 75', () => {
    const antes = postCom(linha('l1', 'a', 'b'));

    const proporcao = (valor: number) =>
      editorReducer(antes, {
        tipo: 'redimensionar',
        linhaId: 'l1',
        proporcao: valor
      }).linhas[0].proporcao;

    expect(proporcao(62)).toBe(62);
    expect(proporcao(10)).toBe(25);
    expect(proporcao(90)).toBe(75);
  });

  it('remover um bloco de uma linha de duas colunas deixa a outra sozinha', () => {
    const antes = postCom(linha('l1', 'a', 'b'));

    const semB = editorReducer(antes, { tipo: 'removerBloco', blocoId: 'b' });
    expect(blocosPorLinha(semB)).toEqual([['a']]);

    const semA = editorReducer(antes, { tipo: 'removerBloco', blocoId: 'a' });
    expect(blocosPorLinha(semA)).toEqual([['b']]);
  });

  it('remover o único bloco de uma linha apaga a linha', () => {
    const antes = postCom(linha('l1', 'a'), linha('l2', 'b'));

    const depois = editorReducer(antes, { tipo: 'removerBloco', blocoId: 'a' });

    expect(blocosPorLinha(depois)).toEqual([['b']]);
  });

  it('edita um bloco sem mexer nos outros', () => {
    const antes = postCom(linha('l1', 'a', 'b'));

    const depois = editorReducer(antes, {
      tipo: 'editarBloco',
      bloco: { id: 'b', tipo: 'paragrafo', texto: 'texto novo' }
    });

    expect(depois.linhas[0].colunas[1]).toEqual({
      id: 'b',
      tipo: 'paragrafo',
      texto: 'texto novo'
    });
    expect(depois.linhas[0].colunas[0]).toEqual(paragrafo('a'));
  });
});
