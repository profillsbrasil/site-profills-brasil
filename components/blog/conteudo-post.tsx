import Image from 'next/image';
import Link from 'next/link';

import { idYoutube } from '@/lib/blog/apresentacao';
import type { Bloco, Linha } from '@/lib/blog/tipos';
import { getMaquinaBySlug } from '@/lib/data/maquinas';
import { cn } from '@/lib/utils';

import { Moldura } from './moldura';
import { VideoYoutube } from './video-post';
import { ArrowRight, ArrowUpRight, Download, Play } from 'lucide-react';

/**
 * `publico` é a página do blog: bloco sem conteúdo some e cartão vira link.
 * `previa` é o editor do admin: bloco vazio mostra o que falta e nada navega para fora do editor sujo.
 */
export type ModoConteudo = 'publico' | 'previa';

type Contexto = { modo: ModoConteudo; emColuna: boolean };

const classeCartao =
  'grid items-center gap-x-4 gap-y-1 rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)] px-5 py-4 transition-colors duration-300';

const classeCartaoLink =
  'hover:border-solid hover:border-accent hover:bg-[rgba(15,23,42,0.9)] focus-visible:border-solid focus-visible:border-accent focus-visible:bg-[rgba(15,23,42,0.9)] focus-visible:outline-none';

const classeRotulo =
  'font-mono text-[0.68rem] tracking-wider text-[#b6c5e2] uppercase';

function Vazio({ children }: { children: string }) {
  return <span className='text-[#b6c5e2] italic opacity-70'>{children}</span>;
}

/** Na prévia, o texto que falta; na página, nada. */
const falta = ({ modo }: Contexto, rotulo: string) =>
  modo === 'previa' ? <Vazio>{rotulo}</Vazio> : null;

const urlValida = (url: string) => /^https?:\/\/[^\s]+$/.test(url);

const dominio = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

function CartaoArquivo({
  titulo,
  detalhe,
  icone
}: {
  titulo: React.ReactNode;
  detalhe: React.ReactNode;
  icone: React.ReactNode;
}) {
  return (
    <>
      <b className='font-semibold leading-snug text-white'>{titulo}</b>
      <span className={cn('col-start-1', classeRotulo)}>{detalhe}</span>
      <span className='col-start-2 row-span-2 row-start-1 grid size-10 place-items-center border border-[rgba(148,178,235,0.55)] text-white'>
        {icone}
      </span>
    </>
  );
}

function Figura({
  legenda,
  children
}: {
  legenda: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className='flex flex-col gap-2'>
      {children}
      {legenda ? (
        <figcaption className='text-[0.8rem] text-[#b6c5e2]'>
          {legenda}
        </figcaption>
      ) : null}
    </figure>
  );
}

