import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { listarPosts } from '@/lib/blog/repositorio';

import { EditorBlog } from '../_components/editor-blog';

export const metadata: Metadata = { title: 'Novo post' };

export default async function NovoPostPage() {
  // Sem login: a rota só existe no `bun dev`.
  if (process.env.NODE_ENV !== 'development') notFound();

  const posts = await listarPosts();

  return <EditorBlog inicial={null} totalPosts={posts.length} />;
}
