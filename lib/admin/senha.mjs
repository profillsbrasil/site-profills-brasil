import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const PREFIXO = 'scrypt';
const N = 2 ** 15;
const R = 8;
const P = 1;
const TAMANHO_HASH = 32;

const MEMORIA_MAXIMA = 64 * 1024 * 1024;

const DIGITOS = /^\d+$/;
const BASE64URL = /^[\w-]+$/;

export const TAMANHO_MINIMO_SENHA = 10;

function derivar(senha, sal, custo) {
  return scryptAsync(senha, sal, TAMANHO_HASH, {
    N: custo.n,
    r: custo.r,
    p: custo.p,
    maxmem: MEMORIA_MAXIMA
  });
}

function memoriaDoScryptNoOpenSsl(n, r, p) {
  return 128 * r * (n + 2) + 128 * r * p;
}

function lerHash(texto) {
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

  const custoValido =
    Number.isSafeInteger(n) &&
    n >= N &&
    (n & (n - 1)) === 0 &&
    r === R &&
    p >= 1 &&
    p <= 4 &&
    memoriaDoScryptNoOpenSsl(n, r, p) <= MEMORIA_MAXIMA;

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
