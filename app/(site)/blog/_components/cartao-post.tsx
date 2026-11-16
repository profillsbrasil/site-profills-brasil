import Image from 'next/image';
import Link from 'next/link';

import { Moldura } from '@/components/blog/moldura';
import { type ResumoPublicado, assuntos } from '@/lib/blog/tipos';

import { MetaPost } from './meta-post';
import { ArrowRight } from 'lucide-react';

export function Chamada({ texto }: { texto: string }) {
  return (
    <span className='inline-flex items-center gap-1.5 text-sm font-semibold text-white'>
      {texto}
      <ArrowRight
        aria-hidden='true'
        className='size-3.5 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none'
      />
    </span>
  );
}

/** Cartão da listagem e do fim do post. Sem capa, o cartão é só o texto. */
export function CartaoPost({ post }: { post: ResumoPublicado }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group flex h-full flex-col focus-visible:outline-none'>
      {post.capa ? (
        <Moldura className='aspect-video rounded-b-none group-hover:border-[rgba(148,178,235,0.55)] group-focus-visible:border-[rgba(148,178,235,0.55)]'>
          <Image
            src={post.capa}
            alt=''
            fill
            sizes='(min-width: 860px) 360px, (min-width: 560px) 50vw, 100vw'
            className='object-cover'
          />
        </Moldura>
      ) : null}
      <div
        className={`flex flex-1 flex-col gap-2 rounded-xs border border-dashed border-[rgba(148,178,235,0.22)] bg-[rgba(15,23,42,0.72)] px-4.5 py-4 transition-colors duration-300 group-hover:border-accent group-focus-visible:border-accent ${post.capa ? 'rounded-t-none border-t-0' : ''}`}>
        <MetaPost assunto={post.assunto} publicadoEm={post.publicadoEm} />
        <h3 className='text-[1.05rem] leading-snug font-semibold text-balance'>
          {post.titulo}
        </h3>
        <p className='line-clamp-2 min-h-[2lh] text-[0.9rem] text-[#b6c5e2]'>
          {post.resumo}
        </p>
        <span className='mt-auto pt-1'>
          <Chamada texto={assuntos[post.assunto].chamada} />
        </span>
      </div>
    </Link>
  );
}
