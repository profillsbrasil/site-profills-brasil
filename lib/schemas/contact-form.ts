import { z } from "zod";

// Schema para validação de CEP via API
const cepSchema = z
  .string()
  .min(1, "CEP é obrigatório")
  .regex(/^\d{5}-?\d{3}$/, "CEP deve ter o formato 00000-000")
  .refine(
    (cep) => {
      const cleanCep = cep.replace(/\D/g, "");
      // Verifica se não é um CEP inválido (todos os dígitos iguais)
      const invalidCeps = [
        "00000000",
        "11111111",
        "22222222",
        "33333333",
        "44444444",
        "55555555",
        "66666666",
        "77777777",
        "88888888",
        "99999999",
      ];
      return !invalidCeps.includes(cleanCep);
    },
    { message: "CEP inválido" },
  );

// Schema para telefone brasileiro
const phoneSchema = z
  .string()
  .min(1, "Telefone é obrigatório")
  .regex(
    /^\(\d{2}\) \d{4,5}-\d{4}$/,
    "Telefone deve ter o formato (00) 00000-0000",
  );

// Schema principal do formulário
export const contactFormSchema = z.object({
  // Etapa 1: Dados básicos
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  phone: phoneSchema,
  cep: cepSchema,

  // Etapa 2: Endereço (preenchidos automaticamente pelo CEP)
  street: z.string().optional(),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),

  // Etapa 3: Detalhes do projeto
  material: z.string().min(1, "Material é obrigatório"),
  service: z.string().min(1, "Serviço é obrigatório"),
  finish: z.string().min(1, "Acabamento é obrigatório"),
  details: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Schemas parciais para validação por etapas
export const step1Schema = contactFormSchema.pick({
  email: true,
  phone: true,
  cep: true,
});

export const step2Schema = contactFormSchema.pick({
  number: true,
  city: true,
  state: true,
});

export const step3Schema = contactFormSchema.pick({
  material: true,
  service: true,
  finish: true,
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
