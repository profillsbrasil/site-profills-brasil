'use client';

import { CONTATO_PADRAO } from '@/lib/data/contatos';
import { waLink } from '@/lib/utils/whatsapp';

import { useIndicacao } from './indicacaoProvider';

export type ContatoComercial = {
  /** false só enquanto o browser ainda não leu o cookie (hidratação). */
  pronto: boolean;
  email: string;
  /** Só dígitos com DDI, pronto para wa.me. */
  telefone: string;
  whatsapp: (mensagem: string) => string;
};

/**
 * Contato comercial a exibir: o do vendedor quando há Indicação, o padrão
 * caso contrário. Vendedor sem telefone usa o telefone padrão.
 */
export function useContatoComercial(): ContatoComercial {
  const estado = useIndicacao();

  let email: string = CONTATO_PADRAO.vendas.email;
  let telefone: string = CONTATO_PADRAO.vendas.telefone;

  if (estado.status === 'indicado') {
    email = estado.vendedor.email;
    if (estado.vendedor.contato) telefone = `55${estado.vendedor.contato}`;
  }

  return {
    pronto: estado.status !== 'hidratando',
    email,
    telefone,
    whatsapp: (mensagem: string) => waLink(telefone, mensagem)
  };
}
