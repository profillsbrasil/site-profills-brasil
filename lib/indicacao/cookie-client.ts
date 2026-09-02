import type { IndicacaoPayload } from './tipos';

const NOME = 'profills_indicacao';

function base64UrlParaTexto(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const preenchido = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(preenchido), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Valor bruto do cookie da Indicação dentro de um `document.cookie`. */
export function extrairTokenIndicacao(cookieHeader: string): string | null {
  const par = cookieHeader
    .split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${NOME}=`));
  return par ? par.slice(NOME.length + 1) : null;
}

/**
 * Decodifica o payload do cookie sem verificar a assinatura: o browser só
 * mostra o que está lá, e o servidor verifica antes de usar em qualquer envio.
 */
export function lerCookieIndicacaoDoBrowser(
  cookieHeader: string
): IndicacaoPayload | null {
  const token = extrairTokenIndicacao(cookieHeader);
  if (!token) return null;

  const partes = token.split('.');
  if (partes.length !== 3) return null;

  try {
    const dados = JSON.parse(base64UrlParaTexto(partes[1])) as Record<
      string,
      unknown
    >;
    if (
      typeof dados.codigo !== 'string' ||
      typeof dados.nome !== 'string' ||
      typeof dados.email !== 'string' ||
      (typeof dados.contato !== 'string' && dados.contato !== null) ||
      typeof dados.consultadoEm !== 'string'
    ) {
      return null;
    }
    return {
      codigo: dados.codigo,
      nome: dados.nome,
      email: dados.email,
      contato: dados.contato as string | null,
      consultadoEm: dados.consultadoEm
    };
  } catch {
    return null;
  }
}
