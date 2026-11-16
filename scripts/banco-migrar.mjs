// Pre-deploy da Railway: aplica as migrações pendentes antes do next start subir.
// JS puro rodado por node, sem bun nem build, porque roda na imagem de runtime.
import { migrar } from '../lib/banco/migrar.mjs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const url = process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL não está definida: nada foi migrado.');
  process.exit(1);
}

const cliente = new pg.Client({
  connectionString: url,
  connectionTimeoutMillis: 10_000
});

try {
  await cliente.connect();

  const aplicadas = await migrar(
    (sql, valores) => cliente.query(sql, valores),
    fileURLToPath(new URL('../lib/banco/migracoes/', import.meta.url))
  );

  console.log(
    aplicadas.length > 0
      ? `Migrações aplicadas: ${aplicadas.join(', ')}.`
      : 'Nada a migrar.'
  );
} catch (erro) {
  console.error('A migração do banco falhou.', erro);
  process.exitCode = 1;
} finally {
  await cliente.end();
}
