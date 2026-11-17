'use server';

import { refresh } from 'next/cache';

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
 *
 * Com `atualizarRota`, a gravação invalida o cache do roteador no navegador e
 * re-renderiza a rota no lugar; sem isso, o voltar e o avançar mostram a lista
 * e o editor de antes da gravação. O editor aberto em /admin/blog/novo passa
 * false: lá a URL já é a do post, e o re-render troca a rota e remonta o editor.
 * O "Salvar e sair" pelo voltar ou pelo avançar também passa false e atualiza
 * a rota de destino depois da travessia.
 */
export async function gravarPost(
  entrada: EntradaEditor,
  intencao: Intencao,
  atualizarRota = true
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

  if (!tentativa.ok) return { ok: false, erro: tentativa.motivo };

  if (atualizarRota) refresh();

  return { ok: true, guardado: tentativa.valor };
}
