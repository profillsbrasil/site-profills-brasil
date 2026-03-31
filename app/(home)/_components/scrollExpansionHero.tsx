'use client';

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { GridPatternMobile } from '@/components/layout/gridPatternBgMobile';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';

const CaixaHome3d = dynamic(
  () => import('@/components/modelo3d/caixaHome3d').then((m) => ({ default: m.CaixaHome3d })),
  {
    ssr: false,
    loading: () => (
      <div className='flex h-full w-full items-center justify-center' style={{ minHeight: '250px' }}>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent' />
      </div>
    ),
  }
);

import {
  AnimatePresence,
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
                  preload='metadata'
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

const SLIDES = [
  { title: 'Máquinas Envasadoras', desc: 'Linha completa para sua linha de produção' },
  { title: 'Peças e Componentes',  desc: 'Reposição rápida com peças originais' },
  { title: 'Consultoria Técnica',  desc: 'Especialistas prontos para apoiar seu negócio' },
  { title: 'E muito mais!',        desc: 'Soluções completas para toda sua empresa' },
];

function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoRotate = useCallback(() => {
    if (intervalRef.current) return; // evita intervalos duplicados
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
  }, []);

  const stopAutoRotate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoRotate();
    return () => stopAutoRotate();
  }, []);

  return (
    <div
      className='pointer-events-auto mt-6 w-full'
      onMouseEnter={stopAutoRotate}
      onMouseLeave={startAutoRotate}
    >
      {/* Separador com gradient accent */}
      <div className='mb-4 h-px bg-linear-to-r from-accent/40 to-transparent' />

      {/* Slide com transição lateral */}
      <div className='relative min-h-[54px]'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeIndex}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className='flex items-start gap-3'
          >
            {/* Barra vertical accent */}
            <div className='mt-[3px] h-[50px] w-[3px] flex-shrink-0 rounded-full bg-linear-to-b from-accent to-accent/10' />
            <div>
              <p className='text-[15px] font-bold text-secondary-foreground'>
                {SLIDES[activeIndex].title}
              </p>
              <p className='mt-1 text-[12px] leading-relaxed text-secondary-foreground/50'>
                {SLIDES[activeIndex].desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots de navegação */}
      <div className='mt-3 flex items-center gap-[5px]'>
        {SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            onClick={() => {
              stopAutoRotate();
              setActiveIndex(i);
              startAutoRotate();
            }}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'w-[22px] bg-accent'
                : 'w-[6px] bg-white/20'
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function HeroTextContent() {
  return (
    <div className='relative flex h-full w-full flex-col justify-center font-bold'>
      <h1 className='text-4xl leading-tight tracking-tight text-secondary-foreground select-none md:text-5xl'>
        Tudo Para Seu Negócio!
      </h1>
      <h2 className='mt-1 text-lg text-accent md:text-xl'>Inovação a cada embalagem</h2>
      <HeroShowcase />
    </div>
  );
}
