import Image from 'next/image';
import Link from 'next/link';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { BlurFade } from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { TextAnimate } from '@/components/ui/text-animate';
import CollabBro from '@/lib/images/extras/Collab-bro.png';

import { ArrowRight } from 'lucide-react';

export default function CtaMonteSuaFabrica() {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10'>
      <BlurFade delay={0.1} inView className='w-full'>
        <div className='relative flex h-full min-h-80 w-full flex-col items-center justify-center gap-4 rounded-xs bg-secondary p-6 md:min-h-96 md:gap-5 md:p-8'>
          <GridPattern />
          <Image
            src={CollabBro}
            alt='Monte sua fábrica'
            className='absolute inset-0 top-0 left-2 h-full w-fit -rotate-12 object-contain opacity-15 md:left-5 md:-rotate-20 md:opacity-20'
          />
          <TextAnimate animation='blurInUp' by='word' as='h2' once startOnView className='z-10 text-2xl font-bold tracking-wider text-secondary-foreground uppercase text-center md:text-3xl'>
            Monte sua fábrica
          </TextAnimate>
          <p className='z-10 w-full max-w-2xl px-2 text-center text-sm leading-relaxed text-secondary-foreground/80 md:px-0 md:text-base'>
            Planeje sua linha de produção do zero — da escolha das máquinas
            ao layout fabril. Nossa equipe projeta junto com você.
          </p>
          <Link className='z-30 cursor-pointer' href='/montar-fabrica'>
            <Button
              size='lg'
              className='group border-border !bg-background hover:border-accent/30 hover:bg-accent z-10 w-full rounded-xs border font-semibold text-foreground shadow-md transition-all duration-300 hover:scale-[1.02] md:w-auto'>
              <span className='text-sm md:text-base'>Começar meu projeto</span>
              <ArrowRight className='group-hover:text-accent ml-2 h-5 w-5 text-foreground transition-transform duration-300 group-hover:translate-x-1 md:h-6 md:w-6' />
            </Button>
          </Link>
        </div>
      </BlurFade>
    </div>
  );
}
