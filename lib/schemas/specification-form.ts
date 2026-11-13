import { z } from 'zod';

// Texto aparado; ausente ou fora de texto vira ''
const textoAparado = z.string().trim().catch('');

// Helper: string opcional; "   " vira undefined
const optionalTrimmed = textoAparado
  .transform((v) => (v === '' ? undefined : v))
  .pipe(z.string().optional());

export const specificationFormSchema = z.object({
  nome: textoAparado.pipe(
    z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
  ),
  email: textoAparado.pipe(
    z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido')
  ),
  telefone: z
    .string()
    .transform((v) => v.replace(/\s+/g, ' ').trim())
    .catch('')
    .pipe(
      z
        .string()
        .min(1, 'Telefone é obrigatório')
        .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'ex. (11) 99999-9999')
    ),
  empresa: optionalTrimmed,
  maquinaSlug: textoAparado.pipe(
    z.string().min(1, 'Slug da máquina é obrigatório')
  ),
  maquinaNome: textoAparado.pipe(
    z.string().min(1, 'Nome da máquina é obrigatório')
  ),
  observacoes: optionalTrimmed
});

export type SpecificationFormInput = z.input<typeof specificationFormSchema>;

export type SpecificationFormData = z.infer<typeof specificationFormSchema>;
