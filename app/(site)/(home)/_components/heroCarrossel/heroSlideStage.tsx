'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import type { SlideMaquina } from './slideData';
import { motion } from 'motion/react';

const EASE_ENTRADA = [0.19, 1, 0.22, 1] as const;

/** Variants dinâmicas: `custom` vem do AnimatePresence (evita direção presa no último render) */
const drift = {
  inicial: (direcao: number) => ({ opacity: 0, x: 26 * direcao, scale: 1.03 }),
  entrar: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.42, ease: EASE_ENTRADA }
  },
  sair: (direcao: number) => ({
    opacity: 0,
    x: -18 * direcao,
    scale: 0.99,
    transition: { duration: 0.13, ease: 'easeIn' }
  })
};

interface HeroSlideStageProps {
  slide: SlideMaquina;
  /** 1 = avançou, -1 = voltou; espelha o drift lateral */
  direcao: 1 | -1;
  /** Slide inicial carrega a imagem com priority */
  primeiro: boolean;
  /** Reduced motion: sem drift nem flutuação */
  estatico?: boolean;
}

export function HeroSlideStage({
  slide,
  direcao,
  primeiro,
  estatico = false
}: HeroSlideStageProps) {
  const conteudo = (
    <>
      {/* sombra elíptica no "chão" */}
      <span className='absolute bottom-[2%] left-1/2 h-7 w-[64%] -translate-x-1/2 bg-[radial-gradient(50%_100%_at_50%_50%,rgba(2,6,23,0.55),transparent_75%)]' />
      {/* Máquina ABSOLUTA: a largura natural do PNG não participa do cálculo
         do grid — sem isso a coluna de texto é esmagada (causa raiz mapeada no mockup) */}
      <Image
        src={slide.imgMaquina}
        alt={`Envasadora ${slide.nome}`}
        priority={primeiro}
        sizes='(min-width: 900px) 45vw, 90vw'
        style={{ height: slide.maquinaAltura ?? '106%' }}
        className='absolute top-1/2 left-1/2 z-[2] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_30px_40px_rgba(2,6,23,0.65)]'
      />
      <Image
        src={slide.imgEmbalagem}
        alt={`Embalagem da ${slide.nome}`}
        style={{ height: slide.embalagemAltura, left: slide.embalagemEsquerda }}
        sizes='(min-width: 900px) 20vw, 40vw'
        className={cn(
          'absolute bottom-[4%] z-[3] w-auto max-w-none object-contain drop-shadow-[0_18px_22px_rgba(2,6,23,0.6)]',
          !estatico && 'animate-[hero-flutua_7s_ease-in-out_infinite]'
        )}
      />
    </>
  );

  if (estatico) {
    return <div className='absolute inset-0'>{conteudo}</div>;
  }

  return (
    <motion.div
      className='absolute inset-0'
      custom={direcao}
      variants={drift}
      initial='inicial'
      animate='entrar'
      exit='sair'>
      {conteudo}
    </motion.div>
  );
}
