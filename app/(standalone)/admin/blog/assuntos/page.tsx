import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { autorAtual } from '@/lib/admin/sessao';
import { abrirAdminBlog } from '@/lib/blog/admin';
import { agruparPorAssunto, totaisDosPosts } from '@/lib/blog/apresentacao';
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

  const [{ assunto: pedido }, posts, imagens, autor] = await Promise.all([
    searchParams,
    admin.listar(),
    admin.contarImagens(),
    autorAtual()
  ]);

  const escolhido: Assunto = ehAssunto(pedido) ? pedido : 'maquina';
  const registro = assuntos[escolhido];
  const doEscolhido = posts.filter((p) => p.assunto === escolhido);

  const publicados = doEscolhido.filter((p) => p.estado === 'publicado').length;

  return (
    <div className='grid h-dvh grid-cols-[auto_minmax(0,1fr)] bg-admin-lateral text-sm'>
      <Lateral
        atual='assuntos'
        totais={{ ...totaisDosPosts(posts), imagens }}
        usuario={autor?.usuario ?? null}
      />

      <main className='my-2 mr-2 flex min-h-0 flex-col overflow-hidden rounded-xs bg-admin-chao text-admin-texto'>
        <header className='flex min-h-14 items-center gap-3 border-b border-admin-borda bg-white px-5 py-3'>
          <h1 className='text-lg font-semibold'>Assuntos</h1>
        </header>

        <div className='grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)] items-start gap-4 overflow-y-auto p-5'>
          <nav
            aria-label='Assuntos do blog'
            className='overflow-hidden rounded-xs border border-admin-borda bg-white'>
            <ul>
              {agruparPorAssunto(posts).map(({ assunto, posts: doAssunto }) => (
                <li
                  key={assunto}
                  className='border-b border-admin-borda-sutil last:border-b-0'>
                  <Link
                    href={`/admin/blog/assuntos?assunto=${assunto}`}
                    aria-current={assunto === escolhido ? 'true' : undefined}
                    className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 transition-colors outline-none hover:bg-admin-cabecalho focus-visible:bg-admin-cabecalho motion-reduce:transition-none aria-[current=true]:bg-admin-cabecalho aria-[current=true]:font-semibold'>
                    <span>{assuntos[assunto].plural}</span>
                    <span className='font-mono text-admin-apagado'>
                      {doAssunto.length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section
            aria-labelledby='assunto-escolhido'
            className='overflow-hidden rounded-xs border border-admin-borda bg-white'>
            <div className='grid gap-1 border-b border-admin-borda-sutil px-4 py-3'>
              <h2 id='assunto-escolhido' className='text-base font-semibold'>
                {registro.plural}
              </h2>
              <p className='text-admin-apagado'>{registro.descricao}</p>
              <p className='text-xs text-admin-apagado'>
                Chamada no cartão: {registro.chamada} · Fim do post:{' '}
                {fins[registro.fim]} · {contagem(publicados, 'publicado')},{' '}
                {contagem(doEscolhido.length - publicados, 'rascunho')}
              </p>
            </div>

            {doEscolhido.length === 0 ? (
              <p className='px-4 py-6 text-xs text-admin-apagado'>
                Nenhum post com este assunto ainda.
              </p>
            ) : (
              <ul>
                {doEscolhido.map(({ slug, titulo, estado, atualizadoEm }) => (
                  <li
                    key={slug}
                    className='border-b border-admin-borda-sutil last:border-b-0'>
                    <Link
                      href={`/admin/blog/${slug}`}
                      className={`${colunasPost} py-3 transition-colors outline-none hover:bg-admin-cabecalho focus-visible:bg-admin-cabecalho motion-reduce:transition-none`}>
                      <span className='truncate font-medium'>
                        {titulo || 'Sem título'}
                      </span>
                      <span className='text-admin-apagado'>
                        {dataPorExtenso(atualizadoEm)}
                      </span>
                      <span
                        className={`justify-self-start rounded-xs px-2 py-0.5 text-xs font-medium ${estado === 'publicado' ? 'bg-[#e3f3ea] text-[#1f7a4d]' : 'bg-admin-borda-sutil text-admin-apagado'}`}>
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
