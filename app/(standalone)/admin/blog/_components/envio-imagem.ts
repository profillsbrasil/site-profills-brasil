'use client';

import { createContext, useContext } from 'react';

export type EnvioImagem = {
  /** Grava a imagem e devolve o caminho público, ou null quando falhou. */
  enviar: (arquivo: File) => Promise<string | null>;
  recusar: (motivo: string) => void;
};

export const EnvioImagemContext = createContext<EnvioImagem | null>(null);

export function useEnvioImagem() {
  const envio = useContext(EnvioImagemContext);

  if (!envio)
    throw new Error('EscolherImagem precisa estar dentro do EditorBlog');

  return envio;
}
