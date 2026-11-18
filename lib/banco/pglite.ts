import { migrar } from './migrar.mjs';
import type { Consulta } from './tipos';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

export const PASTA_MIGRACOES = path.join(
  process.cwd(),
  'lib',
  'banco',
  'migracoes'
);

/**
 * Postgres em WASM, já migrado, para o bun dev e os testes. Sem pasta, fica só na memória.
 * Import dinâmico: o pacote é devDependency e nunca carrega em produção.
 */
export async function abrirPglite(pasta?: string) {
  const { PGlite } = await import('@electric-sql/pglite');

  if (pasta) await mkdir(path.dirname(pasta), { recursive: true });

  const banco = await PGlite.create(pasta);

  const consulta: Consulta = async (sql, valores) =>
    valores
      ? banco.query(sql, valores)
      : ((await banco.exec(sql)).at(-1) ?? { rows: [] });

  await migrar(consulta, PASTA_MIGRACOES);

  return consulta;
}
