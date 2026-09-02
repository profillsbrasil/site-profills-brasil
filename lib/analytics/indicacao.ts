import { normalizarCodigo } from '@/lib/indicacao/codigo';
import { sendGAEvent } from '@next/third-parties/google';

export type FormularioLead =
  | 'contato'
  | 'catalogo'
  | 'montar-maquina'
  | 'monte-fabrica'
  | 'especificacoes';

type Params = Record<string, string>;

const INTERVALO_MS = 250;
const TENTATIVAS = 40; // 10 s

/* GA e Pixel são instalados por scripts `afterInteractive`, que podem rodar
   depois do efeito que chama este módulo. `sendGAEvent` sem `dataLayer`
   descarta com warn (não enfileira) e `fbq` ausente é no-op, então cada lado
   espera o próprio script existir. Sem GA ou Pixel configurados, desiste em
   silêncio depois de 10 s. Nunca lança. */
function quandoPronto(pronto: () => boolean, acao: () => void) {
  let tentativas = 0;
  const tentar = () => {
    let ok = false;
    try {
      ok = pronto();
    } catch {
      ok = false;
    }
    if (ok) {
      try {
        acao();
      } catch {
        /* dataLayer corrompido por extensão, fbq quebrado: não derruba a página */
      }
      return;
    }
    tentativas += 1;
    if (tentativas >= TENTATIVAS) return;
    window.setTimeout(tentar, INTERVALO_MS);
  };
  tentar();
}

function gaPronto() {
  return typeof window.gtag === 'function' && Array.isArray(window.dataLayer);
}

function metaPronto() {
  return typeof window.fbq === 'function';
}

function enviar(nomeGa: string, nomeMeta: string, params: Params) {
  quandoPronto(gaPronto, () => sendGAEvent('event', nomeGa, params));
  quandoPronto(metaPronto, () => window.fbq?.('trackCustom', nomeMeta, params));
}

/* Código fora do formato do CRM não vira evento: cardinalidade do GA4 é
   finita e a dimensão `codigo_vendedor` só deve receber código válido. */
export function registrarChegadaIndicacao(codigo: string) {
  const valido = normalizarCodigo(codigo);
  if (!valido) return;
  enviar('indicacao_chegada', 'IndicacaoChegada', { codigo_vendedor: valido });
}

export function registrarLeadIndicacao(
  formulario: FormularioLead,
  codigo: string | null
) {
  enviar('indicacao_lead', 'IndicacaoLead', {
    codigo_vendedor: normalizarCodigo(codigo) ?? 'nenhum',
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
