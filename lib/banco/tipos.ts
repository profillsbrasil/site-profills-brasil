type ValorJson =
  | string
  | number
  | boolean
  | null
  | ValorJson[]
  | { [chave: string]: ValorJson };

/** O que o driver devolve numa coluna: texto, número, data, booleano, nulo ou o JSON já lido do jsonb. */
export type ValorSql = ValorJson | Date;

export type Linha = Record<string, ValorSql>;

/** Consulta com parâmetros posicionais ($1, $2…). Sem valores, aceita várias instruções. */
export type Consulta = (
  sql: string,
  valores?: (string | number | null)[]
) => Promise<{ rows: Linha[] }>;
