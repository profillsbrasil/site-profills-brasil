import { act } from 'react';

import { registrarLeadIndicacao } from '@/lib/analytics/indicacao';
import type { CatalogRequestData } from '@/lib/schemas/catalog-request';
import { sendGAEvent } from '@next/third-parties/google';
import { renderHook } from '@testing-library/react';

import { useCatalogForm } from './useCatalogForm';
import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/* Espião em cima da função REAL: as asserções de argumento continuam valendo e
   o caso "analytics falha" exercita o engolir-erro de verdade, sem depender de
   try/catch nos 5 call sites. */
vi.mock('@/lib/analytics/indicacao', async (importOriginal) => {
  const real =
    await importOriginal<typeof import('@/lib/analytics/indicacao')>();
  return { registrarLeadIndicacao: vi.fn(real.registrarLeadIndicacao) };
});
vi.mock('@next/third-parties/google', () => ({ sendGAEvent: vi.fn() }));
vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() }
}));

const valores: CatalogRequestData = {
  name: 'Teste Unitário',
  document: '52998224725',
  phone: '(41) 99999-9999',
  email: 'teste@example.com'
};

function respostaOk(corpo: unknown) {
  return {
    ok: true,
    json: async () => corpo
  } as Response;
}

beforeEach(() => {
  vi.mocked(registrarLeadIndicacao).mockClear();
  vi.mocked(sendGAEvent).mockReset();
  vi.mocked(toast.error).mockClear();
  /* registrarLeadIndicacao chama a implementação real, que só dispara na
     hora se GA, dataLayer e Pixel já estiverem "prontos"; os três stubs
     deixam a primeira tentativa síncrona, sem sobrar timer pendente (do GA
     ou do Meta) entre os testes. */
  window.gtag = vi.fn();
  window.dataLayer = [];
  window.fbq = vi.fn();
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete window.gtag;
  delete window.dataLayer;
  delete window.fbq;
});

describe('useCatalogForm', () => {
  it('registra o lead com o código devolvido pela rota', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          respostaOk({ success: true, indicacao: { codigo: 'MARIA-10' } })
        )
    );

    const { result } = renderHook(() => useCatalogForm());
    await act(async () => {
      await result.current.onSubmit(valores);
    });

    expect(registrarLeadIndicacao).toHaveBeenCalledWith('catalogo', 'MARIA-10');
    expect(result.current.status).toBe('success');
  });

  it('sem indicação registra o lead com código nulo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(respostaOk({ success: true, indicacao: null }))
    );

    const { result } = renderHook(() => useCatalogForm());
    await act(async () => {
      await result.current.onSubmit(valores);
    });

    expect(registrarLeadIndicacao).toHaveBeenCalledWith('catalogo', null);
  });

  it('não registra lead quando a rota falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Erro' })
      } as Response)
    );

    const { result } = renderHook(() => useCatalogForm());
    await act(async () => {
      await result.current.onSubmit(valores);
    });

    expect(registrarLeadIndicacao).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
    expect(result.current.status).toBe('idle');
  });

  it('analytics quebrado não derruba o envio', async () => {
    vi.mocked(sendGAEvent).mockImplementation(() => {
      throw new Error('dataLayer corrompido');
    });
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          respostaOk({ success: true, indicacao: { codigo: 'MARIA-10' } })
        )
    );

    const { result } = renderHook(() => useCatalogForm());
    await act(async () => {
      await result.current.onSubmit(valores);
    });

    expect(result.current.status).toBe('success');
    expect(toast.error).not.toHaveBeenCalled();
  });
});
