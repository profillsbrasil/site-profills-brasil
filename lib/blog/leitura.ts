import { connection } from 'next/server';

import { slugSchema } from '@/lib/schemas/post-blog';

import { type ImagemGuardada, repositorioBlog } from './repositorio';
import type { PostPublicado, ResumoPublicado } from './tipos';
import 'server-only';

export async function listarPublicados(): Promise<ResumoPublicado[]> {
  await connection();

  return repositorioBlog.listarPublicados();
}

export async function lerPublicado(
  slug: string
): Promise<PostPublicado | null> {
  await connection();

  const valido = slugSchema.safeParse(slug);

  return valido.success ? repositorioBlog.lerPublicado(valido.data) : null;
}

/** Lê do armazém sem consultar o banco: a imagem de rascunho também responde, pelo caminho com hash. */
export async function lerImagem(
  caminho: string
): Promise<ImagemGuardada | null> {
  await connection();

  return repositorioBlog.lerImagem(caminho);
}
