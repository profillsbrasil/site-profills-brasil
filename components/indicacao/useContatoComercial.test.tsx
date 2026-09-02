import type { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';

import { IndicacaoProvider } from './indicacaoProvider';
import { useContatoComercial } from './useContatoComercial';
import { afterEach, describe, expect, it } from 'vitest';

function jwtFalso(payload: unknown) {
  const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
  return `${b64('{"alg":"HS256"}')}.${b64(JSON.stringify(payload))}.x`;
}

function setCookie(payload: unknown) {
  document.cookie = `profills_indicacao=${jwtFalso(payload)}; path=/`;
}

function wrapper({ children }: { children: ReactNode }) {
  return <IndicacaoProvider>{children}</IndicacaoProvider>;
}

const base = {
  codigo: 'MARIA-10',
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  consultadoEm: '2026-09-02T12:00:00.000Z'
};

afterEach(() => {
  document.cookie = 'profills_indicacao=; max-age=0; path=/';
});

describe('useContatoComercial', () => {
  it('sem cookie: contatos padrão, pronto', () => {
    const { result } = renderHook(() => useContatoComercial(), { wrapper });
    expect(result.current.pronto).toBe(true);
    expect(result.current.email).toBe('comercial@profillsdobrasil.com.br');
    expect(result.current.telefone).toBe('5541997851998');
    expect(result.current.whatsapp('Oi')).toBe(
      'https://wa.me/5541997851998?text=Oi'
    );
  });

  it('com cookie e telefone: tudo do vendedor', () => {
    setCookie({ ...base, contato: '11987654321' });
    const { result } = renderHook(() => useContatoComercial(), { wrapper });
    expect(result.current.pronto).toBe(true);
    expect(result.current.email).toBe('maria@profills.com.br');
    expect(result.current.telefone).toBe('5511987654321');
    expect(result.current.whatsapp('Oi')).toBe(
      'https://wa.me/5511987654321?text=Oi'
    );
  });

  it('com cookie sem telefone: e-mail do vendedor, telefone padrão', () => {
    setCookie({ ...base, contato: null });
    const { result } = renderHook(() => useContatoComercial(), { wrapper });
    expect(result.current.email).toBe('maria@profills.com.br');
    expect(result.current.telefone).toBe('5541997851998');
  });

  it('fora do provider: padrão, pronto (landings standalone)', () => {
    const { result } = renderHook(() => useContatoComercial());
    expect(result.current.pronto).toBe(true);
    expect(result.current.email).toBe('comercial@profillsdobrasil.com.br');
  });
});
