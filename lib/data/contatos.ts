/**
 * Contatos padrão da Profills, por setor. Única origem do número e do e-mail
 * usados em UI, SEO e e-mails. Telefones só com dígitos e DDI (formato wa.me).
 * TODO: trocar Suporte e Compras quando o comercial confirmar os números.
 */
export const CONTATO_PADRAO = {
  vendas: {
    telefone: '5541997851998',
    email: 'comercial@profillsdobrasil.com.br'
  },
  suporte: {
    telefone: '5541997851998',
    email: 'suporte@profillsdobrasil.com.br'
  },
  compras: {
    telefone: '5541997851998',
    email: 'compras@profillsdobrasil.com.br'
  }
} as const;
