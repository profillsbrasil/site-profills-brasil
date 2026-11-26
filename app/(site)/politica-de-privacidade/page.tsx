import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/components/seo/jsonLd';
import desenhoCadeado from '@/lib/images/privacidade/cadeado.webp';
import { metadataDaPagina } from '@/lib/seo/metadata';
import { breadcrumbSchema } from '@/lib/seo/schemas';
import { cn } from '@/lib/utils';

import {
  Carimbo,
  Desenho,
  Moldura,
  classeLinha,
  classeRecuoLateral,
  classeTexto
} from './_components/folha';
import { Secoes, secoes } from './_components/secoes';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Política de Privacidade',
  descricao:
    'Quais dados a Profills trata, para quê e quais são os seus direitos, conforme a Lei Geral de Proteção de Dados (LGPD).',
  path: '/politica-de-privacidade'
});

const classeBotaoCheio =
  'inline-flex items-center rounded-xs bg-white px-4 py-2.5 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#dbe6fb] focus-visible:bg-[#dbe6fb] focus-visible:outline-none';

const classeBotaoLinha =
  'inline-flex items-center rounded-xs border border-dashed border-[rgba(148,178,235,0.55)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-solid hover:border-accent focus-visible:border-solid focus-visible:border-accent focus-visible:outline-none';

function Capa() {
  return (
    <Moldura aria-labelledby='politica-titulo'>
      <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,40rem)_minmax(0,1fr)]'>
        <div
          className={cn(
            'flex flex-col gap-4 py-[clamp(1.5rem,3vw,2.25rem)]',
            classeRecuoLateral
          )}>
          <nav
            aria-label='Você está em'
            className='flex flex-wrap gap-1.5 text-[0.8rem] text-[#b6c5e2]'>
            <Link
              href='/'
              className='transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none'>
              Início
            </Link>
            <span aria-hidden='true' className='opacity-50'>
              /
            </span>
            <span>Política de Privacidade</span>
          </nav>
          <h1
            id='politica-titulo'
            className='text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.08] font-extrabold tracking-tight text-balance'>
            Política de Privacidade
          </h1>
          <div className='flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[0.72rem] tracking-wider text-[#b6c5e2] uppercase'>
            <span className='flex items-center gap-2 text-white'>
              <span aria-hidden='true' className='size-1.5 bg-accent' />
              LGPD
            </span>
            <span>
              Atualizada em{' '}
              <time dateTime='2026-11-26' className='font-mono tabular-nums'>
                26 nov 2026
              </time>
            </span>
          </div>
          <div className={classeTexto}>
            <p>
              A Profills Brasil Industria e Fabricacao LTDA, inscrita no CNPJ
              22.198.308/0001-26, com sede na Avenida São Paulo, 454, Jardim São
              Lucas, CEP 18767-024, Cerqueira César, São Paulo, fabrica máquinas
              de envase e respeita a privacidade de quem visita o nosso site,
              fala com a nossa equipe ou segue as nossas redes sociais.
            </p>
            <p>
              Esta política explica, de forma simples, quais dados tratamos,
              para quê e quais são os seus direitos, conforme a Lei Geral de
              Proteção de Dados (Lei nº 13.709/2018, a LGPD).
            </p>
          </div>
        </div>
        <Desenho
          src={desenhoCadeado}
          alto
          className='px-[clamp(1.25rem,3vw,2.25rem)] pb-[clamp(1.5rem,3vw,2.25rem)] lg:pt-[clamp(1.5rem,3vw,2.25rem)] lg:pl-0'
        />
      </div>
      <nav
        aria-label='Seções da política'
        className={cn('border-t py-5', classeLinha, classeRecuoLateral)}>
        <ol className='columns-1 gap-12 sm:columns-2'>
          {secoes.map(({ id, titulo }, i) => (
            <li key={id} className='break-inside-avoid'>
              <a
                href={`#${id}`}
                className='flex items-baseline gap-3 py-1 text-[0.9375rem] text-[#b6c5e2] transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none'>
                <span className='font-mono text-xs tabular-nums'>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{titulo}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <Carimbo folha='Capa' capa />
    </Moldura>
  );
}

function Chamada() {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-xs border bg-[rgba(15,23,42,0.72)] py-6',
        classeLinha,
        classeRecuoLateral
      )}>
      <div>
        <h2 className='text-xl leading-tight font-bold'>
          Quer falar sobre os seus dados?
        </h2>
        <p className='mt-1.5 text-[0.9375rem] text-[#b6c5e2]'>
          Você pode pedir acesso, correção ou eliminação a qualquer momento.
        </p>
      </div>
      <div className='flex flex-wrap gap-2.5'>
        <a href='#seus-direitos' className={classeBotaoLinha}>
          Ver os seus direitos
        </a>
        <a href='#contato' className={classeBotaoCheio}>
          Ver o contato
        </a>
      </div>
    </div>
  );
}

export default function PoliticaDePrivacidade() {
  return (
    <div className='relative min-h-screen w-full bg-[#0f172b] bg-[linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-size-[20px_20px] pt-16 text-white'>
      <JsonLd
        data={breadcrumbSchema([
          { nome: 'Início', path: '/' },
          {
            nome: 'Política de Privacidade',
            path: '/politica-de-privacidade'
          }
        ])}
      />
      <article className='mx-auto flex w-full max-w-[72rem] flex-col gap-5 px-4 pt-6 pb-18'>
        <Capa />
        <Secoes />
        <Chamada />
      </article>
    </div>
  );
}
