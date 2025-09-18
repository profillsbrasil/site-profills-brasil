import { z } from "zod";

// Helper: string opcional; "   " vira undefined
const optionalTrimmed = z.preprocess(
  (v) =>
    typeof v === "string"
      ? v.trim() === ""
        ? undefined
        : v.trim()
      : undefined,
  z.string().optional(),
);

export const specificationFormSchema = z.object({
  nome: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : ""),
    z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres"),
  ),
  email: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : ""),
    z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  ),
  telefone: z.preprocess(
    (v) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim() : ""),
    z
      .string()
      .min(1, "Telefone é obrigatório")
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "ex. (11) 99999-9999"),
  ),
  empresa: optionalTrimmed,
  maquinaId: z.coerce.number().min(1, "ID da máquina é obrigatório"),
  maquinaNome: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : ""),
    z.string().min(1, "Nome da máquina é obrigatório"),
  ),
  observacoes: optionalTrimmed,
});

export type SpecificationFormData = z.infer<typeof specificationFormSchema>;
