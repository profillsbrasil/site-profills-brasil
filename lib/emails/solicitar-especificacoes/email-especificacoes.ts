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

// Template engine simples para substituir placeholders
const renderTemplate = (
  template: string,
  data: Record<string, string | undefined>
): string => {
  let rendered = template;

  // Processa condicionais {{#if variavel}} ... {{/if}} PRIMEIRO
  const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  rendered = rendered.replace(ifRegex, (match, condition, content) => {
    const value = data[condition];
    // Mostra o conteúdo se a variável existe, não está vazia e não é undefined
    // Trata string "0" como válida (importante para IDs que podem ser 0)
    return value !== undefined && value !== null && value.trim() !== ''
      ? content
      : '';
  });

  // Substitui variáveis simples {{variavel}} DEPOIS
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(regex, data[key] || '');
  });

  // Remove qualquer condicional que não foi processado (fallback)
  rendered = rendered.replace(/\{\{#if\s+\w+\}\}/g, '');
  rendered = rendered.replace(/\{\{\/if\}\}/g, '');

  return rendered;
};

// Template HTML para o e-mail usando arquivos externos
export const createEmailTemplate = (
  data: SpecificationFormData,
  indicadoPor = ''
) => {
  const currentDate = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo'
  });

  // Lê o template HTML e CSS
  let htmlTemplate = htmlEmailTemplate;
  const cssStyles = cssEmailStyles;

  // Substitui o CSS inline (necessário para emails)
  htmlTemplate = htmlTemplate.replace(
    '<link rel="stylesheet" href="email-styles.css">',
    `<style>${cssStyles}</style>`
  );

  // URL base do site (sempre com protocolo)
  const siteUrl = SITE_URL;

  // Dados para o template
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
    // URLs absolutas já prontas
    logoUrl: `${siteUrl}/logo-branco.png`,
    urlMaquina: `${siteUrl}/maquinas/${data.maquinaSlug}`,
    siteUrl: siteUrl
  };

  // Renderiza o template
  return renderTemplate(htmlTemplate, templateData);
};

// Função para enviar e-mail
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
    html: createEmailTemplate(data, indicadoPor),
    // Versão em texto plano como fallback
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
