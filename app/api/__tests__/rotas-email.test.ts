import type { NextRequest } from 'next/server';

import { beforeEach, describe, expect, it, vi } from 'vitest';

/* Falha de envio de e-mail NÃO pode virar "sucesso" para o visitante:
   antes, 4 rotas engoliam o erro do sendMail num try/catch interno e
   respondiam 200/success:true com a solicitação perdida. O contrato agora:
   envio ok → 200; envio falhou → 500 com success:false (o client mostra
   o toast de erro e o visitante tenta de novo). */

vi.mock('@/lib/emails/monte-fabrica/email-monte-fabrica', () => ({
  sendMonteFabricaEmail: vi.fn()
}));
vi.mock('@/lib/emails/montar-maquina/email-montar-maquina', () => ({
  sendMontarMaquinaEmail: vi.fn()
}));
vi.mock('@/lib/emails/solicitar-especificacoes/email-especificacoes', () => ({
  sendSpecificationEmail: vi.fn()
}));
vi.mock('@/lib/emails/contact-form/email-contact', () => ({
  sendContactEmail: vi.fn()
}));
vi.mock('@/lib/utils/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() }
}));

import { sendContactEmail } from '@/lib/emails/contact-form/email-contact';
import { sendMontarMaquinaEmail } from '@/lib/emails/montar-maquina/email-montar-maquina';
import { sendMonteFabricaEmail } from '@/lib/emails/monte-fabrica/email-monte-fabrica';
import { sendSpecificationEmail } from '@/lib/emails/solicitar-especificacoes/email-especificacoes';

import { POST as postContact } from '../contact/route';
import { POST as postMontarMaquina } from '../montar-maquina/route';
import { POST as postMonteFabrica } from '../monte-fabrica/route';
import { POST as postSpecifications } from '../specifications/route';

function req(payload: unknown): NextRequest {
  return new Request('http://localhost/api/teste', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }) as unknown as NextRequest;
}

const casos = [
  {
    nome: 'monte-fabrica',
    post: postMonteFabrica,
    sendMock: sendMonteFabricaEmail,
    payload: {
      nome: 'Teste Unitário',
      email: 'teste@example.com',
      telefone: '(41) 99999-9999',
      empresa: 'Empresa Teste',
      mensagem: 'Mensagem de teste com tamanho suficiente.'
    }
  },
  {
    nome: 'montar-maquina',
    post: postMontarMaquina,
    sendMock: sendMontarMaquinaEmail,
    payload: {
      nome: 'Teste Unitário',
      email: 'teste@example.com',
      empresa: 'Empresa Teste',
      contato: '(41) 99999-9999',
      detalhes: 'Detalhes de teste com tamanho suficiente.',
      selectedPackaging: 'Sachê',
      selectedProductType: 'Líquido'
    }
  },
  {
    nome: 'specifications',
    post: postSpecifications,
    sendMock: sendSpecificationEmail,
    payload: {
      nome: 'Teste Unitário',
      email: 'teste@example.com',
      telefone: '(41) 99999-9999',
      empresa: 'Empresa Teste',
      maquinaSlug: 'envasadora-stand-up-pouch-speed',
      maquinaNome: 'Linha Pouch Speed',
      observacoes: 'Observações de teste.'
    }
  },
  {
    nome: 'contact',
    post: postContact,
    sendMock: sendContactEmail,
    payload: {
      email: 'teste@example.com',
      phone: '(41) 99999-9999',
      cep: '80010-000',
      street: 'Rua Teste',
      number: '123',
      complement: '',
      neighborhood: 'Centro',
      city: 'Curitiba',
      state: 'PR',
      material: 'Papelão',
      service: 'Embalagem personalizada',
      finish: 'Fosco',
      details: 'Detalhes de teste.'
    }
  }
];

describe.each(casos)('POST /api/$nome', ({ post, sendMock, payload }) => {
  beforeEach(() => {
    vi.mocked(sendMock).mockReset();
  });

  it('responde 200 quando o e-mail é enviado', async () => {
    vi.mocked(sendMock).mockResolvedValue(undefined as never);
    const res = await post(req(payload));
    const corpo = await res.json();
    expect(res.status).toBe(200);
    expect(corpo.success).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it('responde 500 quando o envio de e-mail falha', async () => {
    vi.mocked(sendMock).mockRejectedValue(new Error('SMTP indisponível'));
    const res = await post(req(payload));
    const corpo = await res.json();
    expect(res.status).toBe(500);
    expect(corpo.success).toBe(false);
  });
});
