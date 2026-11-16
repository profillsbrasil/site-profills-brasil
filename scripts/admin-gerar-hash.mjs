// Gera o ADMIN_SENHA_HASH. A senha só entra pelo teclado, sem eco, e o stdout leva só o hash:
//   node scripts/admin-gerar-hash.mjs > ~/.local/state/profills-admin-senha-hash
import { TAMANHO_MINIMO_SENHA, hashSenha } from '../lib/admin/senha.mjs';

const CTRL_C = '\x03';
const APAGAR = new Set(['\x7f', '\b']);

/**
 * Letras como a pessoa vê: um emoji composto conta como uma.
 *
 * @param {string} texto
 */
const letras = (texto) =>
  Array.from(new Intl.Segmenter('pt-BR').segment(texto), (s) => s.segment);

/**
 * @param {string} rotulo
 * @returns {Promise<string>}
 */
function lerSemEco(rotulo) {
  process.stderr.write(rotulo);

  return new Promise((resolve, reject) => {
    let senha = '';

    const terminar = () => {
      process.stdin.off('data', aoDigitar);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stderr.write('\n');
    };

    /** @param {string} texto */
    function aoDigitar(texto) {
      for (const tecla of texto) {
        if (tecla === '\r' || tecla === '\n') {
          terminar();
          resolve(senha);

          return;
        }

        if (tecla === CTRL_C) {
          terminar();
          reject(new Error('Cancelado.'));

          return;
        }

        senha = APAGAR.has(tecla)
          ? letras(senha).slice(0, -1).join('')
          : senha + tecla;
      }
    }

    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', aoDigitar);
  });
}

/** @param {string} motivo */
function falhar(motivo) {
  console.error(motivo);
  process.exit(1);
}

if (process.argv.length > 2)
  falhar(
    'A senha não entra por argumento. Rode sem argumentos e digite no terminal.'
  );

if (!process.stdin.isTTY)
  falhar('Rode num terminal: a senha é lida do teclado, sem eco.');

// O hash não abre o admin sozinho, mas não tem por que ficar no histórico do terminal.
if (process.stdout.isTTY)
  falhar(
    'Redirecione a saída para um arquivo: node scripts/admin-gerar-hash.mjs > arquivo'
  );

try {
  const senha = await lerSemEco('Senha: ');

  if (letras(senha).length < TAMANHO_MINIMO_SENHA)
    throw new Error(
      `A senha precisa de ${TAMANHO_MINIMO_SENHA} caracteres ou mais.`
    );

  if ((await lerSemEco('Repita a senha: ')) !== senha)
    throw new Error('As duas senhas não conferem.');

  process.stdout.write(`${await hashSenha(senha)}\n`);
  console.error(
    'Hash gravado. Cadastre o conteúdo do arquivo em ADMIN_SENHA_HASH.'
  );
} catch (erro) {
  falhar(erro instanceof Error ? erro.message : String(erro));
}
