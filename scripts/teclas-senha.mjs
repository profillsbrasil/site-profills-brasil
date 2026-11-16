// Fora do script para o teste: o script tem efeito no topo (lê o terminal e sai).
const CTRL_C = '\x03';
const ESC = '\x1b';
const APAGAR = new Set(['\x7f', '\b']);

/**
 * Letras como a pessoa vê: um emoji composto conta como uma.
 *
 * @param {string} texto
 */
export const letras = (texto) =>
  Array.from(new Intl.Segmenter('pt-BR').segment(texto), (s) => s.segment);

/**
 * Ctrl-D, Tab e os outros controles C0 e C1 não são letra de senha.
 *
 * @param {string} tecla
 */
function controle(tecla) {
  const codigo = tecla.codePointAt(0) ?? 0;

  return codigo < 0x20 || (codigo >= 0x7f && codigo <= 0x9f);
}

/**
 * Índice do último caractere da sequência que começa no Esc em `inicio`: setas e teclas
 * de função mandam Esc [ parâmetros e uma letra final, ou Esc O e uma letra.
 *
 * @param {string[]} teclas
 * @param {number} inicio
 */
function fimDaSequencia(teclas, inicio) {
  if (teclas[inicio + 1] === 'O') return inicio + 2;

  if (teclas[inicio + 1] !== '[') return inicio;

  let fim = inicio + 2;

  while (fim < teclas.length && !/[@-~]/.test(teclas[fim])) fim++;

  return fim;
}

/**
 * Aplica à senha um pedaço lido do terminal em modo raw. Controles e sequências
 * de Esc ficam de fora: a senha guarda só o que a pessoa digitou como letra.
 *
 * @param {string} senha
 * @param {string} texto
 * @returns {{ senha: string; fim: 'enter' | 'cancelar' | null }}
 */
export function digitar(senha, texto) {
  // Por code point, e não por letra: o Esc e o [ da seta precisam sair separados.
  const teclas = Array.from(texto);
  let atual = senha;

  for (let i = 0; i < teclas.length; i++) {
    const tecla = teclas[i];

    if (tecla === '\r' || tecla === '\n') return { senha: atual, fim: 'enter' };

    if (tecla === CTRL_C) return { senha: atual, fim: 'cancelar' };

    if (APAGAR.has(tecla)) atual = letras(atual).slice(0, -1).join('');
    else if (tecla === ESC) i = fimDaSequencia(teclas, i);
    else if (!controle(tecla)) atual += tecla;
  }

  return { senha: atual, fim: null };
}
