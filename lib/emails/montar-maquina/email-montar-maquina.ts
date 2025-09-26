import type { MontarMaquinaFormData } from "@/lib/schemas/montar-maquina-form";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import { logger } from "@/lib/utils/logger";

export const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER_SENDER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const readEmailTemplate = () => {
  const templatePath = path.join(
    process.cwd(),
    "lib/emails/montar-maquina/email-template.html",
  );
  return fs.readFileSync(templatePath, "utf-8");
};

const renderTemplate = (
  template: string,
  data: Record<string, string | string[] | undefined>,
): string => {
  let rendered = template;

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

  const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  rendered = rendered.replace(ifRegex, (match, condition, content) => {
    const value = data[condition];
    if (Array.isArray(value)) {
      return value.length > 0 ? content : "";
    }
    return value !== undefined && value !== null && String(value).trim() !== ""
      ? content
      : "";
  });

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    const value = data[key];
    if (Array.isArray(value)) {
      rendered = rendered.replace(regex, value.join(", "));
    } else {
      rendered = rendered.replace(regex, String(value || ""));
    }
  });

  rendered = rendered.replace(/\{\{#each\s+\w+\}\}/g, "");
  rendered = rendered.replace(/\{\{\/each\}\}/g, "");
  rendered = rendered.replace(/\{\{#if\s+\w+\}\}/g, "");
  rendered = rendered.replace(/\{\{\/if\}\}/g, "");
  rendered = rendered.replace(/\{\{this\}\}/g, "");

  return rendered;
};

export const createMontarMaquinaEmailTemplate = (
  data: MontarMaquinaFormData,
) => {
  const currentDate = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const htmlTemplate = readEmailTemplate();
  const siteUrl = process.env.SITE_URL || "https://profills.com.br";

  const templateData = {
    subject: "Solicitação de Orçamento - Monte sua Máquina",
    preheader: `Nova solicitação para montagem de máquina de ${data.nome}`,
    saudacao: "Monte sua Máquina",
    timestamp: `Solicitação recebida em: ${currentDate}`,
    nome: data.nome,
    email: data.email,
    telefone: data.contato,
    empresa: data.empresa,
    detalhes: data.detalhes,
    embalagem: data.selectedPackaging,
    produto: data.selectedProductType,
    logoUrl: `${siteUrl}/logo-branco.png`,
    siteUrl: siteUrl,
  };

  return renderTemplate(htmlTemplate, templateData);
};

export const sendMontarMaquinaEmail = async (data: MontarMaquinaFormData) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: "Site Profills",
      address: process.env.GMAIL_USER_SENDER!,
    },
    to: process.env.GMAIL_USER_RECEIVER!,
    subject: `Monte sua Máquina - ${data.nome} - ${data.email}`,
    html: createMontarMaquinaEmailTemplate(data),
    text: `
Nova Solicitação - Monte sua Máquina - Profills

Data/Hora: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}

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
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error("❌ Erro ao enviar e-mail Montar Máquina:", error);
    throw new Error("Falha no envio do e-mail");
  }
};
