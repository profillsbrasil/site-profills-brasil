import {
  dataCurta,
  idYoutube,
  minutosDeLeitura,
  montarListagem,
  outrosPosts,
  primeiraMaquina
} from './apresentacao';
import type { Post, ResumoPublicado } from './tipos';
import { describe, expect, it } from 'vitest';

const resumo = (
  slug: string,
  assunto: ResumoPublicado['assunto'],
  publicadoEm: string,
  capa: string | null = null
): ResumoPublicado => ({
  slug,
  assunto,
  publicadoEm,
  capa,
  titulo: slug,
  resumo: ''
});

const post = (linhas: Post['linhas']): Post => ({
  assunto: 'maquina',
  titulo: 'Título',
  resumo: 'Resumo',
  capa: null,
  linhas
});

describe('dataCurta', () => {
  it('formata no fuso de Brasília', () => {
    expect(dataCurta('2026-11-10T13:00:00.000Z')).toBe('10 nov 2026');
    expect(dataCurta('2026-01-01T02:00:00.000Z')).toBe('31 dez 2025');
  });
});

describe('minutosDeLeitura', () => {
  it('nunca dá menos de 1 minuto', () => {
    expect(minutosDeLeitura(post([]))).toBe(1);
  });

  it('conta as palavras de todos os blocos a 200 por minuto', () => {
    const texto = Array.from({ length: 600 }, () => 'palavra').join(' ');

    expect(
      minutosDeLeitura(
        post([
          {
            id: 'l',
            proporcao: 50,
            colunas: [
              { id: 'a', tipo: 'paragrafo', texto },
              { id: 'b', tipo: 'lista', itens: [texto] }
            ]
          }
        ])
      )
    ).toBe(6);
  });
});

describe('primeiraMaquina', () => {
  it('acha a máquina mesmo na segunda coluna', () => {
    expect(
      primeiraMaquina(
        post([
          {
            id: 'l',
            proporcao: 50,
            colunas: [
              { id: 'a', tipo: 'paragrafo', texto: 'x' },
              { id: 'b', tipo: 'maquina', slug: 'envasadora-gable-top-gt' }
            ]
          }
        ])
      )
    ).toBe('envasadora-gable-top-gt');
  });

  it('devolve null sem máquina', () => {
    expect(primeiraMaquina(post([]))).toBeNull();
  });
});

describe('montarListagem', () => {
  const agora = new Date('2026-11-16T12:00:00.000Z');

  const publicados = [
    resumo('aviso-novo', 'aviso', '2026-11-12T12:00:00.000Z'),
    resumo('gt', 'maquina', '2026-11-10T12:00:00.000Z', '/blog/gt/capa.webp'),
    resumo('feira', 'evento', '2026-10-22T12:00:00.000Z', '/blog/feira/a.webp'),
    resumo('catalogo', 'nota', '2026-09-18T12:00:00.000Z')
  ];

  it('separa posts com capa dos sem capa', () => {
    const l = montarListagem(publicados, null, agora);

    expect(l.destaques.map((p) => p.slug)).toEqual(['gt', 'feira']);
    expect(l.notas.map((p) => p.slug)).toEqual(['aviso-novo', 'catalogo']);
  });

  it('fixa o aviso mais novo só até 30 dias', () => {
    expect(montarListagem(publicados, null, agora).fixado?.slug).toBe(
      'aviso-novo'
    );
    expect(
      montarListagem(publicados, null, new Date('2026-12-20T12:00:00.000Z'))
        .fixado
    ).toBeNull();
  });

  it('filtra por assunto e conta só assuntos com post', () => {
    const l = montarListagem(publicados, 'evento', agora);

    expect(l.destaques.map((p) => p.slug)).toEqual(['feira']);
    expect(l.notas).toEqual([]);
    expect(l.contagem).toEqual([
      { assunto: 'maquina', total: 1 },
      { assunto: 'evento', total: 1 },
      { assunto: 'nota', total: 1 },
      { assunto: 'aviso', total: 1 }
    ]);
  });

  it('lista vazia não fixa nada', () => {
    expect(montarListagem([], null, agora)).toEqual({
      fixado: null,
      contagem: [],
      destaques: [],
      notas: []
    });
  });
});

describe('outrosPosts', () => {
  it('tira o post atual e corta em 3', () => {
    const lista = ['a', 'b', 'c', 'd', 'e'].map((s) =>
      resumo(s, 'nota', '2026-11-01T12:00:00.000Z')
    );

    expect(outrosPosts(lista, 'b').map((p) => p.slug)).toEqual(['a', 'c', 'd']);
  });
});

describe('idYoutube', () => {
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ?t=3', 'dQw4w9WgXcQ'],
    ['https://youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ']
  ])('lê %s', (url, id) => {
    expect(idYoutube(url)).toBe(id);
  });

  it.each(['', 'nao é url', 'https://vimeo.com/123', 'https://youtu.be/curto'])(
    'recusa %s',
    (url) => {
      expect(idYoutube(url)).toBeNull();
    }
  );
});
