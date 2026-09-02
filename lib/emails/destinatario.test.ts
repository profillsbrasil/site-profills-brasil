// @vitest-environment node
import { sendLeadNotification } from '@/lib/emails/catalog-request/email-catalog';
import { sendContactEmail } from '@/lib/emails/contact-form/email-contact';
import { sendMontarMaquinaEmail } from '@/lib/emails/montar-maquina/email-montar-maquina';
import { sendMonteFabricaEmail } from '@/lib/emails/monte-fabrica/email-monte-fabrica';
import { sendSpecificationEmail } from '@/lib/emails/solicitar-especificacoes/email-especificacoes';
import type { Destinatario } from '@/lib/indicacao/destinatario';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendMail = vi.fn().mockResolvedValue({ messageId: 'id' });

vi.mock('@/lib/emails/_shared/transporter', () => ({
  createTransporter: () => ({ sendMail })
}));
vi.mock('nodemailer', () => ({
  default: { createTransport: () => ({ sendMail }) },
  createTransport: () => ({ sendMail })
}));
vi.mock('@/lib/utils/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() }
}));

const vendedor: NonNullable<Destinatario['vendedor']> = {
  nome: 'Maria Silva',
  email: 'maria@profills.com.br',
  referral_code: 'MARIA-10',
  contato: null
};
const paraVendedor: Destinatario = { para: 'maria@profills.com.br', vendedor };
const paraCaixa: Destinatario = { para: 'caixa@profills.test', vendedor: null };

const casos = [
  {
    nome: 'contact',
    enviar: (d: Destinatario) =>
      sendContactEmail(
        {
          email: 'lead@x.com',
          phone: '(41) 99999-9999',
          cep: '80010-000',
          street: 'Rua',
          number: '1',
          complement: '',
          neighborhood: 'Centro',
          city: 'Curitiba',
          state: 'PR',
          material: 'aco-inox',
          service: 'corte',
          finish: 'polido',
          details: 'x'
        } as never,
        d
      )
  },
  {
    nome: 'montar-maquina',
    enviar: (d: Destinatario) =>
      sendMontarMaquinaEmail(
        {
          nome: 'Lead',
          email: 'lead@x.com',
          empresa: 'E',
          contato: '(41) 99999-9999',
          detalhes: 'x',
          selectedPackaging: 'Sachê',
          selectedProductType: 'Líquido'
        } as never,
        d
      )
  },
  {
    nome: 'monte-fabrica',
    enviar: (d: Destinatario) =>
      sendMonteFabricaEmail(
        {
          nome: 'Lead',
          email: 'lead@x.com',
          telefone: '(41) 99999-9999',
          empresa: 'E',
          mensagem: 'x'
        } as never,
        d
      )
  },
  {
    nome: 'specifications',
    enviar: (d: Destinatario) =>
      sendSpecificationEmail(
        {
          nome: 'Lead',
          email: 'lead@x.com',
          telefone: '(41) 99999-9999',
          empresa: 'E',
          maquinaSlug: 'x',
          maquinaNome: 'X',
          observacoes: ''
        } as never,
        d
      )
  },
  {
    nome: 'catalog',
    enviar: (d: Destinatario) =>
      sendLeadNotification(
        {
          name: 'Lead',
          document: '000',
          phone: '(41) 99999-9999',
          email: 'lead@x.com'
        } as never,
        d
      )
  }
];

beforeEach(() => {
  sendMail.mockClear();
  process.env.GMAIL_USER_SENDER = 'site@profills.test';
});

describe.each(casos)('envio $nome', ({ enviar }) => {
  it('manda para o vendedor e marca "Indicado por"', async () => {
    await enviar(paraVendedor);
    const opts = sendMail.mock.calls[0][0];
    expect(opts.to).toBe('maria@profills.com.br');
    expect(opts.html).toContain('Indicado por');
    expect(opts.html).toContain('Maria Silva (MARIA-10)');
    expect(opts.text).toContain('Indicado por: Maria Silva (MARIA-10)');
  });

  it('escapa o nome do vendedor no HTML', async () => {
    await enviar({
      para: 'maria@profills.com.br',
      vendedor: { ...vendedor, nome: 'Maria <b>X</b>' }
    });
    const opts = sendMail.mock.calls[0][0];
    expect(opts.html).toContain('&lt;b&gt;');
    expect(opts.html).not.toContain('<b>X');
    expect(opts.text).toContain('Maria <b>X</b> (MARIA-10)');
  });

  it('manda para a caixa padrão sem "Indicado por"', async () => {
    await enviar(paraCaixa);
    const opts = sendMail.mock.calls[0][0];
    expect(opts.to).toBe('caixa@profills.test');
    expect(opts.html).not.toContain('Indicado por');
    expect(opts.text).not.toContain('Indicado por');
  });
});