function BlocoPost({ bloco, ctx }: { bloco: Bloco; ctx: Contexto }) {
  const publico = ctx.modo === 'publico';

  switch (bloco.tipo) {
    case 'titulo':
      if (publico && !bloco.texto.trim()) return null;

      return (
        <h2 className='mt-5 text-2xl leading-tight font-bold text-balance text-white first:mt-0'>
          {bloco.texto || falta(ctx, 'Título da seção')}
        </h2>
      );
    case 'paragrafo':
      if (publico && !bloco.texto.trim()) return null;

      return (
        <p className='whitespace-pre-line'>
          {bloco.texto || falta(ctx, 'Parágrafo vazio')}
        </p>
      );
    case 'imagem':
      if (publico && !bloco.src) return null;

      return (
        <Figura legenda={bloco.legenda || falta(ctx, 'Sem legenda')}>
          <Moldura className={ctx.emColuna ? 'aspect-[4/3]' : 'aspect-video'}>
            {bloco.src ? (
              <Image
                src={bloco.src}
                alt={bloco.legenda}
                fill
                sizes={
                  ctx.emColuna
                    ? '(min-width: 800px) 360px, 100vw'
                    : '(min-width: 800px) 720px, 100vw'
                }
                // A prévia mostra a imagem logo depois do envio, sem esperar o otimizador.
                unoptimized={!publico}
                className='object-cover'
              />
            ) : (
              falta(ctx, 'Sem imagem')
            )}
          </Moldura>
        </Figura>
      );
    case 'lista': {
      const itens = bloco.itens.filter((t) => t.trim());

      if (publico && itens.length === 0) return null;

      return (
        <ul className='grid list-disc gap-2 pl-5 marker:text-accent'>
          {itens.length > 0 ? (
            itens.map((t, i) => (
              // Itens de texto livre podem se repetir; a posição desempata.
              <li key={`${i}-${t}`}>{t}</li>
            ))
          ) : (
            <li>{falta(ctx, 'Lista vazia')}</li>
          )}
        </ul>
      );
    }

    case 'citacao':
      if (publico && !bloco.texto.trim()) return null;

      return (
        <blockquote className='rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)] px-5 py-4 text-lg leading-normal text-white'>
          {bloco.texto || falta(ctx, 'Citação')}
          {bloco.autor ? (
            <cite className='mt-2 block text-[0.8rem] text-[#b6c5e2] not-italic'>
              {bloco.autor}
            </cite>
          ) : null}
        </blockquote>
      );
    case 'tabela': {
      const linhas = bloco.linhas.filter((l) => l.some((c) => c.trim()));
      const [cabeca = [], ...corpo] = linhas;

      if (publico && linhas.length === 0) return null;

      return (
        <div className='overflow-x-auto rounded-xs border border-[rgba(148,178,235,0.3)]'>
          <table className='w-full border-collapse bg-[rgba(15,23,42,0.72)] text-[0.92rem]'>
            <thead>
              <tr>
                {cabeca.map((c, x) => (
                  <th
                    key={`${x}-${c}`}
                    scope='col'
                    className='border-b border-[rgba(148,178,235,0.3)] px-4 py-2.5 text-left text-[0.68rem] font-normal tracking-wider text-[#b6c5e2] uppercase'>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corpo.map((linha, y) => (
                <tr
                  key={`${y}-${linha.join('|')}`}
                  className='border-b border-[rgba(148,178,235,0.22)] last:border-b-0'>
                  {linha.map((c, x) => (
                    <td
                      key={`${x}-${c}`}
                      className={cn(
                        'px-4 py-2.5 whitespace-nowrap',
                        x > 0 && 'font-mono text-white tabular-nums'
                      )}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'video': {
      const id = idYoutube(bloco.url);

      if (publico && !id) return null;

      return (
        <Figura legenda={bloco.legenda || falta(ctx, 'Sem legenda')}>
          {publico && id ? (
            <VideoYoutube id={id} legenda={bloco.legenda} />
          ) : (
            <Moldura className='aspect-video'>
              <span className='grid size-16 place-items-center bg-accent text-white'>
                <Play aria-hidden='true' className='size-6 fill-current' />
              </span>
              {id ? null : (
                <span className='absolute bottom-2 left-3'>
                  {falta(ctx, 'Endereço do YouTube inválido')}
                </span>
              )}
            </Moldura>
          )}
        </Figura>
      );
    }

    case 'link': {
      if (publico && !(bloco.titulo.trim() && urlValida(bloco.url))) {
        return null;
      }

      const conteudo = (
        <CartaoArquivo
          titulo={bloco.titulo || falta(ctx, 'Título do link')}
          detalhe={bloco.url ? dominio(bloco.url) : falta(ctx, 'endereço')}
          icone={<ArrowUpRight aria-hidden='true' className='size-4' />}
        />
      );

      return publico ? (
        <a
          href={bloco.url}
          target='_blank'
          rel='noopener noreferrer'
          className={cn(
            classeCartao,
            classeCartaoLink,
            'grid-cols-[1fr_auto]'
          )}>
          {conteudo}
        </a>
      ) : (
        <div className={cn(classeCartao, 'grid-cols-[1fr_auto]')}>
          {conteudo}
        </div>
      );
    }

    case 'aviso':
      if (publico && !(bloco.titulo.trim() || bloco.texto.trim())) return null;

      return (
        <div className='rounded-xs border border-[rgba(148,178,235,0.55)] bg-[rgba(59,128,246,0.1)] px-5 py-4'>
          <p className='font-semibold text-white'>
            {bloco.titulo || falta(ctx, 'Título do aviso')}
          </p>
          {bloco.texto ? <p className='mt-1'>{bloco.texto}</p> : null}
        </div>
      );
    case 'maquina': {
      const maquina = getMaquinaBySlug(bloco.slug);

      if (!maquina) return falta(ctx, 'Máquina não encontrada');

      const conteudo = (
        <>
          {maquina.imagens ? (
            <Image
              src={maquina.imagens.maquina}
              alt=''
              sizes='112px'
              className='aspect-[4/3] w-full object-contain'
            />
          ) : (
            <span />
          )}
          <span>
            <b className='block leading-snug font-semibold text-white'>
              {maquina.seo.titulo}
            </b>
            <small className='mt-0.5 block text-[0.82rem] leading-snug text-[#b6c5e2]'>
              {maquina.headline}
            </small>
          </span>
          {publico ? (
            <span className='hidden items-center gap-1.5 text-sm font-semibold whitespace-nowrap text-white sm:inline-flex'>
              Ver a máquina
              <ArrowRight
                aria-hidden='true'
                className='size-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none'
              />
            </span>
          ) : null}
        </>
      );

      const grade = 'grid-cols-[5rem_1fr] sm:grid-cols-[7rem_1fr_auto]';

      return publico ? (
        <Link
          href={`/maquinas/${maquina.slug}`}
          className={cn('group', classeCartao, classeCartaoLink, grade)}>
          {conteudo}
        </Link>
      ) : (
        <div className={cn(classeCartao, grade)}>{conteudo}</div>
      );
    }

    case 'download': {
      if (publico && !bloco.titulo.trim()) return null;

      const conteudo = (
        <CartaoArquivo
          titulo={bloco.titulo || falta(ctx, 'Título do arquivo')}
          detalhe={bloco.arquivo || falta(ctx, 'Tipo e tamanho')}
          icone={<Download aria-hidden='true' className='size-4' />}
        />
      );

      // O site só entrega arquivo pelo formulário de /download (catálogo com token); o bloco leva até lá.
      return publico ? (
        <Link
          href='/download'
          className={cn(
            classeCartao,
            classeCartaoLink,
            'grid-cols-[1fr_auto]'
          )}>
          {conteudo}
        </Link>
      ) : (
        <div className={cn(classeCartao, 'grid-cols-[1fr_auto]')}>
          {conteudo}
        </div>
      );
    }
  }
}

/**
 * O corpo do post: as linhas, com 1 ou 2 colunas na proporção gravada.
 * `celular` só vale na prévia, que não tem media query própria; a página empilha abaixo de md.
 */
export function ConteudoPost({
  linhas,
  modo,
  celular = false
}: {
  linhas: Linha[];
  modo: ModoConteudo;
  celular?: boolean;
}) {
  const lado =
    modo === 'publico'
      ? 'md:[grid-template-columns:var(--colunas)]'
      : celular
        ? ''
        : '[grid-template-columns:var(--colunas)]';

  return (
    <>
      {linhas.map((linha) =>
        linha.colunas.length === 1 ? (
          <BlocoPost
            key={linha.id}
            bloco={linha.colunas[0]}
            ctx={{ modo, emColuna: false }}
          />
        ) : (
          <div
            key={linha.id}
            className={cn('grid items-start gap-5', lado)}
            style={{
              '--colunas': `minmax(0, ${linha.proporcao}fr) minmax(0, ${100 - linha.proporcao}fr)`
            }}>
            {linha.colunas.map((bloco) => (
              <div key={bloco.id} className='flex min-w-0 flex-col gap-5'>
                <BlocoPost bloco={bloco} ctx={{ modo, emColuna: true }} />
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
}
