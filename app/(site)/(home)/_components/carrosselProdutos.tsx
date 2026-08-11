import Image from 'next/image';
import Link from 'next/link';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/carouselHome';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import caixaTintaDerramando from '@/lib/images/carousel/caixa-tinta-derramando.jpg';
import caixaCha from '@/lib/images/carousel/cha.jpg';
import caixaCloro from '@/lib/images/carousel/cloro-piscina.jpg';
import caixaConserva from '@/lib/images/carousel/conserva.jpg';
import caixaDoces from '@/lib/images/carousel/doces.jpg';
import caixaMarcearia from '@/lib/images/carousel/mercearia.jpg';
import caixaMinhaHorta from '@/lib/images/carousel/minha-hortinha.jpg';
import caixaOleo from '@/lib/images/carousel/oleo-aplicacao.jpg';
import caixaRacao from '@/lib/images/carousel/racao.jpg';

import Autoplay from 'embla-carousel-autoplay';

const produtos = [
  {
    id: 1,
    name: 'Caixa de Mercearia',
    imageProduct: caixaMarcearia
  },
  {
    id: 2,
    name: 'Caixa de Chá',
    imageProduct: caixaCha
  },
  {
    id: 3,
    name: 'Caixa de Conserva',
    imageProduct: caixaConserva
  },
  {
    id: 4,
    name: 'Caixa de Cloro',
    imageProduct: caixaCloro
  },
  {
    id: 5,
    name: 'Caixa de Ração',
    imageProduct: caixaRacao
  },
  {
    id: 6,
    name: 'Caixa de Doces',
    imageProduct: caixaDoces
  },
  {
    id: 7,
    name: 'Caixa de Minha Horta',
    imageProduct: caixaMinhaHorta
  },
  {
    id: 8,
    name: 'Caixa de Oleo',
    imageProduct: caixaOleo
  },
  {
    id: 9,
    name: 'Caixa de Tinta',
    imageProduct: caixaTintaDerramando
  }
];

export default function carrosselProdutos() {
  return (
    <>
      {/* Grid mobile 2x2 */}
      <div className='z-10 mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 md:hidden'>
        <div className='flex flex-col gap-2'>
          <TextAnimate
            animation='blurInUp'
            by='word'
            as='h2'
            once
            startOnView
            className='text-2xl font-bold mb-2'>
            Inovação e Praticidade
          </TextAnimate>
          <p className='text-muted-foreground text-sm'>
            Diversos produtos já aproveitam as vantagens das embalagens
            Gable-Top
          </p>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          {produtos.slice(0, 4).map((produto, i) => (
            <BlurFade key={produto.id} delay={0.1 + i * 0.1} inView>
              <Image
                src={produto.imageProduct}
                alt={produto.name}
                className='h-full w-full rounded-xs object-contain'
              />
            </BlurFade>
          ))}
        </div>
        <Link
          href='/maquinas'
          className='text-accent flex items-center justify-center text-sm font-semibold hover:underline'>
          Ver mais produtos
          <span className='ml-1'>→</span>
        </Link>
      </div>

      {/* Carousel desktop */}
      <div className='z-10 mx-auto hidden h-1/2 w-full max-w-6xl flex-col justify-center gap-5 px-4 py-5 md:flex'>
      <div className='flex flex-col gap-2'>
        <TextAnimate animation='blurInUp' by='word' as='h2' once startOnView className='text-3xl font-bold mb-2'>
          Inovação e Praticidade
        </TextAnimate>
        <p className='text-muted-foreground text-base'>
          Diversos produtos já aproveitam as vantagens das embalagens Gable-Top
        </p>
      </div>
      <Carousel plugins={[Autoplay({ delay: 5000 })]}>
        <AnimatedContainer delay={0.3}>
          <CarouselContent className='h-full w-full'>
            {produtos.map((produto) => (
              <CarouselItem key={produto.id}>
                <Image
                  src={produto.imageProduct}
                  alt={produto.name}
                  className='h-full w-full rounded-xs object-contain'
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </AnimatedContainer>
      </Carousel>
    </div>
    </>
  );
}
