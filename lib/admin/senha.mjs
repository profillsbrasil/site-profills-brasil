// JS puro: o script scripts/admin-gerar-hash.mjs roda por node, sem build, e usa este mesmo arquivo.
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const PREFIXO = 'scrypt';
const N = 2 ** 15;
const R = 8;
const P = 1;
const TAMANHO_HASH = 32;

// 128 * N * r dá 32 MB, o mesmo maxmem padrão do node, que recusa esse custo.
const MEMORIA_MAXIMA = 64 * 1024 * 1024;

export const TAMANHO_MINIMO_SENHA = 16;

/**
 * @param {string} senha
 * @param {Buffer} sal
 * @param {{ n: number; r: number; p: number }} custo
 * @returns {Promise<Buffer>}
 */
function derivar(senha, sal, custo) {
  return scryptAsync(senha, sal, TAMANHO_HASH, {
    N: custo.n,
    r: custo.r,
    p: custo.p,
    maxmem: MEMORIA_MAXIMA
  });
}

/**
 * Lê "scrypt:<N>:<r>:<p>:<sal>:<hash>", com sal e hash em base64url. Sem `$`, o valor
 * passa por .env e pela Railway sem virar interpolação.
 *
 * @param {string} texto
 * @returns {{ n: number; r: number; p: number; sal: Buffer; hash: Buffer } | null}
 */
function lerHash(texto) {
  const partes = texto.split(':');

  if (partes.length !== 6 || partes[0] !== PREFIXO) return null;

  const [n, r, p] = partes.slice(1, 4).map(Number);
  const sal = Buffer.from(partes[4], 'base64url');
  const hash = Buffer.from(partes[5], 'base64url');

  // Custo fora disso faz o scrypt lançar ou ocupar a memória do servidor.
  const custoValido =
    [n, r, p].every((v) => Number.isSafeInteger(v) && v > 0) &&
    n > 1 &&
    (n & (n - 1)) === 0 &&
    p <= 4 &&
    128 * n * r <= MEMORIA_MAXIMA;

  if (!custoValido || sal.length < 16 || hash.length !== TAMANHO_HASH)
    return null;

  return { n, r, p, sal, hash };
}

/**
 * @param {string} texto
 * @returns {boolean}
 */
export function hashValido(texto) {
  return lerHash(texto) !== null;
}

/**
 * @param {string} senha
 * @returns {Promise<string>}
 */
export async function hashSenha(senha) {
  const sal = randomBytes(16);
  const hash = await derivar(senha, sal, { n: N, r: R, p: P });

  return [
    PREFIXO,
    N,
    R,
    P,
    sal.toString('base64url'),
    hash.toString('base64url')
  ].join(':');
}

/**
 * Compara em tempo constante. Hash fora do formato nunca confere.
 *
 * @param {string} senha
 * @param {string} guardado
 * @returns {Promise<boolean>}
 */
export async function conferirSenha(senha, guardado) {
  const lido = lerHash(guardado);

  if (!lido) return false;

  return timingSafeEqual(await derivar(senha, lido.sal, lido), lido.hash);
}
