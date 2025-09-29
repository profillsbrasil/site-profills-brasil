import { z } from 'zod';

export const monteFabricaFormSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  telefone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  empresa: z
    .string()
    .min(1, 'Empresa é obrigatória')
    .min(2, 'Nome da empresa é obrigatório'),
  mensagem: z
    .string()
    .min(1, 'Mensagem é obrigatória')
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
});

export type MonteFabricaFormData = z.infer<typeof monteFabricaFormSchema>;
