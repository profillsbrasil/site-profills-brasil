import type { Destinatario } from '@/lib/indicacao/destinatario';
import type { MontarMaquinaFormData } from '@/lib/schemas/montar-maquina-form';
import { SITE_URL } from '@/lib/seo/site';
import { logger } from '@/lib/utils/logger';

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
  data: Record<string, string | string[] | undefined>
): string => {
  let rendered = template;

  const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  rendered = rendered.replace(eachRegex, (match, arrayName, content) => {
    const array = data[arrayName];
    if (Array.isArray(array) && array.length > 0) {
      return array
        .map((item) => content.replace(/\{\{this\}\}/g, item))
        .join('');
    }
    return '';
  });

  const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  rendered = rendered.replace(ifRegex, (match, condition, content) => {
    const value = data[condition];
    if (Array.isArray(value)) {
      return value.length > 0 ? content : '';
    }
    return value !== undefined && value !== null && String(value).trim() !== ''
      ? content
      : '';
  });

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    const value = data[key];
    if (Array.isArray(value)) {
      rendered = rendered.replace(regex, value.join(', '));
    } else {
      rendered = rendered.replace(regex, String(value || ''));
    }
  });

  rendered = rendered.replace(/\{\{#each\s+\w+\}\}/g, '');
  rendered = rendered.replace(/\{\{\/each\}\}/g, '');
  rendered = rendered.replace(/\{\{#if\s+\w+\}\}/g, '');
  rendered = rendered.replace(/\{\{\/if\}\}/g, '');
  rendered = rendered.replace(/\{\{this\}\}/g, '');

  return rendered;
};

export const createMontarMaquinaEmailTemplate = (
  data: MontarMaquinaFormData,
  indicadoPor = ''
) => {
  const currentDate = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo'
  });

  const htmlTemplate = htmlEmailTemplate;
  const siteUrl = SITE_URL;

  const templateData = {
    subject: 'Solicitação de Orçamento - Monte sua Máquina',
    preheader: `Nova solicitação para montagem de máquina de ${data.nome}`,
    saudacao: 'Monte sua Máquina',
    timestamp: `Solicitação recebida em: ${currentDate}`,
    indicadoPor,
    nome: data.nome,
    email: data.email,
    telefone: data.contato,
    empresa: data.empresa,
    detalhes: data.detalhes,
    embalagem: data.selectedPackaging,
    produto: data.selectedProductType,
    logoUrl: `${siteUrl}/logo-branco.png`,
    siteUrl: siteUrl
  };

  return renderTemplate(htmlTemplate, templateData);
};

export const sendMontarMaquinaEmail = async (
  data: MontarMaquinaFormData,
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
    subject: `Monte sua Máquina - ${data.nome} - ${data.email}`,
    html: createMontarMaquinaEmailTemplate(data, indicadoPor),
    text: `
Nova Solicitação - Monte sua Máquina - Profills
${indicadoPor ? `\nIndicado por: ${indicadoPor}\n` : ''}
Data/Hora: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

DADOS DE CONTATO:
- Nome: ${data.nome}
- E-mail: ${data.email}
- Telefone: ${data.contato}
- Empresa: ${data.empresa}

PRODUTO/EMBALAGEM:
- Tipo de Produto: ${data.selectedProductType}
- Tipo de Embalagem: ${data.selectedPackaging}

DESCRIÇÃO DO PROJETO:
${data.detalhes}

---
Este e-mail foi gerado automaticamente pelo sistema Profills.
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('❌ Erro ao enviar e-mail Montar Máquina:', error);
    throw new Error('Falha no envio do e-mail');
  }
};
