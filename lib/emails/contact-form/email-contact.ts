import type { ContactFormData } from '@/lib/schemas/contact-form';
import { createTransporter } from '@/lib/emails/_shared/transporter';
import {
  readTemplate,
  renderTemplate
} from '@/lib/emails/_shared/template-engine';
import { logger } from '@/lib/utils/logger';

// Função para formatar o material, serviço e acabamento como arrays
const formatProjectDetails = (data: ContactFormData) => {
  const materialLabels: Record<string, string> = {
    'aco-inox': 'Aço Inox',
    'aco-carbono': 'Aço Carbono'
  };

  const serviceLabels: Record<string, string> = {
    corte: 'Corte',
    'corte-dobra': 'Corte + Dobra',
    'corte-dobra-solda': 'Corte + Dobra + Solda'
  };

  const finishLabels: Record<string, string> = {
    escovado: 'Escovado',
    polido: 'Polido',
    'sem-acabamento': 'Sem Acabamento'
  };

  return {
    material: [materialLabels[data.material] || data.material],
    service: [serviceLabels[data.service] || data.service],
    finish: [finishLabels[data.finish] || data.finish]
  };
};

// Template HTML para o e-mail usando arquivos externos
export const createContactEmailTemplate = (data: ContactFormData) => {
  const currentDate = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo'
  });

  // Lê o template HTML (CSS já está inline)
  const htmlTemplate = readTemplate(
    'lib/emails/contact-form/email-template.html'
  );

  // URL base do site (sempre com protocolo)
  const siteUrl = process.env.SITE_URL || 'https://profills.com.br';

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
    data.cep
  ]
    .filter(Boolean)
    .join(', ');

  // Dados para o template
  const templateData = {
    subject: 'Solicitação de Orçamento - Serviços Personalizados',
    preheader: `Nova solicitação de orçamento de ${data.email}`,
    saudacao: 'Solicitação de Orçamento',
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
    siteUrl: siteUrl
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
      name: 'Site Profills',
      address: process.env.GMAIL_USER_SENDER!
    },
    to: process.env.GMAIL_USER_RECEIVER!,
    subject: `Orçamento - ${projectDetails.material[0]} (${projectDetails.service[0]}) - ${data.email}`,
    html: createContactEmailTemplate(data),
    // Versão em texto plano como fallback
    text: `
Nova Solicitação de Orçamento - Profills

Data/Hora: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

DADOS DE CONTATO:
- E-mail: ${data.email}
- Telefone: ${data.phone}
- CEP: ${data.cep}

ENDEREÇO:
${data.street ? `- Rua: ${data.street}` : ''}
- Número: ${data.number}
${data.complement ? `- Complemento: ${data.complement}` : ''}
${data.neighborhood ? `- Bairro: ${data.neighborhood}` : ''}
- Cidade: ${data.city}
- Estado: ${data.state}

DETALHES DO PROJETO:
- Material: ${projectDetails.material[0]}
- Serviços: ${projectDetails.service[0]}
- Acabamento: ${projectDetails.finish[0]}

${data.details ? `DETALHES ADICIONAIS:\n${data.details}` : ''}

---
Este e-mail foi gerado automaticamente pelo sistema Profills.
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    logger.error('❌ Erro ao enviar e-mail de contato:', error);
    throw new Error('Falha no envio do e-mail');
  }
};
