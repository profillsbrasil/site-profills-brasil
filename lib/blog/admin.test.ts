// @vitest-environment node
import { abrirAdminBlog } from './admin';
import { afterEach, describe, expect, it, vi } from 'vitest';

const repositorio = vi.hoisted(() => ({ listar: vi.fn() }));
const sessao = vi.hoisted(() => ({ autorAtual: vi.fn() }));

vi.mock('./repositorio', () => ({ repositorioBlog: repositorio }));

vi.mock('@/lib/admin/sessao', () => sessao);

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('porta de escrita do blog', () => {
  it('abre com a sessão do admin', async () => {
    sessao.autorAtual.mockResolvedValue({ usuario: 'dono' });

    expect(await abrirAdminBlog()).toBe(repositorio);
  });

  it.each(['production', 'development'])(
    'fica fechada sem sessão, também com NODE_ENV=%s',
    async (env) => {
      vi.stubEnv('NODE_ENV', env);
      sessao.autorAtual.mockResolvedValue(null);

      expect(await abrirAdminBlog()).toBeNull();
    }
  );
});
