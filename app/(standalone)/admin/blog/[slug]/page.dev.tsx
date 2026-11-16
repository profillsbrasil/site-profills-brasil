import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { abrirAdminBlog } from '@/lib/blog/admin';
import { slugSchema } from '@/lib/schemas/post-blog';

import { EditorBlog } from '../_components/editor-blog';

export const metadata: Metadata = { title: 'Editar post' };

export default async function EditarPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const admin = await abrirAdminBlog();

  if (!admin) notFound();

  const slug = slugSchema.safeParse((await params).slug);

  if (!slug.success) notFound();

  const [guardado, posts] = await Promise.all([
    admin.ler(slug.data),
    admin.listar()
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
