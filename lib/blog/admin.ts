import { type RepositorioBlog, repositorioBlog } from './repositorio';
import 'server-only';

export type AdminBlog = Pick<
  RepositorioBlog,
  'listar' | 'ler' | 'gravar' | 'enviarImagem'
>;

/**
 * A única porta de escrita do blog. null quando quem chama não pode escrever:
 * a página responde 404, a action devolve o motivo e o editor mantém o texto.
 * Sem login ainda, só abre no bun dev.
 */
export async function abrirAdminBlog(): Promise<AdminBlog | null> {
  return process.env.NODE_ENV === 'development' ? repositorioBlog : null;
}
