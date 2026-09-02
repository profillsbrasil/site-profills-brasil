'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { lerCookieIndicacaoDoBrowser } from '@/lib/indicacao/cookie-client';
import type { IndicacaoPayload } from '@/lib/indicacao/tipos';

export type EstadoIndicacao =
  | { status: 'hidratando' }
  | { status: 'sem-indicacao' }
  | { status: 'indicado'; vendedor: IndicacaoPayload };

const HIDRATANDO: EstadoIndicacao = { status: 'hidratando' };
const SEM_INDICACAO: EstadoIndicacao = { status: 'sem-indicacao' };

const IndicacaoContext = createContext<EstadoIndicacao>(SEM_INDICACAO);

/* useSyncExternalStore exige snapshot estável: cacheia por string do cookie. */
let ultimoCookie: string | null = null;
let ultimoEstado: EstadoIndicacao = SEM_INDICACAO;

function lerEstado(): EstadoIndicacao {
  const cookie = document.cookie;
  if (cookie === ultimoCookie) return ultimoEstado;
  const vendedor = lerCookieIndicacaoDoBrowser(cookie);
  ultimoCookie = cookie;
  ultimoEstado = vendedor ? { status: 'indicado', vendedor } : SEM_INDICACAO;
  return ultimoEstado;
}

/* O cookie só muda por navegação completa (o proxy redireciona), então não
   há evento para assinar: o snapshot é relido a cada render. */
function assinar() {
  return () => {};
}

function estadoServidor() {
  return HIDRATANDO;
}

export function IndicacaoProvider({ children }: { children: ReactNode }) {
  const estado = useSyncExternalStore(assinar, lerEstado, estadoServidor);
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
