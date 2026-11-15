'use server';

import { comMotivo } from '@/lib/blog/erro';
import {
  despublicarPost,
  publicarPost,
  salvarPost
} from '@/lib/blog/repositorio';
import type { PostGuardado } from '@/lib/blog/tipos';
import {
  type EntradaEditor,
  entradaEditorSchema
} from '@/lib/schemas/post-blog';

export type ResultadoGravacao =
  | { ok: true; guardado: PostGuardado }
  | { ok: false; erro: string };

/** O tipo da entrada é o que o editor promete; o zod confere o que chegou de fato. */
async function gravar(
  entrada: EntradaEditor,
  depois?: (slug: string) => Promise<PostGuardado>
): Promise<ResultadoGravacao> {
  // Sem login: o admin só grava no `bun dev`.
  if (process.env.NODE_ENV !== 'development') {
    return { ok: false, erro: 'O admin do blog só grava no bun dev.' };
  }

  const lida = entradaEditorSchema.safeParse(entrada);

  if (!lida.success) {
    const [problema] = lida.error.issues;

    return {
      ok: false,
      erro: `Dados do post inválidos em ${problema.path.join('.') || 'post'}: ${problema.message}.`
    };
  }

  const tentativa = await comMotivo(async () => {
    const salvo = await salvarPost(lida.data);

    return depois ? depois(salvo.slug) : salvo;
  });

  return tentativa.ok
    ? { ok: true, guardado: tentativa.valor }
    : { ok: false, erro: tentativa.motivo };
}

export async function salvarRascunho(entrada: EntradaEditor) {
  return gravar(entrada);
}

export async function publicar(entrada: EntradaEditor) {
  return gravar(entrada, publicarPost);
}

export async function despublicar(entrada: EntradaEditor) {
  return gravar(entrada, despublicarPost);
}
