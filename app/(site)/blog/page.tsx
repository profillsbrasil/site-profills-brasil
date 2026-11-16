import Link from 'next/link';

import { montarListagem } from '@/lib/blog/apresentacao';
import { listarPublicados } from '@/lib/blog/leitura';
import { type ResumoPublicado, assuntos, ehAssunto } from '@/lib/blog/tipos';
import { metadataDaPagina } from '@/lib/seo/metadata';
import { cn } from '@/lib/utils';

import { CartaoPost, Chamada } from './_components/cartao-post';
import { MetaPost } from './_components/meta-post';
import {
  PaginaBlog,
  classeBotaoCheio,
  classeWrap
} from './_components/pagina-blog';

export const metadata = metadataDaPagina({
  titulo: 'Blog',
  descricao:
    'Novidades da Profills: máquinas novas, embalagens, parceiros, eventos e avisos da fábrica.',
  path: '/blog'
});

const classeChip =
  'inline-flex items-center gap-2 rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)] px-3 py-1.5 text-[0.8rem] text-[#b6c5e2] transition-colors duration-300 hover:border-solid hover:border-accent hover:text-white focus-visible:border-solid focus-visible:border-accent focus-visible:text-white focus-visible:outline-none aria-[current=page]:border-solid aria-[current=page]:border-accent aria-[current=page]:text-white';

function Chip({
  href,
  ativo,
  nome,
  total
}: {
  href: string;
  ativo: boolean;
  nome: string;
  total: number;
}) {
  return (
    <Link
      href={href}
      aria-current={ativo ? 'page' : undefined}
      className={classeChip}>
      {nome}
      <span className='font-mono text-[0.72rem] opacity-80'>{total}</span>
    </Link>
  );
}

function Nota({ post }: { post: ResumoPublicado }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group block border-b border-dashed border-[rgba(148,178,235,0.22)] px-4.5 py-4 transition-colors duration-300 last:border-b-0 hover:bg-[rgba(59,128,246,0.1)] focus-visible:bg-[rgba(59,128,246,0.1)] focus-visible:outline-none'>
      <MetaPost assunto={post.assunto} publicadoEm={post.publicadoEm} />
      <h3 className='mt-1.5 mb-2 text-[0.98rem] leading-snug font-semibold'>
        {post.titulo}
      </h3>
      <Chamada texto={assuntos[post.assunto].chamada} />
    </Link>
  );
}

export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ assunto?: string | string[] }>;
}) {
  const { assunto } = await searchParams;
  const filtro = ehAssunto(assunto) ? assunto : null;
  const publicados = await listarPublicados();

  const { fixado, contagem, destaques, notas } = montarListagem(
    publicados,
    filtro,
    new Date()
  );

  return (
    <PaginaBlog tela='listagem'>
      <header className='border-b border-dashed border-[rgba(148,178,235,0.22)]'>
        <div className={`${classeWrap} pt-14 pb-9`}>
          <h1 className='max-w-[16ch] text-[clamp(1.9rem,3.9vw,3.5rem)] leading-[1.06] font-extrabold tracking-tight text-balance'>
            O que há de novo <span className='text-accent'>na Profills</span>
          </h1>
          <p className='mt-4 max-w-[46ch] text-[#b6c5e2]'>
            Máquinas, embalagens, parceiros, eventos e avisos da fábrica.
          </p>
          {fixado ? (
            <Link
              href={`/blog/${fixado.slug}`}
              className='group mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1.5 rounded-xs border border-[rgba(148,178,235,0.55)] bg-[rgba(15,23,42,0.72)] px-4 py-3 transition-colors duration-300 hover:border-accent focus-visible:border-accent focus-visible:outline-none'>
              <span className='text-[0.68rem] tracking-wider text-white uppercase'>
                Aviso fixado
              </span>
              <b className='min-w-56 flex-1 text-[0.95rem] font-semibold'>
                {fixado.titulo}
              </b>
              <Chamada texto={assuntos.aviso.chamada} />
            </Link>
          ) : null}
          {contagem.length > 1 ? (
            <nav aria-label='Assuntos' className='mt-7 flex flex-wrap gap-2'>
              <Chip
                href='/blog'
                ativo={filtro === null}
                nome='Todos'
                total={publicados.length}
              />
              {contagem.map((c) => (
                <Chip
                  key={c.assunto}
                  href={`/blog?assunto=${c.assunto}`}
                  ativo={filtro === c.assunto}
                  nome={assuntos[c.assunto].plural}
                  total={c.total}
                />
              ))}
            </nav>
          ) : null}
        </div>
      </header>

      <div className={`${classeWrap} pt-10 pb-16`}>
        {destaques.length === 0 && notas.length === 0 ? (
          <div className='max-w-xl rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)] p-8'>
            <h2 className='text-xl font-bold'>
              {filtro
                ? 'Nenhum post neste assunto ainda'
                : 'Os primeiros posts estão a caminho'}
            </h2>
            <p className='mt-2 mb-6 text-[#b6c5e2]'>
              {filtro
                ? 'Veja os outros assuntos do blog.'
                : 'Enquanto isso, conheça as máquinas que a Profills fabrica.'}
            </p>
            <Link
              href={filtro ? '/blog' : '/maquinas'}
              className={classeBotaoCheio}>
              {filtro ? 'Ver todos os posts' : 'Ver as máquinas'}
            </Link>
          </div>
        ) : (
          <div
            className={cn(
              'grid items-start gap-8',
              destaques.length > 0 &&
                notas.length > 0 &&
                'min-[861px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'
            )}>
            {destaques.length > 0 ? (
              <section aria-labelledby='destaques'>
                <h2 id='destaques' className='mb-4 text-xl font-bold'>
                  Destaques
                </h2>
                <div
                  className={cn(
                    'grid gap-5 sm:grid-cols-2',
                    notas.length === 0 && 'min-[861px]:grid-cols-3'
                  )}>
                  {destaques.map((p) => (
                    <CartaoPost key={p.slug} post={p} />
                  ))}
                </div>
              </section>
            ) : null}
            {notas.length > 0 ? (
              <section
                aria-labelledby='notas'
                className='min-[861px]:sticky min-[861px]:top-28'>
                <h2 id='notas' className='mb-4 text-xl font-bold'>
                  Notas rápidas
                </h2>
                <div className='rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)]'>
                  {notas.map((p) => (
                    <Nota key={p.slug} post={p} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </PaginaBlog>
  );
}
