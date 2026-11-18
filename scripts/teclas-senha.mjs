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
 * O que o terminal mostra enquanto a pessoa digita: volta ao começo da linha, limpa e
 * escreve o rótulo com um asterisco por letra. Redesenhar a linha inteira cobre o apagar.
 *
 * @param {string} rotulo
 * @param {string} senha
 */
export const linhaDaSenha = (rotulo, senha) =>
  `\r\x1b[K${rotulo}${'*'.repeat(letras(senha).length)}`;

function ehControleC0OuC1(tecla) {
  const codigo = tecla.codePointAt(0) ?? 0;

  return codigo < 0x20 || (codigo >= 0x7f && codigo <= 0x9f);
}

function fimDaSequenciaDeEsc(teclas, inicio) {
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
  const teclasPorCodePoint = Array.from(texto);
  let atual = senha;

  for (let i = 0; i < teclasPorCodePoint.length; i++) {
    const tecla = teclasPorCodePoint[i];

    if (tecla === '\r' || tecla === '\n') return { senha: atual, fim: 'enter' };

    if (tecla === CTRL_C) return { senha: atual, fim: 'cancelar' };

    if (APAGAR.has(tecla)) atual = letras(atual).slice(0, -1).join('');
    else if (tecla === ESC) i = fimDaSequenciaDeEsc(teclasPorCodePoint, i);
    else if (!ehControleC0OuC1(tecla)) atual += tecla;
  }

  return { senha: atual, fim: null };
}
