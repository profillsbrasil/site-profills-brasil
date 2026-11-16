import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { abrirAdminBlog } from '@/lib/blog/admin';
import { slugSchema } from '@/lib/schemas/post-blog';

import { enderecoDeEntrada } from '../../entrar/volta';
import { EditorBlog } from '../_components/editor-blog';

export const metadata: Metadata = { title: 'Editar post' };

export default async function EditarPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: pedido } = await params;
  const admin = await abrirAdminBlog();

  if (!admin) redirect(enderecoDeEntrada(`/admin/blog/${pedido}`));

  const slug = slugSchema.safeParse(pedido);

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
