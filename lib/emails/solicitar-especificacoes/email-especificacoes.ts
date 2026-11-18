import { escaparHtml } from '@/lib/emails/_shared/template-engine';
import type { Destinatario } from '@/lib/indicacao/destinatario';
import type { SpecificationFormData } from '@/lib/schemas/specification-form';
import { SITE_URL } from '@/lib/seo/site';
import { logger } from '@/lib/utils/logger';

import { styles as cssEmailStyles } from './email-styles';
import { template as htmlEmailTemplate } from './email-template';
import nodemailer from 'nodemailer';

export const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER_SENDER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

const renderTemplate = (
  template: string,
  data: Record<string, string | undefined>
) => {
  let rendered = template;

  const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  rendered = rendered.replace(ifRegex, (match, condition, content) => {
    const value = data[condition];

    return value !== undefined && value !== null && value.trim() !== ''
      ? content
      : '';
  });

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(regex, data[key] || '');
  });

  rendered = rendered.replace(/\{\{#if\s+\w+\}\}/g, '');
  rendered = rendered.replace(/\{\{\/if\}\}/g, '');

  return rendered;
};

export const createEmailTemplate = (
  data: SpecificationFormData,
  indicadoPor = ''
) => {
  const currentDate = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo'
  });

  let htmlTemplate = htmlEmailTemplate;
  const cssStyles = cssEmailStyles;

  htmlTemplate = htmlTemplate.replace(
    '<link rel="stylesheet" href="email-styles.css">',
    `<style>${cssStyles}</style>`
  );

  const siteUrl = SITE_URL;

  const templateData = {
    subject: `Especificações da ${data.maquinaNome}`,
    preheader: `Nova solicitação de especificações para ${data.maquinaNome}`,
    saudacao: 'Solicitação de Especificações',
    timestamp: `Solicitação recebida em: ${currentDate}`,
    indicadoPor,
    nome: data.nome,
    email: data.email,
    telefone: data.telefone,
    empresa: data.empresa,
    maquinaNome: data.maquinaNome,
    maquinaSlug: data.maquinaSlug,
    observacoes: data.observacoes,
    logoUrl: `${siteUrl}/logo-branco.png`,
    urlMaquina: `${siteUrl}/maquinas/${data.maquinaSlug}`,
    siteUrl: siteUrl
  };

  return renderTemplate(htmlTemplate, templateData);
};

export const sendSpecificationEmail = async (
  data: SpecificationFormData,
  destinatario: Destinatario
) => {
  const transporter = createTransporter();

  const indicadoPor = destinatario.vendedor
    ? `${destinatario.vendedor.nome} (${destinatario.vendedor.referral_code})`
    : '';

  const mailOptions = {
    from: {
      name: 'Site Profills',
      address: process.env.GMAIL_USER_SENDER!
    },
    to: destinatario.para,
    subject: `Especificações da ${data.maquinaNome} - ${data.nome}`,
    html: createEmailTemplate(data, escaparHtml(indicadoPor)),
    text: `
Nova Solicitação de Especificações - Profills
${indicadoPor ? `\nIndicado por: ${indicadoPor}\n` : ''}
Data/Hora: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

MÁQUINA SOLICITADA:
- Nome: ${data.maquinaNome}
- Slug: ${data.maquinaSlug}

DADOS DO SOLICITANTE:
- Nome: ${data.nome}
- E-mail: ${data.email}
- Telefone: ${data.telefone}
${data.empresa ? `- Empresa: ${data.empresa}` : ''}

${data.observacoes ? `OBSERVAÇÕES:\n${data.observacoes}` : ''}

---
Este e-mail foi gerado automaticamente pelo sistema Profills.
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);

    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('❌ Erro ao enviar e-mail:', error);
    throw new Error('Falha no envio do e-mail');
  }
};
