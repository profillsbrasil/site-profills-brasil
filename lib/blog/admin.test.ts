// @vitest-environment node
import { abrirAdminBlog } from './admin';
import { afterEach, describe, expect, it, vi } from 'vitest';

const repositorio = vi.hoisted(() => ({ listar: vi.fn() }));

vi.mock('./repositorio', () => ({ repositorioBlog: repositorio }));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('porta de escrita do blog', () => {
  it.each(['production', 'test'])(
    'fica fechada com NODE_ENV=%s',
    async (env) => {
      vi.stubEnv('NODE_ENV', env);

      expect(await abrirAdminBlog()).toBeNull();
    }
  );

  it('abre no bun dev', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    expect(await abrirAdminBlog()).toBe(repositorio);
  });
});
