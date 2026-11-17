import type { PostGuardado } from '@/lib/blog/tipos';
import { render, screen } from '@testing-library/react';

import { EditorBlog } from './editor-blog';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../acoes', () => ({ gravarPost: vi.fn() }));

vi.mock('../../entrar/acoes', () => ({ sairDoAdmin: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() })
}));

vi.mock('next/image', () => ({ default: () => null }));

const inicial: PostGuardado = {
  slug: 'lado-a-lado',
  versao: 1,
  criadoEm: '2026-11-10T09:00:00-03:00',
  atualizadoEm: '2026-11-10T09:00:00-03:00',
  estado: 'rascunho',
  publicadoEm: null,
  post: {
    assunto: 'aviso',
    titulo: 'Duas colunas',
    resumo: '',
    capa: null,
    linhas: [
      {
        id: 'l1',
        proporcao: 50,
        colunas: [
          { id: 'b1', tipo: 'paragrafo', texto: 'Esquerda' },
          { id: 'b2', tipo: 'paragrafo', texto: 'Direita' }
        ]
      }
    ]
  }
};

// Espaçamento de 6 ou 10 px, em classe da escala (1.5 e 2.5) ou em valor arbitrário.
const foraDaGrade =
  /^(?:.+:)?-?(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy])-(?:1\.5|2\.5|\[(?:6|10)px\])$/;

const classesForaDaGrade = (elemento: HTMLElement) =>
  [...elemento.classList].filter((classe) => foraDaGrade.test(classe));

describe('grade de 4 px do admin', () => {
  it('os botões pequenos e as abas não têm espaçamento de 6 ou 10 px', () => {
    render(<EditorBlog inicial={inicial} totais={{ posts: 1, imagens: 0 }} />);

    const elementos = [
      screen.getByRole('button', { name: 'Salvar rascunho' }),
      screen.getByRole('button', { name: 'Publicar' }),
      screen.getByRole('button', { name: 'Desfazer lado a lado' }),
      screen.getByRole('tab', { name: 'Computador' }),
      screen.getByRole('tab', { name: 'Celular' })
    ];

    expect(elementos.map(classesForaDaGrade)).toEqual(elementos.map(() => []));
  });
});
