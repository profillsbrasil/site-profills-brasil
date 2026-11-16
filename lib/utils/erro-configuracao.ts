/** Falta ou sobra variável de ambiente; a mensagem cita só nomes, nunca valores. */
export class ErroConfiguracao extends Error {
  override name = 'ErroConfiguracao';
}
