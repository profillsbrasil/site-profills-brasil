'use server';

import { abrirAdminBlog } from '@/lib/blog/admin';
import { MOTIVO_SEM_SESSAO, comMotivo } from '@/lib/blog/erro';
import type { EntradaEditor, Intencao, PostGuardado } from '@/lib/blog/tipos';
import { entradaEditorSchema, intencaoSchema } from '@/lib/schemas/post-blog';

export type ResultadoGravacao =
  | { ok: true; guardado: PostGuardado }
  | { ok: false; erro: string };

/**
 * Salvar, publicar e despublicar numa gravação só. O tipo da entrada é o que o
 * editor promete; o zod confere o que chegou de fato.
 */
export async function gravarPost(
  entrada: EntradaEditor,
  intencao: Intencao
): Promise<ResultadoGravacao> {
  const admin = await abrirAdminBlog();

  if (!admin) return { ok: false, erro: MOTIVO_SEM_SESSAO };

  const lida = entradaEditorSchema.safeParse(entrada);

  if (!lida.success) {
    const [problema] = lida.error.issues;

    return {
      ok: false,
      erro: `Dados do post inválidos em ${problema.path.join('.') || 'post'}: ${problema.message}.`
    };
  }

  const qual = intencaoSchema.safeParse(intencao);

  if (!qual.success)
    return { ok: false, erro: 'Ação de gravação desconhecida.' };

  const tentativa = await comMotivo(() => admin.gravar(lida.data, qual.data));

  return tentativa.ok
    ? { ok: true, guardado: tentativa.valor }
    : { ok: false, erro: tentativa.motivo };
}
