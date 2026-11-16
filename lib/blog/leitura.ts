import { connection } from 'next/server';

import { slugSchema } from '@/lib/schemas/post-blog';

import { repositorioBlog } from './repositorio';
import type { PostPublicado, ResumoPublicado } from './tipos';
import 'server-only';

// connection() antes de cada consulta: nenhuma página que lê o blog é pré-renderizada, e o build nunca abre o banco.

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
