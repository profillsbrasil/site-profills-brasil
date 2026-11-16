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

// Em 16/11/2026 um pre-deploy ficou 5 min sem saída até a Railway abortar: cada etapa avisa que
// começou, e um prazo total encerra o processo dizendo onde parou.
const PRAZO_MS = 120_000;
let etapa = 'conectar ao banco';

const prazo = setTimeout(() => {
  console.error(
    `A migração passou de ${PRAZO_MS / 1000} s na etapa "${etapa}" e foi encerrada.`
  );
  process.exit(1);
}, PRAZO_MS);

try {
  console.log('Migração: conectando ao banco.');
  await cliente.connect();

  etapa = 'aplicar as migrações';
  console.log('Migração: conectado, conferindo as migrações.');

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
  etapa = 'fechar a conexão';
  await cliente.end();
  clearTimeout(prazo);
}
