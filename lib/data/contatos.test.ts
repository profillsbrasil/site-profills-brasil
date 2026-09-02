import { EMAIL_COMERCIAL, TELEFONE_VENDAS } from '@/lib/seo/site';
import { WHATSAPP_VENDAS } from '@/lib/utils/whatsapp';

import { CONTATO_PADRAO } from './contatos';
import { describe, expect, it } from 'vitest';

describe('CONTATO_PADRAO', () => {
  it('é a origem de site.ts e whatsapp.ts', () => {
    expect(WHATSAPP_VENDAS).toBe(CONTATO_PADRAO.vendas.telefone);
    expect(TELEFONE_VENDAS).toBe(`+${CONTATO_PADRAO.vendas.telefone}`);
    expect(EMAIL_COMERCIAL).toBe(CONTATO_PADRAO.vendas.email);
  });

  it('só tem dígitos com DDI nos telefones', () => {
    for (const setor of Object.values(CONTATO_PADRAO)) {
      expect(setor.telefone).toMatch(/^55\d{10,11}$/);
    }
  });
});
