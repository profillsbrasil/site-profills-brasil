import {
  escaparHtml,
  renderTemplate
} from '@/lib/emails/_shared/template-engine';
import { createTransporter } from '@/lib/emails/_shared/transporter';
import type { Destinatario } from '@/lib/indicacao/destinatario';
import type { CatalogRequestData } from '@/lib/schemas/catalog-request';
import { SITE_URL } from '@/lib/seo/site';
import { logger } from '@/lib/utils/logger';

import { template as clientTemplate } from './email-template-client';
import { template as internalTemplate } from './email-template-internal';

const getSiteUrl = () => SITE_URL;

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

  const html = renderTemplate(clientTemplate, {
    subject,
    preheader: 'Acesse o catálogo completo da Profills',
    name: input.name,
    downloadUrl: input.downloadUrl,
    siteUrl
  });

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

export async function sendLeadNotification(
  data: CatalogRequestData,
  destinatario: Destinatario
) {
  const transporter = createTransporter();
  const subject = `Nova solicitação de catálogo — ${data.name}`;
  const timestamp = nowSaoPaulo();
  const indicadoPor = destinatario.vendedor
    ? `${destinatario.vendedor.nome} (${destinatario.vendedor.referral_code})`
    : '';

  const html = renderTemplate(internalTemplate, {
    name: data.name,
    document: data.document,
    phone: data.phone,
    email: data.email,
    timestamp,
    indicadoPor: escaparHtml(indicadoPor)
  });

  const text = [
    'Nova solicitação de catálogo',
    `Nome: ${data.name}`,
    `Documento: ${data.document}`,
    ...(indicadoPor ? [`Indicado por: ${indicadoPor}`] : []),
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
      to: destinatario.para,
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
