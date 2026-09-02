'use client';

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore
} from 'react';
import type { ReactNode } from 'react';

import {
  marcarChegadaNaSessao,
  registrarChegadaIndicacao
} from '@/lib/analytics/indicacao';
import {
  extrairTokenIndicacao,
  lerCookieIndicacaoDoBrowser
} from '@/lib/indicacao/cookie-client';
import type { IndicacaoPayload } from '@/lib/indicacao/tipos';

export type EstadoIndicacao =
  | { status: 'hidratando' }
  | { status: 'sem-indicacao' }
  | { status: 'indicado'; vendedor: IndicacaoPayload };

const HIDRATANDO: EstadoIndicacao = { status: 'hidratando' };
const SEM_INDICACAO: EstadoIndicacao = { status: 'sem-indicacao' };

const IndicacaoContext = createContext<EstadoIndicacao>(SEM_INDICACAO);

/* useSyncExternalStore exige snapshot estável: cacheia pelo valor do cookie
   da Indicação, não pelo `document.cookie` inteiro — analytics e afins
   escrevem cookies o tempo todo e invalidariam o cache à toa. */
let ultimoToken: string | null = null;
let ultimoEstado: EstadoIndicacao = SEM_INDICACAO;

function lerEstado(): EstadoIndicacao {
  const cookie = document.cookie;
  const token = extrairTokenIndicacao(cookie);
  if (token === ultimoToken) return ultimoEstado;
  const vendedor = lerCookieIndicacaoDoBrowser(cookie);
  ultimoToken = token;
  ultimoEstado = vendedor ? { status: 'indicado', vendedor } : SEM_INDICACAO;
  return ultimoEstado;
}

/* Não há evento de mudança de cookie para assinar. O cookie pode mudar numa
   resposta de navegação client-side; a UI só reflete no próximo render ou
   reload, e isso é aceito (decisão 9 da spec). */
function assinar() {
  return () => {};
}

function estadoServidor() {
  return HIDRATANDO;
}

export function IndicacaoProvider({ children }: { children: ReactNode }) {
  const estado = useSyncExternalStore(assinar, lerEstado, estadoServidor);

  /* Chegada pelo link do vendedor: só no cliente, uma vez por sessão do
     navegador. `estado` só troca de referência quando o token do cookie
     muda, então o efeito não repete a cada render. */
  useEffect(() => {
    if (estado.status !== 'indicado') return;
    const codigo = estado.vendedor.codigo;
    if (marcarChegadaNaSessao(codigo)) registrarChegadaIndicacao(codigo);
  }, [estado]);

  return (
    <IndicacaoContext.Provider value={estado}>
      {children}
    </IndicacaoContext.Provider>
  );
}

/** Fora do Provider (grupo standalone) devolve sem-indicacao. */
export function useIndicacao(): EstadoIndicacao {
  return useContext(IndicacaoContext);
}
