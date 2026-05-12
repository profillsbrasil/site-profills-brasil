import { z } from 'zod';

import { validateDocument } from '@/lib/utils/validate-document';

export const catalogRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(120, 'Nome muito longo'),
  document: z
    .string()
    .min(1, 'CPF ou CNPJ é obrigatório')
    .refine(validateDocument, 'CPF ou CNPJ inválido'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(
      /^\(\d{2}\) \d{4,5}-\d{4}$/,
      'Telefone deve ter o formato (00) 00000-0000'
    ),
  email: z.email('E-mail inválido').max(180, 'E-mail muito longo')
});

export type CatalogRequestData = z.infer<typeof catalogRequestSchema>;
