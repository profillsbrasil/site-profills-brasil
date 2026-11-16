// @vitest-environment node
import { lerImagem } from '@/lib/blog/leitura';

import { GET } from './route';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/blog/leitura', () => ({ lerImagem: vi.fn() }));

const ler = vi.mocked(lerImagem);

const pedir = (slug: string, arquivo: string) =>
  GET(new Request(`http://localhost/blog/${slug}/${arquivo}`), {
    params: Promise.resolve({ slug, arquivo })
  });

const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]);

afterEach(() => {
  ler.mockReset();
});

describe('GET /blog/[slug]/[arquivo]', () => {
  it('serve a imagem com tipo, tamanho e cache imutável', async () => {
    ler.mockResolvedValue({
      corpo: new Blob([png]).stream(),
      tamanho: png.length,
      tipo: 'image/png'
    });

    const resposta = await pedir('fispal', 'foto-0123456789.png');

    expect(resposta.status).toBe(200);
    expect(ler).toHaveBeenCalledWith('/blog/fispal/foto-0123456789.png');
    expect(Object.fromEntries(resposta.headers)).toMatchObject({
      'content-type': 'image/png',
      'content-length': String(png.length),
      'x-content-type-options': 'nosniff',
      'cache-control': 'public, max-age=31536000, immutable'
    });
    expect(new Uint8Array(await resposta.arrayBuffer())).toEqual(png);
  });

  it.each([
    ['fispal', 'foto.gif'],
    ['fispal', 'Foto.png'],
    ['fispal', '..%2Ffoto.png'],
    ['Fispal', 'foto.png'],
    ['fispal', 'foto.svg']
  ])('responde 404 a %s/%s sem tocar no armazém', async (slug, arquivo) => {
    const resposta = await pedir(slug, arquivo);

    expect(resposta.status).toBe(404);
    expect(ler).not.toHaveBeenCalled();
  });

  it('responde 404 com cache curto quando a imagem não existe', async () => {
    ler.mockResolvedValue(null);

    const resposta = await pedir('fispal', 'foto-0123456789.png');

    expect(resposta.status).toBe(404);
    expect(resposta.headers.get('cache-control')).toBe('public, max-age=60');
  });

  it('responde 503 sem cache quando o armazém não responde', async () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {});

    ler.mockRejectedValue(new Error('ECONNREFUSED'));

    const resposta = await pedir('fispal', 'foto-0123456789.png');

    expect(resposta.status).toBe(503);
    expect(resposta.headers.get('cache-control')).toBe('no-store');
    erro.mockRestore();
  });
});
