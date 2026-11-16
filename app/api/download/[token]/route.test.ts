import { NextRequest } from 'next/server';

import { GET } from './route';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/utils/jwt-catalog', () => ({
  verifyCatalogToken: vi.fn(async () => ({ ok: false, reason: 'invalid' }))
}));

describe('GET /api/download/[token]', () => {
  it('redireciona token inválido sem depender do host interno do servidor', async () => {
    const request = new NextRequest(
      'http://localhost:8080/api/download/token-invalido'
    );

    const resposta = await GET(request, {
      params: Promise.resolve({ token: 'token-invalido' })
    });

    expect(resposta.status).toBe(302);
    expect(resposta.headers.get('location')).toBe('/download?error=invalid');
  });
});
