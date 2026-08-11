'use client';

import type React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  type MaquinaData,
  maquinasData
} from '@/app/(site)/maquinas/_components/cardMaquinas/maquinasData';
import { AnimatedContainer } from '@/components/AnimatedContainer';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, Package, Zap } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

// Seleciona as 5 máquinas principais para destaque
const featuredMachines = maquinasData.filter((machine) =>
  [1, 2, 16, 22, 27].includes(machine.id)
);

export type FeatureCardProps = React.ComponentProps<'div'> & {
  machine: MaquinaData;
  /** Intervalo do autoplay máquina↔embalagem — valores diferentes por card
      para as trocas não acontecerem em uníssono */
  atrasoAutoplay?: number;
};

export default function CardGridSket() {
  return (
    <div className='mx-auto w-full max-w-6xl space-y-4 md:space-y-6'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-4'>
        {/* Large card - spans 2 columns */}
        <AnimatedContainer delay={0} className='md:col-span-2 md:row-span-1'>
          <FeatureCard
            machine={featuredMachines[2]}
            atrasoAutoplay={8000}
            className='h-full'
          />
        </AnimatedContainer>

        {/* Medium card - spans 1 column */}
        <AnimatedContainer delay={0.1} className='md:col-span-1 md:row-span-1'>
          <FeatureCard
            machine={featuredMachines[0]}
            atrasoAutoplay={9500}
            className='h-full'
          />
        </AnimatedContainer>

        {/* Bottom 3 cards - equal columns */}
        <AnimatedContainer delay={0.2} className='md:col-span-1'>
          <FeatureCard
            machine={featuredMachines[1]}
            atrasoAutoplay={11000}
            className='h-full'
          />
        </AnimatedContainer>

        <AnimatedContainer delay={0.3} className='md:col-span-1'>
          <FeatureCard
            machine={featuredMachines[4]}
            atrasoAutoplay={12500}
            className='h-full'
          />
        </AnimatedContainer>

        <AnimatedContainer delay={0.4} className='md:col-span-1'>
          <FeatureCard
            machine={featuredMachines[3]}
            atrasoAutoplay={14000}
            className='h-full'
          />
        </AnimatedContainer>
      </div>

      <AnimatedContainer
        delay={0.3}
        className='flex justify-center pt-2 md:pt-4'>
        <Link href='/maquinas' className='z-10 w-full md:w-auto'>
          <Button
            size='lg'
            className='group border-border hover:border-accent/30 z-10 w-full rounded-xs border !bg-white font-semibold !text-slate-900 shadow-md transition-all duration-300 hover:scale-[1.02] md:w-auto'>
            <span className='text-sm md:text-base'>Ver catálogo completo</span>
            <ArrowRight className='group-hover:text-accent ml-2 h-5 w-5 text-slate-900 transition-transform duration-300 group-hover:translate-x-1 md:h-6 md:w-6' />
          </Button>
        </Link>
      </AnimatedContainer>
    </div>
  );
}

export function FeatureCard({
  machine,
  className,
  atrasoAutoplay = 10000,
  ...props
}: FeatureCardProps) {
  const reduzirMovimento = useReducedMotion();

  return (
    <Link href={`/maquinas/${machine.id}`} className='group block h-full'>
      {/* Moldura blueprint: mídia num quadro tracejado com cantoneiras accent;
          só o rodapé tem superfície */}
      <div
        className={cn(
          'relative z-10 flex h-full w-full cursor-pointer flex-col',
          className
        )}
        {...props}>
        <div className='relative flex-1 rounded-t-xs border border-dashed border-[rgba(148,178,235,0.3)] transition-colors duration-300 group-hover:border-[rgba(148,178,235,0.55)]'>
          <span
            aria-hidden
            className='absolute -top-px -left-px z-10 h-2 w-2 border-t border-l border-accent'
          />
          <span
            aria-hidden
            className='absolute -right-px -bottom-px z-10 h-2 w-2 border-r border-b border-accent'
          />
          <Carousel
            className='relative h-full'
            opts={{ loop: true }}
            plugins={
              reduzirMovimento
                ? []
                : [
                    Autoplay({
                      delay: atrasoAutoplay,
                      stopOnInteraction: false
                    })
                  ]
            }>
            <CarouselContent className='h-full'>
              <CarouselItem className='flex items-center justify-center p-3 md:p-4'>
                <div className='relative h-40 w-full md:h-56'>
                  <Image
                    src={machine.imgMaquina}
                    alt={machine.name}
                    fill
                    sizes='(max-width: 768px) 100vw, 33vw'
                    className={cn(
                      'h-full w-full rounded-xs object-contain transition-transform duration-500',
                      machine.imgMaquinaClassName
                    )}
                  />
                </div>
              </CarouselItem>
              <CarouselItem className='flex items-center justify-center p-3 md:p-4'>
                <div className='relative h-40 w-full md:h-56'>
                  <Image
                    src={machine.imgEmbalagem}
                    alt={`Embalagem ${machine.name}`}
                    fill
                    sizes='(max-width: 768px) 100vw, 33vw'
                    className={cn(
                      'h-full w-full rounded-xs !object-contain transition-transform duration-500',
                      machine.imgEmbalagemClassName
                    )}
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>

        {/* Ritmo: título colado na descrição (grupo de leitura), specs agrupadas
            embaixo com respiro próprio — nada de espaçamento uniforme */}
        <div className='rounded-b-xs border border-t-0 border-dashed border-[rgba(148,178,235,0.22)] bg-slate-900/60 p-3 transition-colors duration-300 group-hover:bg-slate-900/85 md:px-4'>
          <h3 className='mb-1 text-sm font-semibold tracking-wide text-white md:text-base'>
            {machine.name}
          </h3>

          <p className='text-muted-foreground mb-2.5 line-clamp-2 text-xs md:text-sm'>
            {machine.descricao}
          </p>

          <div className='space-y-1.5'>
            {machine.unidadeMaxima && (
              <div className='flex items-center gap-1 text-xs md:gap-2'>
                <Zap className='text-accent h-3 w-3' />
                <span>
                  Até {machine.unidadeMaxima.toLocaleString('pt-BR')} un/h
                </span>
              </div>
            )}

            <div className='flex items-center gap-1 text-xs md:gap-2'>
              <Package className='text-accent h-3 w-3' />
              <span className='line-clamp-1'>
                {machine.embalagensCompativeis.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
