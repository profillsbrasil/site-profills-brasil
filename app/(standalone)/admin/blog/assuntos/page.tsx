import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { abrirAdminBlog } from '@/lib/blog/admin';
import { agruparPorAssunto } from '@/lib/blog/apresentacao';
import { type Assunto, assuntos, ehAssunto } from '@/lib/blog/tipos';

import { enderecoDeEntrada } from '../../entrar/volta';
import { dataPorExtenso } from '../_components/datas';
import { Lateral } from '../_components/lateral';

export const metadata: Metadata = { title: 'Assuntos' };

type Fim = (typeof assuntos)[keyof typeof assuntos]['fim'];

const fins: Record<Fim, string> = {
  maquina: 'Máquina e especialista',
  leitura: 'Outros posts',
  contato: 'Contatos'
};

const contagem = (n: number, singular: string) =>
  `${n} ${n === 1 ? singular : `${singular}s`}`;

const colunasPost =
  'grid grid-cols-[minmax(0,1fr)_11rem_6.5rem] items-center gap-4 px-4';

export default async function AssuntosPage({
  searchParams
}: {
  searchParams: Promise<{ assunto?: string | string[] }>;
}) {
  const admin = await abrirAdminBlog();

  if (!admin) redirect(enderecoDeEntrada('/admin/blog/assuntos'));

  const [{ assunto: pedido }, posts, imagens] = await Promise.all([
    searchParams,
    admin.listar(),
    admin.contarImagens()
  ]);

  const escolhido: Assunto = ehAssunto(pedido) ? pedido : 'maquina';
  const registro = assuntos[escolhido];
  const doEscolhido = posts.filter((p) => p.assunto === escolhido);

  const publicados = doEscolhido.filter((p) => p.estado === 'publicado').length;

  return (
    <div className='grid h-dvh grid-cols-[auto_minmax(0,1fr)] bg-[#0f172b] text-sm'>
      <Lateral atual='assuntos' totais={{ posts: posts.length, imagens }} />

      <main className='my-2 mr-2 flex min-h-0 flex-col overflow-hidden rounded-xs bg-[#f3f4f6] text-[#1b1c1f]'>
        <header className='flex min-h-14 items-center gap-3 border-b border-[#dfe2e8] bg-white px-5 py-3'>
          <h1 className='text-lg font-semibold'>Assuntos</h1>
        </header>

        <div className='grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)] items-start gap-4 overflow-y-auto p-5'>
          <nav
            aria-label='Assuntos do blog'
            className='overflow-hidden rounded-xs border border-[#dfe2e8] bg-white'>
            <ul>
              {agruparPorAssunto(posts).map(({ assunto, posts: doAssunto }) => (
                <li
                  key={assunto}
                  className='border-b border-[#eceef2] last:border-b-0'>
                  <Link
                    href={`/admin/blog/assuntos?assunto=${assunto}`}
                    aria-current={assunto === escolhido ? 'true' : undefined}
                    className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 transition-colors outline-none hover:bg-[#f7f8fa] focus-visible:bg-[#f7f8fa] motion-reduce:transition-none aria-[current=true]:bg-[#f7f8fa] aria-[current=true]:font-semibold'>
                    <span>{assuntos[assunto].plural}</span>
                    <span className='font-mono text-[#5a6172]'>
                      {doAssunto.length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section
            aria-labelledby='assunto-escolhido'
            className='overflow-hidden rounded-xs border border-[#dfe2e8] bg-white'>
            <div className='grid gap-1 border-b border-[#eceef2] px-4 py-3'>
              <h2 id='assunto-escolhido' className='text-base font-semibold'>
                {registro.plural}
              </h2>
              <p className='text-[#5a6172]'>{registro.descricao}</p>
              <p className='text-xs text-[#5a6172]'>
                Chamada no cartão: {registro.chamada} · Fim do post:{' '}
                {fins[registro.fim]} · {contagem(publicados, 'publicado')},{' '}
                {contagem(doEscolhido.length - publicados, 'rascunho')}
              </p>
            </div>

            {doEscolhido.length === 0 ? (
              <p className='px-4 py-6 text-xs text-[#5a6172]'>
                Nenhum post com este assunto ainda.
              </p>
            ) : (
              <ul>
                {doEscolhido.map(({ slug, titulo, estado, atualizadoEm }) => (
                  <li
                    key={slug}
                    className='border-b border-[#eceef2] last:border-b-0'>
                    <Link
                      href={`/admin/blog/${slug}`}
                      className={`${colunasPost} py-3 transition-colors outline-none hover:bg-[#f7f8fa] focus-visible:bg-[#f7f8fa] motion-reduce:transition-none`}>
                      <span className='truncate font-medium'>
                        {titulo || 'Sem título'}
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
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
