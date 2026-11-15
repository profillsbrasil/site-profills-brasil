import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { lerPost, listarPosts } from '@/lib/blog/repositorio';
import { slugSchema } from '@/lib/schemas/post-blog';

import { EditorBlog } from '../_components/editor-blog';

export const metadata: Metadata = { title: 'Editar post' };

export default async function EditarPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  // Sem login: a rota só existe no `bun dev`.
  if (process.env.NODE_ENV !== 'development') notFound();

  const slug = slugSchema.safeParse((await params).slug);

  if (!slug.success) notFound();

  const [guardado, posts] = await Promise.all([
    lerPost(slug.data),
    listarPosts()
  ]);

  if (!guardado) notFound();

  return (
    <EditorBlog
      key={guardado.slug}
      inicial={guardado}
      totalPosts={posts.length}
    />
  );
}
