'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { GridPatternMobile } from '@/components/layout/gridPatternBgMobile';
import { CaixaHome3d } from '@/components/modelo3d/caixaHome3d';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform
} from 'motion/react';
import { CircleCheckBig } from 'lucide-react';

interface ScrollExpandMediaProps {
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  children
}: ScrollExpandMediaProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (isMobile) {
    return <MobileHero>{children}</MobileHero>;
  }

  return <DesktopHero>{children}</DesktopHero>;
}

function MobileHero({ children }: { children?: ReactNode }) {
  return (
    <div className='relative min-h-[calc(100vh-5rem)] bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'>
      <GridPatternMobile />

      <div className='relative z-10 flex min-h-screen w-full flex-col items-center justify-center'>
        <div className='flex h-1/2 w-full flex-col items-center justify-center'>
          <TextAnimate
            animation='blurInUp'
            by='word'
            as='h1'
            once
            startOnView
            className='text-center text-4xl font-bold leading-tight text-accent'>
            Soluções para o seu negócio!
          </TextAnimate>
          <BlurFade delay={0.2} inView>
            <div className='flex flex-col gap-1 pt-4'>
              <p className='group flex w-full items-center gap-3 font-semibold hover:text-secondary-foreground'>
                <CircleCheckBig className='text-accent h-5 w-5' />
                Máquinas Envasadoras
              </p>
              <p className='group flex items-center gap-3 font-semibold hover:text-secondary-foreground'>
                <CircleCheckBig className='text-accent h-5 w-5' />
                Peças
              </p>
              <p className='group flex items-center gap-3 font-semibold hover:text-secondary-foreground'>
                <CircleCheckBig className='text-accent h-5 w-5' />
                Consultoria e Suporte Técnico
              </p>
              <p className='group flex items-center gap-3 font-semibold hover:text-secondary-foreground'>
                <CircleCheckBig className='text-accent h-5 w-5' />E muito mais!
              </p>
            </div>
          </BlurFade>
        </div>

        <BlurFade delay={0.4} inView>
          <div className='flex h-1/2 w-1/2 items-center justify-center'>
            <CaixaHome3d
              alt='Modelo 3D - Linha de Produtos Profills'
              modelSrc='/caixa-teste-3d.glb'
              cameraOrbit='40deg 75deg 105%'
              autoRotate={true}
              isMobile={true}
              className='h-full w-full'
            />
          </div>
        </BlurFade>
      </div>

      <section className='relative z-20 min-h-screen bg-white pt-8'>
        {children}
      </section>
    </div>
  );
}

function DesktopHero({ children }: { children?: ReactNode }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [cardsHidden, setCardsHidden] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end']
  });

  // Timeline (300vh = 200vh de scroll real):
  // Cards e vídeo se sobrepõem — vídeo aparece ENQUANTO cards saem
  // Movimentação dos cards é sutil (como o original: ~300px)
  const leftX = useTransform(scrollYProgress, [0, 0.5], [0, -300]);
  const rightX = useTransform(scrollYProgress, [0, 0.5], [0, 300]);
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.025], [1, 0]);

  const videoOpacity = useTransform(scrollYProgress, [0.015, 0.06], [0, 1]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.1]);

  const lightBgOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);

  const gridOpacity = useTransform(scrollYProgress, [0.05, 0.3], [1, 0]);

  // Esconde cards completamente quando opacity chega a 0
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCardsHidden(v > 0.03);
  });

  // Se reduced motion, mostra tudo estático
  if (shouldReduceMotion) {
    return (
      <>
        <section className='relative flex min-h-screen items-center justify-center bg-secondary'>
          <GridPattern />
          <div className='relative z-10 mx-auto max-w-[70vw]'>
            <HeroTextContent />
          </div>
        </section>
        <section className='relative z-10 bg-white'>{children}</section>
      </>
    );
  }

  return (
    <>
      <section ref={heroRef} className='relative h-[300vh]'>
        <div className='sticky top-0 h-screen overflow-hidden pt-16'>
          {/* Background escuro base */}
          <div className='absolute inset-0 bg-secondary' />

          {/* Background claro (crossfade) */}
          <motion.div
            className='absolute inset-0 bg-white'
            style={{ opacity: lightBgOpacity }}
          />

          {/* Grid pattern com fade */}
          <motion.div className='absolute inset-0' style={{ opacity: gridOpacity }}>
            <GridPattern />
          </motion.div>

          {/* Layout principal */}
          <div className='relative z-10 flex h-full w-full items-center justify-center'>
            <div className='relative mx-auto flex h-full w-full max-w-[70vw] flex-row items-center'>
              {/* Card esquerdo: texto */}
              <motion.div
                className='pointer-events-none relative flex h-full w-1/2 flex-col items-center justify-center'
                style={{ x: leftX, opacity: cardsOpacity, visibility: cardsHidden ? 'hidden' : 'visible' }}>
                <div className='flex w-full items-center justify-center text-left'>
                  <HeroTextContent />
                </div>
              </motion.div>

              {/* Vídeo central */}
              <motion.div
                className='absolute inset-0 flex items-center justify-center'
                style={{ opacity: videoOpacity, scale: videoScale }}>
                <video
                  src='/videos/videoCurto.mp4'
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload='auto'
                  className='h-full max-h-[65vh] w-full max-w-[70vw] object-cover'
                />
              </motion.div>

              {/* Card direito: modelo 3D */}
              <motion.div
                className='pointer-events-none relative flex h-full w-1/2 flex-col items-end justify-center'
                style={{ x: rightX, opacity: cardsOpacity, visibility: cardsHidden ? 'hidden' : 'visible' }}>
                <div className='relative flex h-full w-full items-center justify-center'>
                  <CaixaHome3d
                    alt='Modelo 3D - Linha de Produtos Profills'
                    modelSrc='/caixa-teste-3d.glb'
                    cameraOrbit='40deg 75deg 105%'
                    autoRotate={true}
                    isMobile={false}
                    className='relative flex h-[70vh] w-1/2 items-center justify-center overflow-hidden transition-opacity duration-200'
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo abaixo - sempre renderizado, scroll natural revela */}
      <section className='relative z-10 bg-white'>{children}</section>
    </>
  );
}

function HeroTextContent() {
  return (
    <div className='relative flex h-full w-full flex-col justify-center font-bold'>
      <h1 className='text-4xl leading-tight tracking-tight text-secondary-foreground select-none md:text-5xl'>
        Tudo Para Seu Negócio!
      </h1>
      <h2 className='mt-1 text-lg text-accent md:text-xl'>Inovação a cada embalagem</h2>
      <div className='flex flex-col gap-1 pt-4'>
        <p className='group flex w-full items-center gap-3 text-secondary-foreground/70 hover:text-secondary-foreground'>
          <CircleCheckBig className='text-accent h-5 w-5' />
          Máquinas Envasadoras
        </p>
        <p className='group flex items-center gap-3 text-secondary-foreground/70 hover:text-secondary-foreground'>
          <CircleCheckBig className='text-accent h-5 w-5' />
          Peças
        </p>
        <p className='group flex items-center gap-3 text-secondary-foreground/70 hover:text-secondary-foreground'>
          <CircleCheckBig className='text-accent h-5 w-5' />
          Consultoria e Suporte Técnico
        </p>
        <p className='group flex items-center gap-3 text-secondary-foreground/70 hover:text-secondary-foreground'>
          <CircleCheckBig className='text-accent h-5 w-5' />E muito mais!
        </p>
      </div>
    </div>
  );
}
