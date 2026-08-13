import { WHATSAPP_VENDAS, waLink } from './whatsapp';
import { describe, expect, it } from 'vitest';

describe('waLink', () => {
  it('monta URL do wa.me com mensagem URL-encoded', () => {
    expect(waLink(WHATSAPP_VENDAS, 'Olá, tenho interesse')).toBe(
      'https://wa.me/5541997851998?text=Ol%C3%A1%2C%20tenho%20interesse'
    );
  });
});
