import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { abrirAdminBlog } from '@/lib/blog/admin';
import { assuntos } from '@/lib/blog/tipos';

import { enderecoDeEntrada } from '../entrar/volta';
import { dataPorExtenso } from './_components/datas';
import { Lateral } from './_components/lateral';
import {
  AvisosDeApagar,
  LixeiraRascunho
} from './_components/lixeira-rascunho';

export const metadata: Metadata = { title: 'Posts' };

const colunas =
  'grid grid-cols-[minmax(0,1fr)_8rem_11rem_6.5rem_2rem] items-center gap-4 px-4';

export default async function PostsPage() {
  const admin = await abrirAdminBlog();

  if (!admin) redirect(enderecoDeEntrada('/admin/blog'));

  const [posts, imagens] = await Promise.all([
    admin.listar(),
    admin.contarImagens()
  ]);

  return (
    <div className='grid h-dvh grid-cols-[auto_minmax(0,1fr)] bg-admin-lateral text-sm'>
      <Lateral atual='posts' totais={{ posts: posts.length, imagens }} />

      <main className='my-2 mr-2 flex min-h-0 flex-col overflow-hidden rounded-xs bg-admin-chao text-admin-texto'>
        <AvisosDeApagar
          cabecalho={
            <header className='flex min-h-14 items-center gap-3 border-b border-admin-borda bg-white px-5 py-3'>
              <h1 className='text-lg font-semibold'>Posts</h1>
            </header>
          }>
          <div className='min-h-0 flex-1 overflow-y-auto p-5'>
            {posts.length === 0 ? (
              <div className='grid justify-items-center gap-3 rounded-xs border border-dashed border-[#8a90a0] bg-white p-10 text-center'>
                <h2 className='text-base font-semibold'>Nenhum post ainda</h2>
                <p className='max-w-sm text-xs text-admin-apagado'>
                  Clique em Novo post para escrever o primeiro. Ele fica
                  guardado como rascunho até você publicar.
                </p>
              </div>
            ) : (
              <div className='overflow-hidden rounded-xs border border-admin-borda bg-white'>
                <div
                  aria-hidden='true'
                  className={`${colunas} border-b border-admin-borda bg-admin-cabecalho py-2 text-xs font-medium text-admin-apagado`}>
                  <span>Título</span>
                  <span>Assunto</span>
                  <span>Atualizado em</span>
                  <span>Estado</span>
                  <span />
                </div>
                <ul>
                  {posts.map(
                    ({
                      slug,
                      versao,
                      estado,
                      atualizadoEm,
                      titulo,
                      assunto
                    }) => (
                      <li
                        key={slug}
                        className='group relative border-b border-admin-borda-sutil last:border-b-0'>
                        <Link
                          href={`/admin/blog/${slug}`}
                          className={`${colunas} py-3 transition-colors outline-none group-hover:bg-admin-cabecalho focus-visible:bg-admin-cabecalho motion-reduce:transition-none`}>
                          <span className='truncate font-medium'>
                            {titulo || 'Sem título'}
                          </span>
                          <span className='text-admin-apagado'>
                            {assuntos[assunto].nome}
                          </span>
                          <span className='text-admin-apagado'>
                            {dataPorExtenso(atualizadoEm)}
                          </span>
                          <span
                            className={`justify-self-start rounded-xs px-2 py-0.5 text-xs font-medium ${estado === 'publicado' ? 'bg-[#e3f3ea] text-[#1f7a4d]' : 'bg-admin-borda-sutil text-admin-apagado'}`}>
                            {estado === 'publicado' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </Link>
                        {estado === 'rascunho' ? (
                          <LixeiraRascunho
                            slug={slug}
                            versao={versao}
                            titulo={titulo || 'Sem título'}
                          />
                        ) : null}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </AvisosDeApagar>
      </main>
    </div>
  );
}
