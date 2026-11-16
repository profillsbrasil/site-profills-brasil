import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { abrirAdminBlog } from '@/lib/blog/admin';

import { EditorBlog } from '../_components/editor-blog';

export const metadata: Metadata = { title: 'Novo post' };

export default async function NovoPostPage() {
  const admin = await abrirAdminBlog();

  if (!admin) notFound();

  const posts = await admin.listar();

  return <EditorBlog inicial={null} totalPosts={posts.length} />;
}
