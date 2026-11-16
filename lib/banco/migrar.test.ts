// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';

import { migrar } from './migrar.mjs';
import { PASTA_MIGRACOES } from './pglite';
import type { Consulta } from './tipos';
import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

async function bancoVazio(): Promise<Consulta> {
  const banco = await PGlite.create();

  return async (sql, valores) =>
    valores
      ? banco.query(sql, valores)
      : ((await banco.exec(sql)).at(-1) ?? { rows: [] });
}

const retrato = async (consulta: Consulta) => ({
  migracoes: (await consulta('select nome from banco_migracao order by nome'))
    .rows,
  posts: (
    await consulta(
      'select slug, estado, versao, atualizado_em from blog_posts order by slug'
    )
  ).rows,
  colunas: (
    await consulta(
      "select column_name, data_type from information_schema.columns where table_name = 'blog_posts' order by column_name"
    )
  ).rows
});

// Cada teste abre um PGlite, que leva segundos com a suíte inteira rodando em paralelo.
describe('migrador do banco', { timeout: 30_000 }, () => {
  it('aplica todas as migrações na primeira vez e nada na segunda', async () => {
    const consulta = await bancoVazio();

    const arquivos = (await readdir(PASTA_MIGRACOES)).filter((n) =>
      n.endsWith('.sql')
    );

    expect(await migrar(consulta, PASTA_MIGRACOES)).toEqual(
      arquivos.toSorted()
    );

    const depoisDaPrimeira = await retrato(consulta);

    expect(await migrar(consulta, PASTA_MIGRACOES)).toEqual([]);
    expect(await retrato(consulta)).toEqual(depoisDaPrimeira);
  });

  it('desfaz a migração que falha e aplica de novo depois de corrigida', async () => {
    const consulta = await bancoVazio();
    const pasta = await mkdtemp(path.join(tmpdir(), 'migracoes-'));

    await writeFile(path.join(pasta, '0000_a.sql'), 'create table a (x int);');
    await writeFile(
      path.join(pasta, '0001_b.sql'),
      'create table b (x int); insert into b values (1); select 1 / 0;'
    );

    await expect(migrar(consulta, pasta)).rejects.toThrow('0001_b.sql');
    expect(
      (await consulta("select to_regclass('b') is null as sem_b")).rows
    ).toEqual([{ sem_b: true }]);
    expect((await consulta('select nome from banco_migracao')).rows).toEqual([
      { nome: '0000_a.sql' }
    ]);

    await writeFile(path.join(pasta, '0001_b.sql'), 'create table b (x int);');

    expect(await migrar(consulta, pasta)).toEqual(['0001_b.sql']);
    await rm(pasta, { recursive: true, force: true });
  });
});
