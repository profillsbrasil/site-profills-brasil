import { cache } from 'react';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ConteudoPost } from '@/components/blog/conteudo-post';
import { JsonLd } from '@/components/seo/jsonLd';
import { minutosDeLeitura, outrosPosts } from '@/lib/blog/apresentacao';
import { lerPublicado, listarPublicados } from '@/lib/blog/leitura';
import { assuntos } from '@/lib/blog/tipos';
import { breadcrumbSchema, postBlogSchema } from '@/lib/seo/schemas';
import { OG_IMAGE, SITE_LOCALE, SITE_NAME } from '@/lib/seo/site';

import { FimPost } from '../_components/fim-post';
import { MetaPost } from '../_components/meta-post';
import { PaginaBlog, classeWrap } from '../_components/pagina-blog';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// generateMetadata e a página leem o mesmo post: uma consulta por requisição.
const lerPost = cache(lerPublicado);

export async function generateMetadata({
  params
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guardado = await lerPost(slug);

  if (!guardado) return {};
  const { post } = guardado;
  const url = `/blog/${guardado.slug}`;
  const tituloComMarca = `${post.titulo} | ${SITE_NAME}`;

  const imagem = post.capa
    ? { url: post.capa, alt: post.titulo }
    : { url: OG_IMAGE, width: 1200, height: 630, alt: post.titulo };

  return {
    title: post.titulo,
    description: post.resumo,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title: tituloComMarca,
      description: post.resumo,
      publishedTime: guardado.publicadoEm,
      modifiedTime: guardado.atualizadoEm,
      section: assuntos[post.assunto].nome,
      images: [imagem]
    },
    twitter: {
      card: 'summary_large_image',
      title: tituloComMarca,
      description: post.resumo,
      images: [imagem.url]
    }
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const [guardado, publicados] = await Promise.all([
    lerPost(slug),
    listarPublicados()
  ]);

  if (!guardado) notFound();
  const { post } = guardado;
  const assunto = assuntos[post.assunto];

  return (
    <PaginaBlog tela='leitura'>
      <JsonLd data={postBlogSchema(guardado)} />
      <JsonLd
        data={breadcrumbSchema([
          { nome: 'Início', path: '/' },
          { nome: 'Blog', path: '/blog' },
          { nome: post.titulo, path: `/blog/${guardado.slug}` }
        ])}
      />
      <article>
        <div className='border-b border-dashed border-[rgba(148,178,235,0.22)] bg-[#172038]'>
          <div
            className={`${classeWrap} grid items-center gap-10 pt-8 pb-18 md:pt-12 md:pb-20 ${post.capa ? 'md:grid-cols-2' : ''}`}>
            <div>
              <nav
                aria-label='Você está em'
                className='mb-5 flex flex-wrap gap-1.5 text-[0.8rem] text-[#b6c5e2]'>
                <Link
                  href='/blog'
                  className='transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none'>
                  Blog
                </Link>
                <span aria-hidden='true' className='opacity-50'>
                  /
                </span>
                <Link
                  href={`/blog?assunto=${post.assunto}`}
                  className='transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none'>
                  {assunto.plural}
                </Link>
              </nav>
              <h1 className='text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.08] font-extrabold tracking-tight text-balance'>
                {post.titulo}
              </h1>
              {post.resumo ? (
                <p className='mt-4 max-w-[60ch] text-[1.15rem] leading-normal text-[#b6c5e2]'>
                  {post.resumo}
                </p>
              ) : null}
              <div className='mt-5'>
                <MetaPost
                  assunto={post.assunto}
                  publicadoEm={guardado.publicadoEm}
                  minutos={minutosDeLeitura(post)}
                />
              </div>
            </div>
            {post.capa ? (
              <div className='relative aspect-[4/3]'>
                <Image
                  src={post.capa}
                  alt=''
                  fill
                  preload
                  sizes='(min-width: 768px) 560px, 100vw'
                  className='object-contain'
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className={`${classeWrap} pb-18`}>
          <div className='mx-auto -mt-12 max-w-[50rem] rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[#0d1424] px-[clamp(1.1rem,4vw,3rem)] py-10'>
            <div className='flex max-w-[68ch] flex-col gap-[1.15rem] text-[1.0625rem] leading-[1.7] text-[#d9e1f2]'>
              <ConteudoPost linhas={post.linhas} modo='publico' />
            </div>
          </div>
          <div className='mx-auto max-w-[50rem]'>
            <FimPost
              guardado={guardado}
              outros={outrosPosts(publicados, guardado.slug)}
            />
          </div>
        </div>
      </article>
    </PaginaBlog>
  );
}
