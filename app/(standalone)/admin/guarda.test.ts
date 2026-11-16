// @vitest-environment node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const PASTA = path.join(process.cwd(), 'app', '(standalone)', 'admin');

// O login é a única entrada sem sessão: entrar cria a sessão, e sair só apaga o cookie.
const SEM_SESSAO = ['entrar/'];

const ENTRADA = /(^|\/)(page\.tsx|route\.ts|acoes\.ts)$/;

async function arquivosDoAdmin() {
  const nomes = await readdir(PASTA, { recursive: true });

  return nomes.map((nome) => nome.split(path.sep).join('/'));
}

describe('guarda do admin', () => {
  it('não sobra rota com o sufixo .dev', async () => {
    expect(
      (await arquivosDoAdmin()).filter((nome) => /\.dev\.[jt]sx?$/.test(nome))
    ).toEqual([]);
  });

  it('toda página, action e route handler fora do login passa por abrirAdminBlog', async () => {
    const entradas = (await arquivosDoAdmin()).filter(
      (nome) =>
        ENTRADA.test(nome) &&
        !SEM_SESSAO.some((livre) => nome.startsWith(livre))
    );

    expect(entradas).toEqual(
      expect.arrayContaining([
        'blog/page.tsx',
        'blog/novo/page.tsx',
        'blog/[slug]/page.tsx',
        'blog/[slug]/imagem/route.ts',
        'blog/acoes.ts'
      ])
    );

    for (const nome of entradas) {
      const codigo = await readFile(path.join(PASTA, nome), 'utf8');

      expect(codigo, nome).toContain('await abrirAdminBlog()');
    }
  });
});
