import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// Chave do pg_advisory_lock: dois deploys ao mesmo tempo migram um depois do outro.
const TRAVA = 20261116;

// Uma sessão presa com a trava ou com lock de tabela falha o pre-deploy em vez de travá-lo até o timeout da Railway.
const ESPERA_TRAVA = '60s';

/**
 * Aplica, em ordem de nome, os arquivos .sql da pasta que ainda não estão em banco_migracao.
 * Cada arquivo roda numa transação junto com o próprio registro: uma falha não deixa migração pela metade,
 * e a próxima execução tenta de novo do mesmo ponto.
 *
 * @param {(sql: string, valores?: (string | number | null)[]) => Promise<{ rows: Record<string, unknown>[] }>} consulta
 *   uma sessão só, porque o lock é da sessão; sem valores, aceita várias instruções
 * @param {string} pasta
 * @returns {Promise<string[]>} os arquivos aplicados nesta execução
 */
export async function migrar(consulta, pasta) {
  const arquivos = (await readdir(pasta))
    .filter((nome) => nome.endsWith('.sql'))
    .toSorted();

  await consulta(`set lock_timeout = '${ESPERA_TRAVA}'`);
  await consulta('select pg_advisory_lock($1)', [TRAVA]);

  let falha;

  try {
    await consulta(
      'create table if not exists banco_migracao (nome text primary key, aplicada_em timestamptz not null default now())'
    );

    const { rows } = await consulta('select nome from banco_migracao');
    const feitas = new Set(rows.map((linha) => linha.nome));

    return await aplicar(
      consulta,
      pasta,
      arquivos.filter((nome) => !feitas.has(nome))
    );
  } catch (erro) {
    falha = erro;

    throw erro;
  } finally {
    // Com a conexão caída, o erro do unlock esconderia a causa; a trava some com a sessão.
    await consulta('select pg_advisory_unlock($1)', [TRAVA]).catch(
      (erroUnlock) => {
        if (falha === undefined) throw erroUnlock;
      }
    );
  }
}

/** Uma de cada vez e em ordem: a migração seguinte pode depender da anterior. */
async function aplicar(consulta, pasta, pendentes) {
  const [nome, ...resto] = pendentes;

  if (nome === undefined) return [];

  const sql = await readFile(path.join(pasta, nome), 'utf8');

  await consulta('begin');

  try {
    await consulta(sql);
    await consulta('insert into banco_migracao (nome) values ($1)', [nome]);
    await consulta('commit');
  } catch (erro) {
    const desfeita = await consulta('rollback').then(
      () => true,
      () => false
    );

    throw new Error(
      desfeita
        ? `A migração ${nome} falhou.`
        : `A migração ${nome} falhou, e o rollback também.`,
      { cause: erro }
    );
  }

  return [nome, ...(await aplicar(consulta, pasta, resto))];
}
