import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { abrirAdminBlog } from '@/lib/blog/admin';

import { enderecoDeEntrada } from '../../entrar/volta';
import { EditorBlog } from '../_components/editor-blog';

export const metadata: Metadata = { title: 'Novo post' };

export default async function NovoPostPage() {
  const admin = await abrirAdminBlog();

  if (!admin) redirect(enderecoDeEntrada('/admin/blog/novo'));

  const [posts, imagens] = await Promise.all([
    admin.listar(),
    admin.contarImagens()
  ]);

  return (
    <EditorBlog inicial={null} totais={{ posts: posts.length, imagens }} />
  );
}
