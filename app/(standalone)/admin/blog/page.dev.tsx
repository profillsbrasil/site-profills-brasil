import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { listarPosts } from '@/lib/blog/repositorio';
import { assuntos } from '@/lib/blog/tipos';

import { dataPorExtenso } from './_components/datas';
import { Lateral } from './_components/lateral';

export const metadata: Metadata = { title: 'Posts' };

const colunas =
  'grid grid-cols-[minmax(0,1fr)_8rem_11rem_6.5rem] items-center gap-4 px-4';

export default async function PostsPage() {
  // Sem login: a rota só existe no `bun dev`.
  if (process.env.NODE_ENV !== 'development') notFound();

  const posts = await listarPosts();

  return (
    <div className='grid h-dvh grid-cols-[auto_minmax(0,1fr)] bg-[#0f172b] text-sm'>
      <Lateral atual='posts' totalPosts={posts.length} />

      <main className='my-2 mr-2 flex min-h-0 flex-col overflow-hidden rounded-xs bg-[#f3f4f6] text-[#1b1c1f]'>
        <header className='flex min-h-14 items-center gap-3 border-b border-[#dfe2e8] bg-white px-5 py-3'>
          <h1 className='text-lg font-semibold'>Posts</h1>
        </header>

        <div className='min-h-0 flex-1 overflow-y-auto p-5'>
          {posts.length === 0 ? (
            <div className='grid justify-items-center gap-3 rounded-xs border border-dashed border-[#8a90a0] bg-white p-10 text-center'>
              <h2 className='text-base font-semibold'>Nenhum post ainda</h2>
              <p className='max-w-sm text-xs text-[#5a6172]'>
                Clique em Novo post para escrever o primeiro. Ele fica guardado
                como rascunho até você publicar.
              </p>
            </div>
          ) : (
            <div className='overflow-hidden rounded-xs border border-[#dfe2e8] bg-white'>
              <div
                aria-hidden='true'
                className={`${colunas} border-b border-[#dfe2e8] bg-[#f7f8fa] py-2 text-xs font-medium text-[#5a6172]`}>
                <span>Título</span>
                <span>Assunto</span>
                <span>Atualizado em</span>
                <span>Estado</span>
              </div>
              <ul>
                {posts.map(({ slug, estado, atualizadoEm, post }) => (
                  <li
                    key={slug}
                    className='border-b border-[#eceef2] last:border-b-0'>
                    <Link
                      href={`/admin/blog/${slug}`}
                      className={`${colunas} py-3 transition-colors outline-none hover:bg-[#f7f8fa] focus-visible:bg-[#f7f8fa] motion-reduce:transition-none`}>
                      <span className='truncate font-medium'>
                        {post.titulo || 'Sem título'}
                      </span>
                      <span className='text-[#5a6172]'>
                        {assuntos[post.assunto].nome}
                      </span>
                      <span className='text-[#5a6172]'>
                        {dataPorExtenso(atualizadoEm)}
                      </span>
                      <span
                        className={`justify-self-start rounded-xs px-2 py-0.5 text-xs font-medium ${estado === 'publicado' ? 'bg-[#e3f3ea] text-[#1f7a4d]' : 'bg-[#eceef2] text-[#5a6172]'}`}>
                        {estado === 'publicado' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
