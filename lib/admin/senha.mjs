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

const DIGITOS = /^\d+$/;
const BASE64URL = /^[\w-]+$/;

// 10 e não 16 por pedido do dono em 16/11/2026: o scrypt e o limite de 10 tentativas por janela seguram a força bruta.
export const TAMANHO_MINIMO_SENHA = 10;

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
  // O script grava o hash com \n no fim, e a env pode guardar a linha inteira.
  const partes = texto.trim().split(':');

  if (partes.length !== 6 || partes[0] !== PREFIXO) return null;

  const textoCusto = partes.slice(1, 4);

  if (
    !textoCusto.every((v) => DIGITOS.test(v)) ||
    !partes.slice(4).every((v) => BASE64URL.test(v))
  )
    return null;

  const [n, r, p] = textoCusto.map(Number);
  const sal = Buffer.from(partes[4], 'base64url');
  const hash = Buffer.from(partes[5], 'base64url');

  // Custo abaixo do padrão enfraquece a senha; acima, o scrypt lança ou ocupa a memória do servidor.
  // A conta de memória é a do OpenSSL: 128 * r * (N + 2) do vetor mais 128 * r * p dos blocos.
  const custoValido =
    Number.isSafeInteger(n) &&
    n >= N &&
    (n & (n - 1)) === 0 &&
    r === R &&
    p >= 1 &&
    p <= 4 &&
    128 * r * (n + 2 + p) <= MEMORIA_MAXIMA;

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
