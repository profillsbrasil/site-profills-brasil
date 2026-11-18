import { autorAtual } from '@/lib/admin/sessao';

import { type RepositorioBlog, repositorioBlog } from './repositorio';
import 'server-only';

export type AdminBlog = Pick<
  RepositorioBlog,
  | 'listar'
  | 'ler'
  | 'gravar'
  | 'apagarRascunho'
  | 'enviarImagem'
  | 'listarImagens'
  | 'contarImagens'
>;

/**
 * A única porta de escrita do blog. null sem sessão do admin: a página manda
 * para o login, a action devolve o motivo e o editor mantém o texto.
 */
export async function abrirAdminBlog() {
  const admin: AdminBlog | null = (await autorAtual()) ? repositorioBlog : null;

  return admin;
}
