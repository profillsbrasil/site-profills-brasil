'use client';

import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';

export default function HeroClientes() {
  return (
    <section className='relative z-10 flex w-full flex-col items-center justify-center px-4 pt-24 pb-10 text-center md:pt-28 md:pb-14'>
      <TextAnimate
        animation='blurInUp'
        by='word'
        as='h1'
        once
        startOnView
        className='text-3xl font-bold tracking-tight text-foreground md:text-5xl'>
        Nossos Clientes
      </TextAnimate>
      <BlurFade delay={0.15} direction='up' inView>
        <p className='mt-4 max-w-xl text-sm text-muted-foreground md:text-base'>
          As marcas que confiam na engenharia Profills para suas linhas de produção.
        </p>
      </BlurFade>
    </section>
  );
}
