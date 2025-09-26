import type { ContactFormData } from "@/lib/schemas/contact-form";
import fs from "fs";
import nodemailer from "nodemailer";
import { logger } from "@/lib/utils/logger";
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

// Função para ler os arquivos de template
const readEmailTemplate = () => {
  const templatePath = path.join(
    process.cwd(),
    "lib/emails/contact-form/email-template.html",
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

// Função para formatar o material, serviço e acabamento como arrays
const formatProjectDetails = (data: ContactFormData) => {
  const materialLabels: Record<string, string> = {
    "aco-inox": "Aço Inox",
    "aco-carbono": "Aço Carbono",
  };

  const serviceLabels: Record<string, string> = {
    corte: "Corte",
    "corte-dobra": "Corte + Dobra",
    "corte-dobra-solda": "Corte + Dobra + Solda",
  };

  const finishLabels: Record<string, string> = {
    escovado: "Escovado",
    polido: "Polido",
    "sem-acabamento": "Sem Acabamento",
  };

  return {
    material: [materialLabels[data.material] || data.material],
    service: [serviceLabels[data.service] || data.service],
    finish: [finishLabels[data.finish] || data.finish],
  };
};

// Template HTML para o e-mail usando arquivos externos
export const createContactEmailTemplate = (data: ContactFormData) => {
  const currentDate = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  // Lê o template HTML (CSS já está inline)
  const htmlTemplate = readEmailTemplate();

  // URL base do site (sempre com protocolo)
  const siteUrl = process.env.SITE_URL || "https://profills.com.br";

  // Formata os detalhes do projeto
  const projectDetails = formatProjectDetails(data);

  // Formata o endereço completo
  const enderecoCompleto = [
    data.street,
    data.number,
    data.complement,
    data.neighborhood,
    data.city,
    data.state,
    data.cep,
  ]
    .filter(Boolean)
    .join(", ");

  // Dados para o template
  const templateData = {
    subject: "Solicitação de Orçamento - Serviços Personalizados",
    preheader: `Nova solicitação de orçamento de ${data.email}`,
    saudacao: "Solicitação de Orçamento",
    timestamp: `Solicitação recebida em: ${currentDate}`,
    email: data.email,
    phone: data.phone,
    cep: data.cep,
    endereco: enderecoCompleto,
    street: data.street,
    number: data.number,
    complement: data.complement,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
    material: projectDetails.material,
    service: projectDetails.service,
    finish: projectDetails.finish,
    details: data.details,
    // URLs absolutas já prontas
    logoUrl: `${siteUrl}/logo-branco.png`,
    siteUrl: siteUrl,
  };

  // Renderiza o template
  return renderTemplate(htmlTemplate, templateData);
};

// Função para enviar e-mail
export const sendContactEmail = async (data: ContactFormData) => {
  const transporter = createTransporter();

  const projectDetails = formatProjectDetails(data);

  const mailOptions = {
    from: {
      name: "Site Profills",
      address: process.env.GMAIL_USER_SENDER!,
    },
    to: process.env.GMAIL_USER_RECEIVER!,
    subject: `Orçamento - ${projectDetails.material[0]} (${projectDetails.service[0]}) - ${data.email}`,
    html: createContactEmailTemplate(data),
    // Versão em texto plano como fallback
    text: `
Nova Solicitação de Orçamento - Profills

Data/Hora: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}

DADOS DE CONTATO:
- E-mail: ${data.email}
- Telefone: ${data.phone}
- CEP: ${data.cep}

ENDEREÇO:
${data.street ? `- Rua: ${data.street}` : ""}
- Número: ${data.number}
${data.complement ? `- Complemento: ${data.complement}` : ""}
${data.neighborhood ? `- Bairro: ${data.neighborhood}` : ""}
- Cidade: ${data.city}
- Estado: ${data.state}

DETALHES DO PROJETO:
- Material: ${projectDetails.material[0]}
- Serviços: ${projectDetails.service[0]}
- Acabamento: ${projectDetails.finish[0]}

${data.details ? `DETALHES ADICIONAIS:\n${data.details}` : ""}

---
Este e-mail foi gerado automaticamente pelo sistema Profills.
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error("❌ Erro ao enviar e-mail de contato:", error);
    throw new Error("Falha no envio do e-mail");
  }
};
