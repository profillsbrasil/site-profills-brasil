import { z } from "zod";

export const montarMaquinaFormSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, { message: "Informe seu nome completo" })
    .max(120),
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email({ message: "E-mail inválido" })
    .max(180),
  empresa: z
    .string()
    .max(140)
    .optional()
    .transform((v) => v ?? ""),
  contato: z
    .string()
    .max(20)
    .optional()
    .transform((v) => v ?? ""),
  detalhes: z
    .string()
    .min(1, "Detalhes são obrigatórios")
    .min(10, { message: "Descreva seu produto e necessidades" })
    .max(2000),
  selectedPackaging: z.string().min(1, { message: "Selecione uma embalagem" }),
  selectedProductType: z
    .string()
    .min(1, { message: "Selecione um tipo de produto" }),
});

export type MontarMaquinaFormData = z.infer<typeof montarMaquinaFormSchema>;
