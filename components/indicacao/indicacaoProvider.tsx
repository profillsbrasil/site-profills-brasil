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

function assinar() {
  return () => {};
}

function estadoServidor() {
  return HIDRATANDO;
}

export function IndicacaoProvider({ children }: { children: ReactNode }) {
  const estado = useSyncExternalStore(assinar, lerEstado, estadoServidor);

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
