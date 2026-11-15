import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EditorBlog } from './_components/editor-blog';

export const metadata: Metadata = {
  title: 'Protótipo do admin do blog',
  robots: { index: false, follow: false }
};

export default function PrototipoBlogAdminPage() {
  // Sem login: a rota só existe no `bun dev`.
  if (process.env.NODE_ENV !== 'development') notFound();

  return <EditorBlog />;
}
