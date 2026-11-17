import { ErroBlog } from './erro';
import {
  MOTIVO_APAGAR_PUBLICADO,
  conferirApagamento,
  conferirVersao,
  transicao
} from './regras';
import type { Post, PostGuardado } from './tipos';
import { describe, expect, it } from 'vitest';

const post: Post = {
  assunto: 'nota',
  titulo: 'Catálogo',
  resumo: '',
  capa: null,
  linhas: []
};

const rascunho: PostGuardado = {
  slug: 'catalogo',
  versao: 3,
  estado: 'rascunho',
  criadoEm: '2026-11-15T12:00:00.000Z',
  atualizadoEm: '2026-11-15T17:32:00.000Z',
  publicadoEm: null,
  post
};

const publicado: PostGuardado = {
  ...rascunho,
  estado: 'publicado',
  publicadoEm: '2026-11-15T13:00:00.000Z'
};

const agora = '2026-11-16T10:00:00.000Z';

describe('transição de um post', () => {
  it('post novo nasce na versão 1, com criação e atualização agora', () => {
    expect(transicao(null, post, 'salvar', agora, 'catalogo')).toEqual({
      slug: 'catalogo',
      versao: 1,
      estado: 'rascunho',
      criadoEm: agora,
      atualizadoEm: agora,
      publicadoEm: null,
      post
    });
    expect(transicao(null, post, 'publicar', agora, 'catalogo')).toMatchObject({
      estado: 'publicado',
      publicadoEm: agora
    });
  });

  it('salvar mantém o estado e sobe a versão sem mexer na criação', () => {
    expect(
      transicao(rascunho, post, 'salvar', agora, 'catalogo')
    ).toMatchObject({
      versao: 4,
      estado: 'rascunho',
      criadoEm: rascunho.criadoEm,
      atualizadoEm: agora
    });
    expect(
      transicao(publicado, post, 'salvar', agora, 'catalogo')
    ).toMatchObject({
      estado: 'publicado',
      publicadoEm: publicado.publicadoEm
    });
  });

  it('publicar de novo preserva a data da primeira publicação', () => {
    expect(
      transicao(rascunho, post, 'publicar', agora, 'catalogo')
    ).toMatchObject({
      estado: 'publicado',
      publicadoEm: agora
    });
    expect(
      transicao(publicado, post, 'publicar', agora, 'catalogo')
    ).toMatchObject({
      publicadoEm: publicado.publicadoEm
    });
  });

  it('despublicar volta para rascunho sem data de publicação', () => {
    expect(
      transicao(publicado, post, 'despublicar', agora, 'catalogo')
    ).toMatchObject({ estado: 'rascunho', publicadoEm: null, versao: 4 });
  });
});

describe('conferência de versão', () => {
  it('aceita a versão que o editor leu', () => {
    expect(() => conferirVersao(rascunho, 3)).not.toThrow();
  });

  it('recusa versão velha com a hora de Brasília da outra gravação', () => {
    expect(() => conferirVersao(rascunho, 2)).toThrow(
      new ErroBlog(
        'Este post foi salvo em outra aba às 14h32. Recarregue a página para ver a versão nova.'
      )
    );
  });

  it('recusa post que não existe mais', () => {
    expect(() => conferirVersao(null, 1)).toThrow(ErroBlog);
  });
});

describe('apagar um post', () => {
  it('rascunho na versão lida pode sair', () => {
    expect(() => conferirApagamento(rascunho, 3)).not.toThrow();
  });

  it('post publicado é recusado com o motivo, mesmo na versão lida', () => {
    expect(() => conferirApagamento(publicado, 3)).toThrow(
      new ErroBlog(MOTIVO_APAGAR_PUBLICADO)
    );
  });

  it('versão antiga é recusada com o aviso de outra aba', () => {
    expect(() => conferirApagamento(rascunho, 2)).toThrow('outra aba');
  });

  it('post que já saiu passa, para repetir terminar as imagens', () => {
    expect(() => conferirApagamento(null, 1)).not.toThrow();
  });
});
