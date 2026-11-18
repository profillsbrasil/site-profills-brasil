import { rotaClassificada, temaDoTopo } from '@/components/layout/temaDoTopo';

import { readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SITE = path.join(process.cwd(), 'app/(site)');

function rotasNoDisco() {
  return readdirSync(SITE, { recursive: true, encoding: 'utf8' })
    .filter((f) => path.basename(f) === 'page.tsx')
    .map((f) => {
      const segmentos = path
        .dirname(f)
        .split(path.sep)
        .filter((s) => s !== '.' && !/^\(.*\)$/.test(s));

      return `/${segmentos.join('/')}`;
    })
    .sort();
}

describe('tema do topo', () => {
  it('toda página de app/(site) está na tabela', () => {
    const rotas = rotasNoDisco();
    expect(rotas).toContain('/');
    expect(rotas).toContain('/sobre');

    const soltas = rotas.filter((r) => rotaClassificada(r) === null);
    expect(soltas, 'classifique em TEMA_POR_ROTA').toEqual([]);
  });

  it.each([
    ['/', 'navy'],
    ['/maquinas', 'navy'],
    ['/maquinas/envasadora-gable-top-gt', 'navy'],
    ['/blog/um-post', 'navy'],
    ['/sobre', 'claro'],
    ['/clientes', 'claro'],
    ['/projetos/profills-erp', 'claro'],
    ['/sobremesa', 'navy'],
    ['/rota-que-nao-existe', 'navy']
  ] as const)('%s é %s', (pathname, tema) => {
    expect(temaDoTopo(pathname)).toBe(tema);
  });
});
