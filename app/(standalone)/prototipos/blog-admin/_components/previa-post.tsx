import Image from 'next/image';

import { getMaquinaBySlug } from '@/lib/data/maquinas';

import { type Bloco, type Post, assuntos } from './tipos';
import { Download, ExternalLink, Play } from 'lucide-react';

export type Dispositivo = 'computador' | 'celular';

const vazio = (texto: string) => (
  <span className='text-[#b6c5e2] italic opacity-70'>{texto}</span>
);

const dominio = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url || 'endereço';
  }
};

function CartaoLink({
  titulo,
  detalhe,
  icone
}: {
  titulo: React.ReactNode;
  detalhe: string;
  icone: React.ReactNode;
}) {
  return (
    <div className='grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-0.5 border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)] px-4 py-3.5'>
      <b className='font-semibold text-white'>{titulo}</b>
      <small className='col-start-1 font-mono text-[0.68rem] tracking-wider text-[#b6c5e2] uppercase'>
        {detalhe}
      </small>
      <i className='col-start-2 row-span-2 row-start-1 grid size-9 place-items-center border border-[rgba(148,178,235,0.55)] text-white not-italic'>
        {icone}
      </i>
    </div>
  );
}

function PreviaBloco({ bloco }: { bloco: Bloco }) {
  switch (bloco.tipo) {
    case 'titulo':
      return (
        <h2 className='mt-2 text-xl leading-tight font-bold text-white'>
          {bloco.texto || vazio('Título da seção')}
        </h2>
      );
    case 'paragrafo':
      return <p>{bloco.texto || vazio('Parágrafo vazio')}</p>;
    case 'imagem':
      return (
        <figure className='flex flex-col gap-1.5'>
          <div className='relative grid aspect-[4/3] place-items-center overflow-hidden border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,43,0.82)]'>
            {bloco.src ? (
              // A imagem vem de URL.createObjectURL, que o next/image não otimiza.
              // oxlint-disable-next-line nextjs/no-img-element
              <img
                src={bloco.src}
                alt={bloco.legenda}
                className='absolute inset-0 size-full object-cover'
              />
            ) : (
              vazio('Sem imagem')
            )}
          </div>
          <figcaption className='text-xs text-[#b6c5e2]'>
            {bloco.legenda || vazio('Sem legenda')}
          </figcaption>
        </figure>
      );
    case 'lista': {
      const itens = bloco.itens.filter((t) => t.trim());

      return (
        <ul className='grid list-disc gap-1.5 pl-5 marker:text-[#3b80f6]'>
          {itens.length > 0 ? (
            itens.map((t, i) => (
              // Itens de texto livre podem se repetir; a posição desempata.
              <li key={`${i}-${t}`}>{t}</li>
            ))
          ) : (
            <li>{vazio('Lista vazia')}</li>
          )}
        </ul>
      );
    }

    case 'citacao':
      return (
        <blockquote className='border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)] px-4 py-4 text-lg leading-normal text-white'>
          {bloco.texto || vazio('Citação')}
          {bloco.autor ? (
            <cite className='mt-2 block text-xs text-[#b6c5e2] not-italic'>
              {bloco.autor}
            </cite>
          ) : null}
        </blockquote>
      );
    case 'tabela': {
      const [cabeca = [], ...corpo] = bloco.linhas;

      return (
        <div className='overflow-x-auto border border-[rgba(148,178,235,0.3)]'>
          <table className='w-full border-collapse bg-[rgba(15,23,42,0.72)] text-sm'>
            <thead>
              <tr>
                {cabeca.map((c, x) => (
                  <th
                    key={`${x}-${c}`}
                    className='border-b border-[rgba(148,178,235,0.3)] px-3 py-2 text-left text-[0.66rem] font-normal tracking-wider text-[#b6c5e2] uppercase'>
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
                      className={`px-3 py-2 ${x > 0 ? 'font-mono text-white' : ''}`}>
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

    case 'video':
      return (
        <figure className='flex flex-col gap-1.5'>
          <div className='grid aspect-video place-items-center border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,43,0.82)]'>
            <span className='grid size-12 place-items-center bg-[#3b80f6] text-white'>
              <Play aria-hidden='true' className='size-5 fill-current' />
            </span>
          </div>
          <figcaption className='text-xs text-[#b6c5e2]'>
            {bloco.legenda || vazio('Sem legenda')}
            {bloco.url ? ` · ${dominio(bloco.url)}` : ''}
          </figcaption>
        </figure>
      );
    case 'link':
      return (
        <CartaoLink
          titulo={bloco.titulo || vazio('Título do link')}
          detalhe={dominio(bloco.url)}
          icone={<ExternalLink aria-hidden='true' className='size-4' />}
        />
      );
    case 'aviso':
      return (
        <div className='border border-[rgba(148,178,235,0.55)] bg-[rgba(59,128,246,0.1)] px-4 py-3.5'>
          <b className='block font-semibold text-white'>
            {bloco.titulo || vazio('Título do aviso')}
          </b>
          {bloco.texto}
        </div>
      );
    case 'maquina': {
      const maquina = getMaquinaBySlug(bloco.slug);

      if (!maquina) return vazio('Máquina não encontrada');

      return (
        <div className='grid grid-cols-[5.5rem_1fr] items-center gap-4 border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)] px-4 py-3.5'>
          {maquina.imagens ? (
            <Image
              src={maquina.imagens.maquina}
              alt=''
              sizes='88px'
              className='aspect-[4/3] w-full object-contain'
            />
          ) : (
            <span />
          )}
          <span>
            <b className='block font-semibold text-white'>
              {maquina.seo.titulo}
            </b>
            <small className='text-[0.8rem] text-[#b6c5e2]'>
              {maquina.headline}
            </small>
          </span>
        </div>
      );
    }

    case 'download':
      return (
        <CartaoLink
          titulo={bloco.titulo || vazio('Título do arquivo')}
          detalhe={bloco.arquivo}
          icone={<Download aria-hidden='true' className='size-4' />}
        />
      );
  }
}

const fundoGrade = {
  backgroundImage:
    'linear-gradient(rgba(148,163,184,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.1) 1px,transparent 1px)',
  backgroundSize: '20px 20px'
};

export function PreviaPost({
  post,
  dispositivo
}: {
  post: Post;
  dispositivo: Dispositivo;
}) {
  const celular = dispositivo === 'celular';

  return (
    <article
      data-previa={dispositivo}
      className='overflow-hidden rounded-xs bg-[#0f172b] text-[15px] leading-relaxed text-white'
      style={fundoGrade}>
      <header
        className={`grid items-center gap-6 border-b border-dashed border-[rgba(148,178,235,0.22)] bg-[#172038] px-6 pt-7 pb-13 ${post.capa && !celular ? 'grid-cols-[1.2fr_1fr]' : 'grid-cols-1'}`}>
        <div>
          <h1 className='text-[clamp(1.4rem,3vw,2.2rem)] leading-[1.08] font-extrabold tracking-tight text-balance'>
            {post.titulo || vazio('Título do post')}
          </h1>
          <p className='mt-3 text-base leading-normal text-[#b6c5e2]'>
            {post.resumo || vazio('Resumo')}
          </p>
          <div className='mt-3.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.66rem] tracking-wider text-[#b6c5e2] uppercase'>
            <b className='flex items-center gap-1.5 font-normal text-white'>
              <span aria-hidden='true' className='size-1.5 bg-[#3b80f6]' />
              {assuntos[post.assunto].nome}
            </b>
            <span>15 nov 2026</span>
          </div>
        </div>
        {post.capa ? (
          // A capa pode vir de URL.createObjectURL, que o next/image não otimiza.
          // oxlint-disable-next-line nextjs/no-img-element
          <img
            src={post.capa}
            alt=''
            className='aspect-[4/3] w-full object-contain'
          />
        ) : null}
      </header>
      <div
        className={`-mt-8 mb-6 flex flex-col gap-4 border border-dashed border-[rgba(148,178,235,0.3)] bg-[#0d1424] text-[#d9e1f2] ${celular ? 'mx-2.5 p-4' : 'mx-5 p-6'}`}>
        {post.linhas.length === 0
          ? vazio('O post ainda não tem conteúdo.')
          : null}
        {post.linhas.map((linha) =>
          linha.colunas.length === 1 ? (
            <div key={linha.id} data-previa-linha={linha.id}>
              <PreviaBloco bloco={linha.colunas[0]} />
            </div>
          ) : (
            <div
              key={linha.id}
              data-previa-linha={linha.id}
              className='grid items-start gap-4'
              style={
                celular
                  ? undefined
                  : {
                      gridTemplateColumns: `minmax(0, ${linha.proporcao}fr) minmax(0, ${100 - linha.proporcao}fr)`
                    }
              }>
              {linha.colunas.map((bloco) => (
                <div key={bloco.id} className='min-w-0'>
                  <PreviaBloco bloco={bloco} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </article>
  );
}
