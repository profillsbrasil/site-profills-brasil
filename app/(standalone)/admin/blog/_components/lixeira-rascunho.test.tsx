import type { ResumoAdmin } from '@/lib/blog/tipos';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ResultadoApagar } from '../acoes';
import PostsPage from '../page';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { apagarRascunho, listar } = vi.hoisted(() => ({
  apagarRascunho: vi.fn(),
  listar: vi.fn()
}));

vi.mock('../acoes', () => ({ apagarRascunho }));

vi.mock('../../entrar/acoes', () => ({ sairDoAdmin: vi.fn() }));

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

vi.mock('@/lib/blog/admin', () => ({
  abrirAdminBlog: async () => ({ listar, contarImagens: async () => 5 })
}));

vi.mock('next/image', () => ({ default: () => null }));

const posts: ResumoAdmin[] = [
  {
    slug: 'teste-pouch',
    versao: 3,
    estado: 'rascunho',
    atualizadoEm: '2026-11-17T10:00:00-03:00',
    titulo: 'Teste pouch',
    assunto: 'embalagem'
  },
  {
    slug: 'fispal-2026',
    versao: 1,
    estado: 'publicado',
    atualizadoEm: '2026-11-16T10:00:00-03:00',
    titulo: 'Fispal 2026: o que levamos para o estande',
    assunto: 'evento'
  }
];

async function abrir() {
  listar.mockResolvedValue(posts);
  render(await PostsPage());
}

const lixeira = () =>
  screen.getByRole('button', { name: 'Apagar o rascunho "Teste pouch"' });

async function confirmar() {
  await userEvent.click(lixeira());

  const dialogo = await screen.findByRole('dialog', {
    name: 'Apagar rascunho?'
  });

  return {
    dialogo,
    botao: within(dialogo).getByRole('button', {
      name: /^Apagar rascunho|^Apagando/
    })
  };
}

afterEach(() => vi.clearAllMocks());

describe('Apagar rascunho na lista de posts', () => {
  it('só a linha de rascunho tem a lixeira, fora do link do post', async () => {
    await abrir();

    expect(
      screen.getAllByRole('button', { name: /^Apagar o rascunho/ })
    ).toHaveLength(1);
    expect(lixeira().closest('a')).toBeNull();
    expect(screen.queryByRole('button', { name: /Fispal 2026/ })).toBeNull();
  });

  it('confirma com o título e manda o slug e a versão lidos uma vez só', async () => {
    let terminar: (resultado: ResultadoApagar) => void = () => {};

    apagarRascunho.mockReturnValue(
      new Promise((resolver) => {
        terminar = resolver;
      })
    );
    await abrir();

    const { dialogo, botao } = await confirmar();

    expect(dialogo.textContent).toContain('"Teste pouch"');
    expect(apagarRascunho).not.toHaveBeenCalled();

    await userEvent.click(botao);
    await userEvent.click(botao);

    expect(apagarRascunho).toHaveBeenCalledTimes(1);
    expect(apagarRascunho).toHaveBeenCalledWith({
      slug: 'teste-pouch',
      versao: 3
    });
    expect(
      within(dialogo).getByRole('button', { name: 'Apagando…' })
    ).toHaveProperty('disabled', true);

    await act(async () =>
      terminar({ ok: true, imagens: { apagadas: 3, falharam: 0 } })
    );

    expect((await screen.findByRole('status')).textContent).toBe(
      'Rascunho "Teste pouch" apagado, com 3 imagens.'
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('mostra o motivo do servidor no diálogo e mantém o post', async () => {
    apagarRascunho.mockResolvedValue({
      ok: false,
      erro: 'Este post foi salvo em outra aba às 14h32. Recarregue a página para ver a versão nova.'
    });
    await abrir();

    const { dialogo, botao } = await confirmar();

    await userEvent.click(botao);

    expect((await within(dialogo).findByRole('alert')).textContent).toBe(
      'Este post foi salvo em outra aba às 14h32. Recarregue a página para ver a versão nova.'
    );
    expect(screen.queryByRole('status')).toBeNull();
    expect(
      screen.getByRole('link', { name: /Teste pouch/, hidden: true })
    ).toBeTruthy();
  });

  it('libera o diálogo com o motivo quando o servidor não responde', async () => {
    apagarRascunho.mockRejectedValue(new TypeError('Failed to fetch'));
    await abrir();

    const { dialogo, botao } = await confirmar();

    await userEvent.click(botao);

    expect((await within(dialogo).findByRole('alert')).textContent).toBe(
      'O servidor não respondeu. Confira a conexão e tente de novo.'
    );
    expect(
      within(dialogo).getByRole('button', { name: 'Apagar rascunho' })
    ).toHaveProperty('disabled', false);
  });

  it.each([
    [
      null,
      'Rascunho "Teste pouch" apagado. As imagens dele não saíram do armazém e aparecem como "Sem uso" na tela Imagens.'
    ],
    [
      { apagadas: 1, falharam: 2 },
      'Rascunho "Teste pouch" apagado, com 1 imagem. 2 imagens não saíram do armazém e aparecem como "Sem uso" na tela Imagens.'
    ]
  ])(
    'avisa as imagens que ficaram quando o armazém falha (%o)',
    async (imagens, texto) => {
      apagarRascunho.mockResolvedValue({ ok: true, imagens });
      await abrir();

      const { botao } = await confirmar();

      await userEvent.click(botao);

      await waitFor(() =>
        expect(screen.getByRole('status').textContent).toBe(texto)
      );
    }
  );
});
