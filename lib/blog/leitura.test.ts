// @vitest-environment node
import { lerPublicado } from './leitura';
import { repositorioBlog } from './repositorio';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('next/server', () => ({ connection: vi.fn(async () => {}) }));

vi.mock('./repositorio', () => ({
  repositorioBlog: { lerPublicado: vi.fn(async () => null) }
}));

describe('lerPublicado', () => {
  it('slug fora do formato dá null sem consultar o banco', async () => {
    for (const slug of ['UPPER', '../etc', 'a'.repeat(300), 'com espaço']) {
      expect(await lerPublicado(slug)).toBeNull();
    }

    expect(repositorioBlog.lerPublicado).not.toHaveBeenCalled();
  });
});
