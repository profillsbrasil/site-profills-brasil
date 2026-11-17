import type { PostGuardado } from '@/lib/blog/tipos';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EditorBlog } from './editor-blog';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { gravarPost, push } = vi.hoisted(() => ({
  gravarPost: vi.fn(),
  push: vi.fn()
}));

vi.mock('../acoes', () => ({ gravarPost }));

vi.mock('../../entrar/acoes', () => ({ sairDoAdmin: vi.fn() }));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

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

function abrirEditor() {
  window.history.replaceState(null, '', '/admin/blog');
  window.history.pushState(null, '', '/admin/blog/recesso');

  render(<EditorBlog inicial={inicial} totalPosts={1} />);
}

async function editarTitulo() {
  await userEvent.type(
    screen.getByRole('textbox', { name: /^Título/ }),
    ' editado'
  );
}

describe('voltar do navegador no editor', () => {
  beforeEach(() => {
    gravarPost.mockReset();
    push.mockReset();
  });

  it('com mudança não salva, pergunta e fica na página', async () => {
    abrirEditor();
    await editarTitulo();

    window.history.back();

    expect(
      await screen.findByRole('dialog', { name: 'Sair sem salvar?' })
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe('/admin/blog/recesso');
  });

  it('sem mudança pendente, volta direto', async () => {
    abrirEditor();

    window.history.back();

    await waitFor(() => expect(window.location.pathname).toBe('/admin/blog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('"Salvar e sair" grava e volta para a página anterior', async () => {
    gravarPost.mockImplementation(
      async (envio: { post: PostGuardado['post'] }) => ({
        ok: true,
        guardado: { ...inicial, versao: 2, post: envio.post }
      })
    );
    abrirEditor();
    await editarTitulo();

    window.history.back();
    await userEvent.click(
      await screen.findByRole('button', { name: 'Salvar e sair' })
    );

    await waitFor(() => expect(window.location.pathname).toBe('/admin/blog'));
    expect(gravarPost).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'recesso',
        post: expect.objectContaining({
          titulo: 'Recesso de fim de ano na fábrica editado'
        })
      }),
      'salvar'
    );
    expect(push).not.toHaveBeenCalled();
  });
});
