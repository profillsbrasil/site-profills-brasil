import type { PostGuardado } from '@/lib/blog/tipos';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EditorBlog } from './editor-blog';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../acoes', () => ({ gravarPost: vi.fn() }));

vi.mock('../../entrar/acoes', () => ({ sairDoAdmin: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() })
}));

vi.mock('next/image', () => ({ default: () => null }));

const inicial: PostGuardado = {
  slug: 'recesso',
  versao: 1,
  criadoEm: '2026-11-10T09:00:00-03:00',
  atualizadoEm: '2026-11-10T09:00:00-03:00',
  estado: 'rascunho',
  publicadoEm: null,
  post: {
    assunto: 'aviso',
    titulo: 'Recesso de fim de ano na fábrica',
    resumo: 'A fábrica para entre o Natal e o Ano-Novo.',
    capa: null,
    linhas: []
  }
};

function apertarVoltar() {
  const travessia = Object.assign(new Event('navigate', { cancelable: true }), {
    navigationType: 'traverse',
    destination: { key: 'lista' }
  });

  window.navigation.dispatchEvent(travessia);

  return travessia.defaultPrevented;
}

async function digitarEApagar() {
  render(<EditorBlog inicial={inicial} totais={{ posts: 1, imagens: 0 }} />);

  const titulo = screen.getByRole('textbox', { name: /^Título/ });

  await userEvent.type(titulo, ' x');
  expect(screen.getByText('Mudanças não salvas')).toBeInTheDocument();

  await userEvent.type(titulo, '{Backspace}{Backspace}');
}

describe('mudança desfeita no editor', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'navigation');
  });

  it('não pergunta no voltar do navegador', async () => {
    Object.defineProperty(window, 'navigation', {
      value: Object.assign(new EventTarget(), { traverseTo: vi.fn() }),
      configurable: true
    });

    await digitarEApagar();

    expect(apertarVoltar()).toBe(false);
    expect(
      screen.queryByRole('dialog', { name: 'Sair sem salvar?' })
    ).not.toBeInTheDocument();
  });

  it('não conta como mudança não salva nem pergunta ao sair pela lateral', async () => {
    await digitarEApagar();
    expect(screen.queryByText('Mudanças não salvas')).not.toBeInTheDocument();

    const posts = screen.getByRole('link', { name: /^Posts/ });
    const clique = new MouseEvent('click', { bubbles: true, cancelable: true });

    posts.addEventListener('click', (e) => e.preventDefault(), { once: true });
    fireEvent(posts, clique);

    expect(
      screen.queryByRole('dialog', { name: 'Sair sem salvar?' })
    ).not.toBeInTheDocument();
  });
});
