import type { PostGuardado } from '@/lib/blog/tipos';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EditorBlog } from './editor-blog';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

// O jsdom não tem a Navigation API. O falso segue o contrato do navegador: o
// navigate sai antes da travessia e, cancelado, a travessia não acontece.
const navegacao = Object.assign(new EventTarget(), {
  traverseTo: vi.fn(() => window.history.back())
});

function apertarVoltar() {
  const travessia = Object.assign(new Event('navigate', { cancelable: true }), {
    navigationType: 'traverse',
    destination: { key: 'lista' }
  });

  navegacao.dispatchEvent(travessia);

  if (!travessia.defaultPrevented) window.history.back();
}

function abrirEditor() {
  window.history.replaceState(null, '', '/admin/blog');
  window.history.pushState(null, '', '/admin/blog/recesso');

  render(<EditorBlog inicial={inicial} totalPosts={1} />);

  return window.history.length;
}

async function voltarAoDialogo() {
  apertarVoltar();

  return screen.findByRole('dialog', { name: 'Sair sem salvar?' });
}

function gravarComSucesso() {
  gravarPost.mockImplementation(
    async (envio: { post: PostGuardado['post'] }) => ({
      ok: true,
      guardado: { ...inicial, versao: 2, post: envio.post }
    })
  );
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
    navegacao.traverseTo.mockClear();
    Object.defineProperty(window, 'navigation', {
      value: navegacao,
      configurable: true
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(window, 'navigation');
  });

  it('com mudança não salva, pergunta e fica na página', async () => {
    abrirEditor();
    await editarTitulo();

    apertarVoltar();

    expect(
      await screen.findByRole('dialog', { name: 'Sair sem salvar?' })
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe('/admin/blog/recesso');
  });

  it('sem mudança pendente, volta direto', async () => {
    abrirEditor();

    apertarVoltar();

    await waitFor(() => expect(window.location.pathname).toBe('/admin/blog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('"Salvar e sair" grava e volta para a página anterior', async () => {
    gravarComSucesso();
    abrirEditor();
    await editarTitulo();

    apertarVoltar();
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

  it('o roteador não vê o voltar que a pergunta desfaz', async () => {
    const roteador = vi.fn();
    window.addEventListener('popstate', roteador);

    try {
      abrirEditor();
      await editarTitulo();

      await voltarAoDialogo();

      expect(roteador).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener('popstate', roteador);
    }
  });

  it.each([
    [
      '"Continuar editando"',
      () =>
        userEvent.click(
          screen.getByRole('button', { name: 'Continuar editando' })
        )
    ],
    ['Esc', () => userEvent.keyboard('{Escape}')]
  ])(
    'depois de %s, fica no editor e o voltar pergunta de novo',
    async (_nome, fechar) => {
      const entradas = abrirEditor();
      await editarTitulo();

      await voltarAoDialogo();
      await fechar();
      await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      );

      expect(window.location.pathname).toBe('/admin/blog/recesso');
      expect(window.history.length).toBe(entradas);
      expect(await voltarAoDialogo()).toBeInTheDocument();
    }
  );

  it('"Sair sem salvar" pelo voltar chega à lista sem entrada a mais', async () => {
    const entradas = abrirEditor();
    await editarTitulo();

    await voltarAoDialogo();
    await userEvent.click(
      screen.getByRole('button', { name: 'Sair sem salvar' })
    );

    await waitFor(() => expect(window.location.pathname).toBe('/admin/blog'));
    expect(window.history.length).toBe(entradas);
    expect(gravarPost).not.toHaveBeenCalled();
  });

  it('a saída pela lateral não deixa entrada do editor no histórico', async () => {
    const entradas = abrirEditor();
    await editarTitulo();

    await userEvent.click(screen.getByRole('link', { name: /^Posts/ }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Sair sem salvar' })
    );

    expect(push).toHaveBeenCalledWith('/admin/blog');
    expect(window.history.length).toBe(entradas);
  });

  it('salvar pelo botão não deixa entrada a mais no histórico', async () => {
    gravarComSucesso();
    const entradas = abrirEditor();
    await editarTitulo();

    await userEvent.click(
      screen.getByRole('button', { name: 'Salvar rascunho' })
    );

    await waitFor(() => expect(gravarPost).toHaveBeenCalled());
    expect(window.history.length).toBe(entradas);
  });
});
