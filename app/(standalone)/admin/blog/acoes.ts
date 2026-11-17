'use server';

import { refresh } from 'next/cache';

import { abrirAdminBlog } from '@/lib/blog/admin';
import { MOTIVO_SEM_SESSAO, comMotivo } from '@/lib/blog/erro';
import type {
  EntradaEditor,
  ImagensApagadas,
  Intencao,
  PedidoApagar,
  PostGuardado
} from '@/lib/blog/tipos';
import {
  entradaEditorSchema,
  intencaoSchema,
  slugSchema
} from '@/lib/schemas/post-blog';

import { z } from 'zod';

export type ResultadoApagar =
  | { ok: true; imagens: ImagensApagadas }
  | { ok: false; erro: string };

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

const pedidoApagarSchema = z.object({
  slug: slugSchema,
  versao: z.number().int().positive()
});

/**
 * Apaga o rascunho na versão que a tela leu e depois as imagens da pasta dele.
 * Publicado e versão antiga voltam com o motivo. Falha no armazém depois do
 * post apagado ainda é ok: `imagens` conta o que ficou, e repetir termina.
 *
 * `atualizarRota` funciona como em gravarPost. O editor do post apagado passa
 * false, porque a rota dele re-renderizada daria 404, navega para /admin/blog
 * e atualiza a rota de destino.
 */
export async function apagarRascunho(
  pedido: PedidoApagar,
  atualizarRota = true
): Promise<ResultadoApagar> {
  const admin = await abrirAdminBlog();

  if (!admin) return { ok: false, erro: MOTIVO_SEM_SESSAO };

  const lido = pedidoApagarSchema.safeParse(pedido);

  if (!lido.success) return { ok: false, erro: 'Pedido de apagar inválido.' };

  const tentativa = await comMotivo(() => admin.apagarRascunho(lido.data));

  if (!tentativa.ok) return { ok: false, erro: tentativa.motivo };

  if (atualizarRota) refresh();

  return { ok: true, imagens: tentativa.valor };
}
