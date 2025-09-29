import Image from 'next/image';
import Link from 'next/link';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { Highlighter } from '@/components/magicui/highlighter';
import { Button } from '@/components/ui/button';
import CollabBro from '@/lib/images/extras/Collab-bro.png';

import { ArrowRight } from 'lucide-react';

export default function CtaMonteSuaFabrica() {
  return (
    <div className='flex w-full items-center justify-center px-4 py-10'>
      <div className='relative flex h-full min-h-80 w-full max-w-6xl flex-col items-center justify-center gap-4 rounded-xs bg-slate-900 p-6 md:min-h-96 md:gap-5 md:p-8'>
        <GridPattern />
        <Image
          src={CollabBro}
          alt='Monte sua fábrica'
          className='absolute inset-0 top-0 left-2 h-full w-fit -rotate-12 object-contain opacity-15 md:left-5 md:-rotate-20 md:opacity-20'
        />
        <Highlighter
          action='underline'
          color='#2d62ef'
          animationDuration={4000}
          textColor='z-10 text-2xl font-bold tracking-wider text-white uppercase text-center md:text-3xl'>
          Monte sua fábrica
        </Highlighter>
        <p className='z-10 w-full max-w-2xl px-2 text-center text-sm leading-relaxed text-white md:px-0 md:text-base'>
          Personalize nossas soluções para atender às necessidades específicas
          da sua empresa, garantindo o máximo desempenho e eficiência em cada
          etapa do processo.
        </p>
        <Link className='z-30 cursor-pointer' href='/montar-fabrica'>
          <Button
            size='lg'
            className='group border-border !bg-background hover:border-accent/30 group hover:bg-accent z-10 w-full rounded-xs border font-semibold text-black shadow-md transition-all duration-300 hover:scale-[1.02] md:w-auto'>
            <span className='text-sm md:text-base'>Monte sua fábrica</span>
            <ArrowRight className='group-hover:text-accent ml-2 h-5 w-5 text-black transition-transform duration-300 group-hover:translate-x-1 md:h-6 md:w-6' />
          </Button>
        </Link>
      </div>
    </div>
  );
}
