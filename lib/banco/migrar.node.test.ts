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

const PRAZO_PGLITE_SOB_CARGA_MS = 30_000;

describe('migrador do banco', { timeout: PRAZO_PGLITE_SOB_CARGA_MS }, () => {
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

  it('limita a espera pela trava antes de pegá-la', async () => {
    const consulta = await bancoVazio();
    const pasta = await mkdtemp(path.join(tmpdir(), 'migracoes-'));
    const instrucoes: string[] = [];

    await migrar(async (sql, valores) => {
      instrucoes.push(sql);

      return consulta(sql, valores);
    }, pasta);

    expect(instrucoes.slice(0, 2)).toEqual([
      "set lock_timeout = '60s'",
      'select pg_advisory_lock($1)'
    ]);
    expect((await consulta('show lock_timeout')).rows).toEqual([
      { lock_timeout: '1min' }
    ]);
    await rm(pasta, { recursive: true, force: true });
  });

  it('mantém a causa original quando a conexão cai no meio da migração', async () => {
    const consulta = await bancoVazio();
    const pasta = await mkdtemp(path.join(tmpdir(), 'migracoes-'));

    await writeFile(path.join(pasta, '0000_a.sql'), 'select 1 / 0;');

    const caiu: Consulta = async (sql, valores) => {
      if (sql === 'rollback' || sql.includes('pg_advisory_unlock'))
        throw new Error('Connection terminated');

      return consulta(sql, valores);
    };

    await expect(migrar(caiu, pasta)).rejects.toMatchObject({
      message: 'A migração 0000_a.sql falhou, e o rollback também.',
      cause: expect.objectContaining({
        message: expect.stringMatching(/division by zero/)
      })
    });
    await rm(pasta, { recursive: true, force: true });
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
