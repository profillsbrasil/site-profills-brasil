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
const ESPERA_MAXIMA_MS = 10_000;
const TENTATIVAS = ESPERA_MAXIMA_MS / INTERVALO_MS;

function rodouSemLancar(acao: () => void) {
  try {
    acao();

    return true;
  } catch {
    return false;
  }
}

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
      rodouSemLancar(acao);

      return;
    }

    tentativas += 1;

    if (tentativas >= TENTATIVAS) return;

    rodouSemLancar(() => window.setTimeout(tentar, INTERVALO_MS));
  };

  tentar();
}

function gaPronto() {
  return window.gtag instanceof Function && Array.isArray(window.dataLayer);
}

function metaPronto() {
  return window.fbq instanceof Function;
}

function enviar(nomeGa: string, nomeMeta: string, params: Params) {
  quandoPronto(gaPronto, () => sendGAEvent('event', nomeGa, params));
  quandoPronto(metaPronto, () => window.fbq?.('trackCustom', nomeMeta, params));
}

/** Código fora do formato do CRM não vira evento. */
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
export function marcarChegadaNaSessao(codigo: string) {
  const chave = `indicacao_registrada:${codigo}`;

  try {
    if (window.sessionStorage.getItem(chave)) return false;
    window.sessionStorage.setItem(chave, '1');

    return true;
  } catch {
    return false;
  }
}
