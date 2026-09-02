import { act } from 'react';

import { registrarLeadIndicacao } from '@/lib/analytics/indicacao';
import type { CatalogRequestData } from '@/lib/schemas/catalog-request';
import { renderHook } from '@testing-library/react';

import { useCatalogForm } from './useCatalogForm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/analytics/indicacao', () => ({
  registrarLeadIndicacao: vi.fn()
}));
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
});

afterEach(() => {
  vi.unstubAllGlobals();
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
    expect(result.current.status).toBe('idle');
  });
});
