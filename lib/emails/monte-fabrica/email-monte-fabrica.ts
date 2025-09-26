import type { MonteFabricaFormData } from "@/lib/schemas/monte-fabrica-form";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";

// Configuração do transporter do Nodemailer para Gmail
export const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER_SENDER, // siteprofills@gmail.com
      pass: process.env.GMAIL_APP_PASSWORD, // App Password do Gmail
    },
  });
};

// Função para ler o arquivo de template
const readEmailTemplate = () => {
  const templatePath = path.join(
    process.cwd(),
    "lib/emails/monte-fabrica/email-template.html",
  );
  return fs.readFileSync(templatePath, "utf-8");
};

// Template engine melhorado para processar {{#if}} e {{#each}}
const renderTemplate = (
  template: string,
  data: Record<string, string | string[] | undefined>,
): string => {
  let rendered = template;

  // Processa loops {{#each array}} ... {{/each}} PRIMEIRO
  const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  rendered = rendered.replace(eachRegex, (match, arrayName, content) => {
    const array = data[arrayName];
    if (Array.isArray(array) && array.length > 0) {
      return array
        .map((item) => content.replace(/\{\{this\}\}/g, item))
        .join("");
    }
    return "";
  });

  // Processa condicionais {{#if variavel}} ... {{/if}} DEPOIS
  const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  rendered = rendered.replace(ifRegex, (match, condition, content) => {
    const value = data[condition];
    // Mostra o conteúdo se a variável existe, não está vazia e não é undefined
    if (Array.isArray(value)) {
      return value.length > 0 ? content : "";
    }
    return value !== undefined && value !== null && String(value).trim() !== ""
      ? content
      : "";
  });

  // Substitui variáveis simples {{variavel}} POR ÚLTIMO
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    const value = data[key];
    if (Array.isArray(value)) {
      rendered = rendered.replace(regex, value.join(", "));
    } else {
      rendered = rendered.replace(regex, String(value || ""));
    }
  });

  // Remove qualquer condicional que não foi processado (fallback)
  rendered = rendered.replace(/\{\{#each\s+\w+\}\}/g, "");
  rendered = rendered.replace(/\{\{\/each\}\}/g, "");
  rendered = rendered.replace(/\{\{#if\s+\w+\}\}/g, "");
  rendered = rendered.replace(/\{\{\/if\}\}/g, "");
  rendered = rendered.replace(/\{\{this\}\}/g, "");

  return rendered;
};

// Template HTML para o e-mail usando arquivos externos
export const createMonteFabricaEmailTemplate = (data: MonteFabricaFormData) => {
  const currentDate = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  // Lê o template HTML (CSS já está inline)
  const htmlTemplate = readEmailTemplate();

  // URL base do site (sempre com protocolo)
  const siteUrl = process.env.SITE_URL || "https://profills.com.br";

  // Dados para o template
  const templateData = {
    subject: "Solicitação de Projeto - Monte sua Fábrica",
    preheader: `Nova solicitação para montagem de fábrica de ${data.empresa}`,
    saudacao: "Monte sua Fábrica",
    timestamp: `Solicitação recebida em: ${currentDate}`,
    nome: data.nome,
    email: data.email,
    telefone: data.telefone,
    empresa: data.empresa,
    mensagem: data.mensagem,
    // URLs absolutas já prontas
    logoUrl: `${siteUrl}/logo-branco.png`,
    siteUrl: siteUrl,
  };

  // Debug: Log dos dados do template (remover em produção se necessário)
  console.log("📧 Dados do template de email Monte sua Fábrica:", {
    empresa: templateData.empresa,
    email: templateData.email,
    siteUrl: templateData.siteUrl,
  });

  // Renderiza o template
  return renderTemplate(htmlTemplate, templateData);
};

// Função para enviar e-mail
export const sendMonteFabricaEmail = async (data: MonteFabricaFormData) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: "Site Profills",
      address: process.env.GMAIL_USER_SENDER!,
    },
    to: process.env.GMAIL_USER_RECEIVER!,
    subject: `Monte sua Fábrica - ${data.empresa} - ${data.email}`,
    html: createMonteFabricaEmailTemplate(data),
    // Versão em texto plano como fallback
    text: `
Nova Solicitação - Monte sua Fábrica - Profills

Data/Hora: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}

DADOS DE CONTATO:
- Nome: ${data.nome}
- E-mail: ${data.email}
- Telefone: ${data.telefone}
- Empresa: ${data.empresa}

PROJETO:
Tipo: Montagem de Fábrica Completa

SERVIÇOS INCLUSOS:
- Consultoria técnica especializada
- Projeto personalizado para sua necessidade
- Fabricação de máquinas sob medida
- Instalação e treinamento completo
- Suporte técnico contínuo

DESCRIÇÃO DO PROJETO:
${data.mensagem}

---
Este e-mail foi gerado automaticamente pelo sistema Profills.
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(
      "✅ E-mail Monte sua Fábrica enviado com sucesso:",
      result.messageId,
    );
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail Monte sua Fábrica:", error);
    throw new Error("Falha no envio do e-mail");
  }
};
