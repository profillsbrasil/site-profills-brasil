import { motivosImagem } from '@/lib/blog/erro';
import { IMAGEM_LIMITE_BYTES } from '@/lib/blog/tipos';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { type EnvioImagem, EnvioImagemContext } from './envio-imagem';
import { EscolherImagem } from './escolher-imagem';
import { describe, expect, it, vi } from 'vitest';

function montar(src: string | null = null) {
  const enviar = vi.fn<EnvioImagem['enviar']>(
    async (arquivo) => `/blog/post/${arquivo.name}`
  );

  const recusar = vi.fn<EnvioImagem['recusar']>();
  const onEscolher = vi.fn<(src: string) => void>();

  render(
    <EnvioImagemContext value={{ enviar, recusar }}>
      <EscolherImagem src={src} rotulo='capa do post' onEscolher={onEscolher} />
    </EnvioImagemContext>
  );

  return { enviar, recusar, onEscolher };
}

function arquivo(nome: string, tipo: string, bytes = 1024) {
  return new File([new Uint8Array(bytes)], nome, { type: tipo });
}

async function soltar(alvo: HTMLElement, solto: File) {
  const dataTransfer = {
    files: [solto],
    items: [{ kind: 'file', type: solto.type, getAsFile: () => solto }],
    types: ['Files'],
    dropEffect: 'none'
  };

  await act(async () => {
    fireEvent.dragEnter(alvo, { dataTransfer });
    fireEvent.dragOver(alvo, { dataTransfer });
    fireEvent.drop(alvo, { dataTransfer });
  });
}

const zona = () => screen.getByRole('button', { name: /capa do post/ });

describe('EscolherImagem ao soltar um arquivo', () => {
  it.each([
    ['capa.png', 'image/png'],
    ['foto.jpg', 'image/jpeg'],
    ['foto.webp', 'image/webp'],
    ['foto.avif', 'image/avif']
  ])('envia %s e devolve o caminho para a prévia', async (nome, tipo) => {
    const { enviar, recusar, onEscolher } = montar();

    await soltar(zona(), arquivo(nome, tipo));

    expect(enviar).toHaveBeenCalledWith(
      expect.objectContaining({ name: nome })
    );
    expect(onEscolher).toHaveBeenCalledWith(`/blog/post/${nome}`);
    expect(recusar).not.toHaveBeenCalled();
  });

  it('envia a imagem de exatamente 5 MB', async () => {
    const { enviar } = montar();

    await soltar(
      zona(),
      arquivo('limite.png', 'image/png', IMAGEM_LIMITE_BYTES)
    );

    expect(enviar).toHaveBeenCalledOnce();
  });

  it.each([
    ['grande.png', 'image/png', IMAGEM_LIMITE_BYTES + 1, motivosImagem.tamanho],
    ['anima.gif', 'image/gif', 1024, motivosImagem.tipo],
    ['nota.txt', 'text/plain', 15, motivosImagem.tipo]
  ])(
    'recusa %s com o motivo certo, sem enviar',
    async (nome, tipo, bytes, motivo) => {
      const { enviar, recusar, onEscolher } = montar();

      await soltar(zona(), arquivo(nome, tipo, bytes));

      expect(recusar).toHaveBeenCalledWith(motivo);
      expect(enviar).not.toHaveBeenCalled();
      expect(onEscolher).not.toHaveBeenCalled();
    }
  );

  it('deixa o anúncio do envio e da recusa para o editor, em pt-BR', async () => {
    montar();

    await soltar(zona(), arquivo('nota.txt', 'text/plain', 15));
    await soltar(zona(), arquivo('capa.png', 'image/png'));
    await act(async () => {
      await new Promise((r) => {
        setTimeout(r, 200);
      });
    });

    expect(document.body.textContent).not.toMatch(/file|accepted|rejected/i);
  });
});
