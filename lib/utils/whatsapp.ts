import { CONTATO_PADRAO } from '@/lib/data/contatos';

export const WHATSAPP_VENDAS = CONTATO_PADRAO.vendas.telefone;

export function waLink(numero: string, mensagem: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
