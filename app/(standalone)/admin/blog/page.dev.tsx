import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { listarPosts } from '@/lib/blog/repositorio';
import { assuntos } from '@/lib/blog/tipos';

import { dataPorExtenso } from './_components/datas';
import { classeBotaoCheio } from './_components/estilos';
import { Lateral } from './_components/lateral';
import { Plus } from 'lucide-react';

export const metadata: Metadata = { title: 'Posts' };

const colunas =
  'grid grid-cols-[minmax(0,1fr)_8rem_11rem_6.5rem] items-center gap-4 px-4';

function BotaoNovoPost() {
  return (
    <Link
      href='/admin/blog/novo'
      className={`inline-flex h-8 items-center gap-1.5 px-3 text-sm font-medium ${classeBotaoCheio}`}>
      <Plus aria-hidden='true' className='size-4' />
      Novo post
    </Link>
  );
}

export default async function PostsPage() {
  // Sem login: a rota só existe no `bun dev`.
  if (process.env.NODE_ENV !== 'development') notFound();

  const posts = await listarPosts();

  return (
    <div className='grid h-dvh grid-cols-[auto_minmax(0,1fr)] bg-[#0f172b] text-sm'>
      <Lateral atual='posts' totalPosts={posts.length} />

      <main className='my-2 mr-2 flex min-h-0 flex-col overflow-hidden rounded-xs bg-[#f3f4f6] text-[#1b1c1f]'>
        <header className='flex items-center gap-3 border-b border-[#dfe2e8] bg-white px-5 py-3'>
          <h1 className='text-lg font-bold'>Posts</h1>
          <span className='text-xs text-[#5a6172]'>
            Guardados em conteudo/blog/posts
          </span>
          <div className='ml-auto'>
            <BotaoNovoPost />
          </div>
        </header>

        <div className='min-h-0 flex-1 overflow-y-auto p-5'>
          {posts.length === 0 ? (
            <div className='grid justify-items-center gap-3 rounded-xs border border-dashed border-[#8a90a0] bg-white p-10 text-center'>
              <h2 className='text-[0.95rem] font-bold'>Nenhum post ainda</h2>
              <p className='max-w-sm text-xs text-[#5a6172]'>
                Clique em Novo post para escrever o primeiro. Ele fica guardado
                como rascunho até você publicar.
              </p>
              <BotaoNovoPost />
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
                      <span className='truncate font-semibold'>
                        {post.titulo || 'Sem título'}
                      </span>
                      <span className='text-[#5a6172]'>
                        {assuntos[post.assunto].nome}
                      </span>
                      <span className='text-[#5a6172]'>
                        {dataPorExtenso(atualizadoEm)}
                      </span>
                      <span
                        className={`justify-self-start rounded-xs px-2 py-0.5 text-xs font-semibold ${estado === 'publicado' ? 'bg-[#e3f3ea] text-[#1f7a4d]' : 'bg-[#eceef2] text-[#5a6172]'}`}>
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
