/** Resposta 200 do CRM em GET /api/external/referral/<code>. */
export type VendedorIndicacao = {
  nome: string;
  email: string;
  /** Sempre em maiúsculas; é o código canônico. */
  referral_code: string;
  /** Só dígitos (DDD + número, sem +55) ou null quando não há telefone. */
  contato: string | null;
};

/** Payload do cookie profills_indicacao. Não contém segredo: é o que a UI mostra. */
export type IndicacaoPayload = {
  codigo: string;
  nome: string;
  email: string;
  contato: string | null;
  /** ISO 8601 da última consulta ao CRM; renova depois de 24 h. */
  consultadoEm: string;
};
