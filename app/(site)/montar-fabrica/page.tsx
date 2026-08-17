import type { Metadata } from 'next';
import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import { GridPattern } from '@/components/layout/gridPatternBg';
import imgFabrica from '@/lib/images/extras/fabrica-render.webp';
import { cn } from '@/lib/utils';
import { WHATSAPP_VENDAS, waLink } from '@/lib/utils/whatsapp';

import { FormOrcamento } from './_components/formOrcamento';

export const metadata: Metadata = {
  title: 'Monte sua Fábrica | Profills',
  description:
    'Projeto turn-key de fábrica completa: consultoria técnica, fabricação de máquinas sob medida, instalação e suporte. Solicite seu orçamento.'
};

const ETAPAS = [
  { rotulo: 'Etapa 01', valor: 'Projeto e consultoria técnica' },
  { rotulo: 'Etapa 02', valor: 'Fabricação das máquinas sob medida' },
  { rotulo: 'Etapa 03', valor: 'Instalação, treinamento e suporte' }
];

const OFERTA = [
  'Consultoria técnica especializada',
  'Projeto personalizado para sua operação',
  'Fabricação de máquinas sob medida',
  'Instalação e treinamento no local',
  'Suporte técnico contínuo'
];

function Cantoneiras() {
  const base = 'absolute h-2.5 w-2.5 border-accent';
  return (
    <>
      <span className={cn(base, '-top-px -left-px border-t-2 border-l-2')} />
      <span className={cn(base, '-top-px -right-px border-t-2 border-r-2')} />
      <span className={cn(base, '-bottom-px -left-px border-b-2 border-l-2')} />
      <span
        className={cn(base, '-right-px -bottom-px border-r-2 border-b-2')}
      />
    </>
  );
}

export default function MonteSuaFabrica() {
  return (
    <div className='tema-navy bg-background text-foreground relative min-h-screen w-full pt-16'>
      <GridPattern />
      <div className='relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8'>
        {/* Hero dossiê — mesma gramática do detalhe de máquina */}
        <AnimatedContainer trigger='mount' className='pt-8 md:pt-12'>
          <section className='relative border border-dashed border-[rgba(148,178,235,0.35)] p-5 md:p-8'>
            <Cantoneiras />
            <div className='flex items-center justify-between border-b border-dashed border-[rgba(148,178,235,0.25)] pb-3'>
              <span className='text-accent font-mono text-xs tracking-[0.2em] uppercase'>
                Projeto turn-key
              </span>
              <span className='text-muted-foreground/60 hidden font-mono text-xs tracking-wider uppercase md:block'>
                Consultoria · Fabricação · Instalação
              </span>
            </div>

            <div className='flex flex-col items-center gap-6 pt-6 md:flex-row'>
              <div className='w-full md:w-[45%]'>
                <h1 className='text-2xl leading-tight font-bold text-pretty text-white md:text-4xl'>
                  Monte sua fábrica
                </h1>
                <p className='text-muted-foreground mt-3 max-w-md text-base text-pretty md:text-lg'>
                  Do galpão vazio à linha produzindo: projeto, máquinas e
                  instalação com a{' '}
                  <span className='text-accent font-semibold'>
                    mesma equipe
                  </span>
                  , do início ao fim.
                </p>

                <dl className='mt-5 w-full max-w-sm font-mono'>
                  {ETAPAS.map((etapa) => (
                    <div
                      key={etapa.rotulo}
                      className='flex items-baseline justify-between gap-4 border-b border-[rgba(148,178,235,0.15)] py-2 last:border-0'>
                      <dt className='text-muted-foreground/70 text-[13px] tracking-wider whitespace-nowrap uppercase'>
                        {etapa.rotulo}
                      </dt>
                      <dd className='text-right text-base font-semibold text-pretty text-white'>
                        {etapa.valor}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className='mt-6 flex flex-wrap gap-3'>
                  <a
                    href='#orcamento'
                    className='bg-accent hover:bg-accent/85 inline-flex h-12 items-center rounded-xs px-6 text-sm font-semibold text-white transition-colors'>
                    Solicitar orçamento
                  </a>
                  <a
                    href={waLink(
                      WHATSAPP_VENDAS,
                      'Olá! Quero montar uma fábrica com a Profills.'
                    )}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-muted-foreground hover:text-foreground inline-flex h-12 items-center rounded-xs border border-[rgba(148,178,235,0.4)] px-6 text-sm font-semibold transition-colors'>
                    Falar com um especialista
                  </a>
                </div>
              </div>

              <div className='relative flex w-full justify-center md:w-[55%]'>
                <Image
                  src={imgFabrica}
                  alt='Fábrica completa montada pela Profills'
                  priority
                  placeholder='blur'
                  sizes='(min-width: 768px) 55vw, 100vw'
                  className='max-h-[320px] w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)] md:max-h-[440px]'
                />
              </div>
            </div>
          </section>
        </AnimatedContainer>

        {/* Formulário + oferta */}
        <section id='orcamento' className='scroll-mt-28 py-10 md:py-14'>
          <AnimatedContainer className='flex flex-col gap-8 md:flex-row'>
            <div className='md:w-3/5'>
              <div className='relative border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-5 md:p-6'>
                <span className='text-accent/60 absolute -top-2 -left-1 font-mono text-xs'>
                  +
                </span>
                <h2 className='flex items-center gap-2 font-mono text-sm font-semibold tracking-widest text-white uppercase'>
                  <span className='bg-accent inline-block h-1.5 w-1.5' />
                  Solicite seu orçamento
                </h2>
                <p className='text-muted-foreground/70 mt-1 mb-5 font-mono text-sm tracking-wider'>
                  Resposta do time técnico-comercial
                </p>
                <FormOrcamento />
              </div>
            </div>

            <div className='md:w-2/5'>
              <div className='relative border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-5'>
                <span className='text-accent/60 absolute -top-2 -left-1 font-mono text-xs'>
                  +
                </span>
                <h2 className='font-mono text-sm font-semibold tracking-widest text-white uppercase'>
                  O que está incluso
                </h2>
                <ul className='mt-3 space-y-2'>
                  {OFERTA.map((item) => (
                    <li
                      key={item}
                      className='text-muted-foreground flex gap-2 text-base'>
                      <span className='text-accent'>▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className='text-muted-foreground/50 mt-3 text-sm text-pretty italic'>
                Escopo definido após análise técnica do seu projeto: produto,
                volume, embalagem e capacidade desejada.
              </p>
            </div>
          </AnimatedContainer>
        </section>
      </div>
    </div>
  );
}
