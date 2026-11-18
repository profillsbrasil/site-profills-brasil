import { ErroConfiguracao } from '@/lib/utils/erro-configuracao';
import { logger } from '@/lib/utils/logger';

import { abrirPglite } from './pglite';
import type { Consulta } from './tipos';
import path from 'node:path';
import pg from 'pg';
import 'server-only';

function abrir() {
  const url = process.env.DATABASE_URL;

  if (url) {
    const pool = new pg.Pool({
      connectionString: url,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30_000,
      statement_timeout: 10_000
    });

    // WARNING: o pg.Pool emite 'error' quando uma conexão ociosa cai; sem ouvinte, o next start morre.
    pool.on('error', (erro) =>
      logger.error('Conexão ociosa do banco caiu', erro)
    );

    const consulta: Consulta = (sql, valores) => pool.query(sql, valores);

    return Promise.resolve(consulta);
  }

  if (process.env.NODE_ENV === 'development') {
    return abrirPglite(path.join(process.cwd(), '.dados', 'pglite'));
  }

  return Promise.reject(
    new ErroConfiguracao(
      'DATABASE_URL não está definida. Fora do bun dev, o blog exige um Postgres.'
    )
  );
}

const sobreviveAoHmr: typeof globalThis & {
  bancoProfills?: Promise<Consulta>;
} = globalThis;

async function conexao() {
  sobreviveAoHmr.bancoProfills ??= abrir();

  try {
    return await sobreviveAoHmr.bancoProfills;
  } catch (erro) {
    sobreviveAoHmr.bancoProfills = undefined;

    throw erro;
  }
}

/** Abre a conexão na primeira consulta, nunca no import: o build não conecta. */
export const consultar: Consulta = async (sql, valores) =>
  (await conexao())(sql, valores);
