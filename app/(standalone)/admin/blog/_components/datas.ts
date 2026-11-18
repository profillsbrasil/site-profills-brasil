const fuso = 'America/Sao_Paulo';

const formatoHora = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: fuso
});

const formatoData = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: fuso
});

export const horaMinuto = (iso: string) => formatoHora.format(new Date(iso));

export const dataPorExtenso = (iso: string) =>
  formatoData.format(new Date(iso));
