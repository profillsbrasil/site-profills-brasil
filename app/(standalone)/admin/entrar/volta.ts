import { z } from 'zod';

const PADRAO = '/admin/blog';

// Só caminho do próprio admin, com as letras de um slug: nada de //, \\, .., query ou host.
const voltaSchema = z.string().regex(/^\/admin\/[a-z0-9/-]*$/);

/** Para onde o login devolve. Qualquer valor fora do admin cai na lista de posts. */
export function voltaSegura(
  valor: FormDataEntryValue | string[] | null | undefined
) {
  const lido = voltaSchema.safeParse(valor);

  return lido.success ? lido.data : PADRAO;
}

/** Endereço relativo do login: atrás do proxy da Railway, o host do request é interno. */
export function enderecoDeEntrada(volta: string) {
  return `/admin/entrar?${new URLSearchParams({ volta: voltaSegura(volta) })}`;
}
