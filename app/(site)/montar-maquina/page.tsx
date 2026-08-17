import type { Metadata } from 'next';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import { GridPattern } from '@/components/layout/gridPatternBg';

import { SeletorMaquina } from './_components/seletorMaquina';

export const metadata: Metadata = {
  title: 'Monte sua Máquina | Profills',
  description:
    'Escolha a embalagem e o tipo de produto e descubra a máquina envasadora ideal para a sua linha — ou solicite uma solução sob medida da engenharia Profills.'
};

export default function MontarMaquina() {
  return (
    <div className='tema-navy bg-background text-foreground relative min-h-screen w-full pt-16'>
      <GridPattern />
      <div className='relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 md:px-8 md:pb-14'>
        <AnimatedContainer trigger='mount' className='pt-8 md:pt-12'>
          <span className='text-accent font-mono text-xs tracking-[0.2em] uppercase'>
            Configurador
          </span>
          <h1 className='mt-2 text-2xl leading-tight font-bold text-pretty text-white md:text-4xl'>
            Monte sua máquina
          </h1>
          <p className='text-muted-foreground mt-3 max-w-xl text-base text-pretty md:text-lg'>
            Escolha a embalagem e o tipo de produto; indicamos a máquina certa
            para a sua linha.
          </p>
        </AnimatedContainer>

        <AnimatedContainer trigger='mount' delay={0.2} className='mt-8'>
          <SeletorMaquina />
        </AnimatedContainer>
      </div>
    </div>
  );
}
