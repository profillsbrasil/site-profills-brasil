import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TextAnimate } from '@/components/ui/text-animate';
import corteLaser from '@/lib/images/extras/cortador.jpg';

import { ArrowRight } from 'lucide-react';

export default function ServicosPersonalizados() {
  return (
    <div className='flex w-full items-center justify-center px-4 pt-12 pb-16 md:pt-16'>
      <div className='flex h-full w-full max-w-6xl flex-col gap-5 md:flex-row md:gap-5'>
        {/* Moldura blueprint na foto: quadro tracejado + cantoneiras accent */}
        <div className='relative flex h-64 w-full rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] md:h-auto md:w-1/2'>
          <span
            aria-hidden
            className='absolute -top-px -left-px z-10 h-2 w-2 border-t border-l border-accent'
          />
          <span
            aria-hidden
            className='absolute -right-px -bottom-px z-10 h-2 w-2 border-r border-b border-accent'
          />
          <Image
            src={corteLaser}
            alt='Corte Laser'
            className='z-10 h-full w-full rounded-xs object-cover'
          />
        </div>
        <div className='flex min-h-full w-full flex-col items-center justify-between gap-6 md:w-1/2 md:gap-0'>
          <div className='flex flex-col items-center justify-center md:h-5/6'>
            <TextAnimate
              animation='blurInUp'
              by='word'
              as='h2'
              once
              startOnView
              className='text-2xl font-bold mb-4 text-center md:text-3xl md:mb-5'>
              Serviços Personalizados
            </TextAnimate>
            <div className='text-muted-foreground relative z-10 flex flex-col rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60 p-4 text-sm transition-colors duration-300 hover:border-solid hover:border-accent hover:bg-slate-900/85 md:p-5 md:text-base'>
              <span
                aria-hidden
                className='absolute top-0.5 right-1.5 font-mono text-xs text-[rgba(148,178,235,0.4)]'>
                +
              </span>
              <p className='mb-3'>
                Além das máquinas envasadoras, oferecemos{' '}
                <span className='text-accent font-bold'>corte a laser</span> e{' '}
                <span className='text-accent font-bold'>dobra em aço inox</span>
                .
              </p>
              <p>
                Unindo tecnologia de ponta e experiência em metalurgia,
                atendemos desde peças sob medida até projetos especiais, sempre
                com precisão e qualidade. Na Profills, inovação e excelência
                caminham juntas para transformar suas ideias em realidade.
              </p>
            </div>
          </div>
          <Link
            href='/servicos-personalizados'
            className='z-10 flex w-full items-end justify-center md:h-1/6'>
            <Button
              size='lg'
              className='group border-border hover:border-accent/30 z-10 w-full rounded-xs border !bg-white font-semibold !text-slate-900 shadow-md transition-all duration-300 hover:scale-[1.02] md:w-2/3'>
              Solicitar orçamento
              <ArrowRight className='group-hover:text-accent ml-2 h-6 w-6 text-slate-900 transition-transform duration-300 group-hover:translate-x-1' />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
