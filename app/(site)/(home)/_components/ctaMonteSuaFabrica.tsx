import Image from 'next/image';
import Link from 'next/link';

import { BlurFade } from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { TextAnimate } from '@/components/ui/text-animate';
import CollabBro from '@/lib/images/extras/Collab-bro.png';

import { ArrowRight } from 'lucide-react';

export default function CtaMonteSuaFabrica() {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10'>
      <BlurFade delay={0.1} inView className='w-full'>
        <div className='flex flex-col items-center gap-8 md:flex-row md:gap-10'>
          {/* Ilustração livre sobre o grid, flutuando como a embalagem do hero */}
          <div className='w-3/5 max-w-[360px] flex-none md:w-2/5 md:self-center'>
            <Image
              src={CollabBro}
              alt='Monte sua fábrica'
              sizes='(max-width: 768px) 60vw, 360px'
              className='h-auto w-full animate-[hero-flutua_6s_ease-in-out_infinite] motion-reduce:animate-none'
            />
          </div>

          {/* Placa técnica com cantoneiras accent */}
          <div className='relative flex w-full flex-1 flex-col justify-center gap-4 rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60 p-8 transition-colors duration-300 hover:border-solid hover:border-accent hover:bg-slate-900/85 md:p-10'>
            <span
              aria-hidden
              className='absolute -top-px -left-px z-10 h-2 w-2 border-t border-l border-accent'
            />
            <span
              aria-hidden
              className='absolute -right-px -bottom-px z-10 h-2 w-2 border-r border-b border-accent'
            />
            <TextAnimate
              animation='blurInUp'
              by='word'
              as='h2'
              once
              startOnView
              className='text-2xl font-extrabold tracking-wider text-white uppercase md:text-3xl'>
              Monte sua fábrica
            </TextAnimate>
            <p className='text-muted-foreground max-w-[48ch] text-sm leading-relaxed md:text-base'>
              Planeje sua linha de produção do zero: da escolha das máquinas ao
              layout fabril. Nossa equipe projeta junto com você.
            </p>
            <Link
              href='/montar-fabrica'
              className='z-10 mt-1 w-full cursor-pointer md:w-fit md:self-end'>
              <Button
                size='lg'
                className='group border-border hover:border-accent/30 z-10 w-full rounded-xs border !bg-white font-semibold !text-slate-900 shadow-md transition-all duration-300 hover:scale-[1.02] md:w-auto'>
                <span className='text-sm md:text-base'>
                  Começar meu projeto
                </span>
                <ArrowRight className='group-hover:text-accent ml-2 h-5 w-5 text-slate-900 transition-transform duration-300 group-hover:translate-x-1 md:h-6 md:w-6' />
              </Button>
            </Link>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
