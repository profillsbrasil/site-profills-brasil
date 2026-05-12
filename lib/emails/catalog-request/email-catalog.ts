import type { CatalogRequestData } from '@/lib/schemas/catalog-request';
import { createTransporter } from '@/lib/emails/_shared/transporter';
import {
  readTemplate,
  renderTemplate
} from '@/lib/emails/_shared/template-engine';
import { logger } from '@/lib/utils/logger';

const getSiteUrl = () => process.env.SITE_URL || 'https://profills.com.br';

const nowSaoPaulo = () =>
  new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

export interface SendClientCatalogEmailInput {
  name: string;
  email: string;
  downloadUrl: string;
}

export async function sendClientCatalogEmail(
  input: SendClientCatalogEmailInput
) {
  const transporter = createTransporter();
  const siteUrl = getSiteUrl();
  const subject = 'Seu catálogo Profills está pronto';

  const html = renderTemplate(
    readTemplate('lib/emails/catalog-request/email-template-client.html'),
    {
      subject,
      preheader: 'Acesse o catálogo completo da Profills',
      name: input.name,
      downloadUrl: input.downloadUrl,
      siteUrl
    }
  );

  const text = [
    `Olá, ${input.name}!`,
    '',
    'Seu catálogo Profills está pronto. Baixe pelo link abaixo:',
    input.downloadUrl,
    '',
    'Link válido por 7 dias.',
    '',
    'Profills Brasil'
  ].join('\n');

  try {
    const result = await transporter.sendMail({
      from: {
        name: 'Profills Brasil',
        address: process.env.GMAIL_USER_SENDER!
      },
      to: input.email,
      subject,
      html,
      text
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('❌ Erro ao enviar email do catálogo (cliente):', error);
    throw new Error('Falha no envio do email do catálogo');
  }
}

export async function sendLeadNotification(data: CatalogRequestData) {
  const transporter = createTransporter();
  const subject = `Nova solicitação de catálogo — ${data.name}`;
  const timestamp = nowSaoPaulo();

  const html = renderTemplate(
    readTemplate('lib/emails/catalog-request/email-template-internal.html'),
    {
      name: data.name,
      document: data.document,
      phone: data.phone,
      email: data.email,
      timestamp
    }
  );

  const text = [
    'Nova solicitação de catálogo',
    `Nome: ${data.name}`,
    `Documento: ${data.document}`,
    `Telefone: ${data.phone}`,
    `E-mail: ${data.email}`,
    `Data/Hora: ${timestamp}`
  ].join('\n');

  try {
    const result = await transporter.sendMail({
      from: {
        name: 'Site Profills',
        address: process.env.GMAIL_USER_SENDER!
      },
      to: process.env.GMAIL_USER_RECEIVER!,
      subject,
      html,
      text
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('❌ Erro ao enviar notificação interna do catálogo:', error);
    throw new Error('Falha no envio da notificação interna');
  }
}
