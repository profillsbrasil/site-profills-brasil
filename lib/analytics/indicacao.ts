import { sendGAEvent } from '@next/third-parties/google';

export type FormularioLead =
  | 'contato'
  | 'catalogo'
  | 'montar-maquina'
  | 'monte-fabrica'
  | 'especificacoes';

type Params = Record<string, string>;

/* Nunca deixa analytics quebrar a página: GA ou Pixel ausentes viram no-op. */
function enviar(nomeGa: string, nomeMeta: string, params: Params) {
  try {
    sendGAEvent('event', nomeGa, params);
  } catch {
    /* GA não carregado */
  }
  try {
    window.fbq?.('trackCustom', nomeMeta, params);
  } catch {
    /* Pixel não carregado */
  }
}

export function registrarChegadaIndicacao(codigo: string) {
  enviar('indicacao_chegada', 'IndicacaoChegada', { codigo_vendedor: codigo });
}

export function registrarLeadIndicacao(
  formulario: FormularioLead,
  codigo: string | null
) {
  enviar('indicacao_lead', 'IndicacaoLead', {
    codigo_vendedor: codigo ?? 'nenhum',
    formulario
  });
}

/** Devolve true na primeira chamada por sessão do navegador para este código. */
export function marcarChegadaNaSessao(codigo: string): boolean {
  const chave = `indicacao_registrada:${codigo}`;
  try {
    if (window.sessionStorage.getItem(chave)) return false;
    window.sessionStorage.setItem(chave, '1');
    return true;
  } catch {
    return false; // storage bloqueado: não registra, não quebra
  }
}
