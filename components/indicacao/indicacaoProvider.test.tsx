import { act } from 'react';

import { registrarChegadaIndicacao } from '@/lib/analytics/indicacao';

import { IndicacaoProvider } from './indicacaoProvider';
import { useContatoComercial } from './useContatoComercial';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/* Só o disparo é mockado: `marcarChegadaNaSessao` roda de verdade para o
   teste exercitar o sessionStorage do jsdom. */
vi.mock('@/lib/analytics/indicacao', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/analytics/indicacao')>()),
  registrarChegadaIndicacao: vi.fn()
}));

function jwtFalso(payload: unknown) {
  const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
  return `${b64('{"alg":"HS256"}')}.${b64(JSON.stringify(payload))}.x`;
}

function Sonda() {
  const contato = useContatoComercial();
  return (
    <p>
      <span data-testid='pronto'>{String(contato.pronto)}</span>
      <span data-testid='email'>{contato.email}</span>
    </p>
  );
}

const arvore = (
  <IndicacaoProvider>
    <Sonda />
  </IndicacaoProvider>
);

function cookieDoVendedor(codigo: string) {
  document.cookie = `profills_indicacao=${jwtFalso({
    codigo,
    nome: 'Maria Silva',
    email: 'maria@profills.com.br',
    contato: '11987654321',
    consultadoEm: '2026-09-02T12:00:00.000Z'
  })}; path=/`;
}

async function hidratar() {
  const container = document.createElement('div');
  container.innerHTML = renderToString(arvore);
  document.body.appendChild(container);

  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(container, arvore);
  });

  return {
    container,
    async desmontar() {
      await act(async () => {
        root?.unmount();
      });
      container.remove();
    }
  };
}

beforeEach(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  vi.mocked(registrarChegadaIndicacao).mockClear();
});

afterEach(() => {
  document.cookie = 'profills_indicacao=; max-age=0; path=/';
  window.sessionStorage.clear();
});

describe('IndicacaoProvider', () => {
  it('no HTML do servidor o contato ainda não está pronto', () => {
    const html = renderToString(arvore);
    expect(html).toContain('>false<');
    expect(html).not.toContain('>true<');
  });

  it('depois de hidratar com cookie, mostra o vendedor', async () => {
    document.cookie = `profills_indicacao=${jwtFalso({
      codigo: 'MARIA-10',
      nome: 'Maria Silva',
      email: 'maria@profills.com.br',
      contato: '11987654321',
      consultadoEm: '2026-09-02T12:00:00.000Z'
    })}; path=/`;

    const container = document.createElement('div');
    container.innerHTML = renderToString(arvore);
    document.body.appendChild(container);

    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, arvore);
    });

    expect(container.querySelector('[data-testid="pronto"]')?.textContent).toBe(
      'true'
    );
    expect(container.querySelector('[data-testid="email"]')?.textContent).toBe(
      'maria@profills.com.br'
    );

    await act(async () => {
      root?.unmount();
    });
    container.remove();
  });

  it('registra a chegada uma vez por sessão, com o código do vendedor', async () => {
    cookieDoVendedor('MARIA-10');

    const primeira = await hidratar();
    expect(registrarChegadaIndicacao).toHaveBeenCalledTimes(1);
    expect(registrarChegadaIndicacao).toHaveBeenCalledWith('MARIA-10');
    await primeira.desmontar();

    const segunda = await hidratar();
    expect(registrarChegadaIndicacao).toHaveBeenCalledTimes(1);
    await segunda.desmontar();
  });

  it('sem cookie não registra chegada', async () => {
    const montagem = await hidratar();
    expect(registrarChegadaIndicacao).not.toHaveBeenCalled();
    await montagem.desmontar();
  });
});
