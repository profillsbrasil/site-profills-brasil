'use client';

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import dynamic from 'next/dynamic';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { GridPatternMobile } from '@/components/layout/gridPatternBgMobile';
import { BlurFade } from '@/components/ui/blur-fade';
import { ScrollHint } from '@/components/blocks/scrollHint';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform
} from 'motion/react';

const CaixaHome3d = dynamic(
  () =>
    import('@/components/modelo3d/caixaHome3d').then((m) => ({
      default: m.CaixaHome3d
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className='flex h-full w-full items-center justify-center'
        style={{ minHeight: '250px' }}>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent' />
      </div>
    )
  }
);

interface ScrollExpandMediaProps {
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  children
}: ScrollExpandMediaProps) {
  return (
    <>
      <div data-testid='mobile-hero' className='md:hidden'>
        <MobileHero />
      </div>
      <div data-testid='desktop-hero' className='hidden md:block'>
        <DesktopHero />
      </div>
      <section className='relative z-20 min-h-screen bg-white pt-8'>
        {children}
      </section>
    </>
  );
}

function MobileHero() {
  return (
    <section className='relative min-h-[calc(100vh-5rem)] overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-slate-800'>
      <GridPatternMobile className='fill-white/10 stroke-white/10 bg-transparent' />

      <div className='relative z-10 flex h-screen md:min-h-[calc(100vh-5rem)] w-full flex-col justify-evenly px-6 py-16'>
        <BlurFade delay={0.1} inView>
          <div className='flex w-full flex-col '>
            <h1 className='text-3xl font-bold leading-tight tracking-tight text-white select-none'>
              Tudo Para Seu Negócio!
            </h1>
            <h2 className='mt-1 text-lg text-accent'>
              Inovação a cada embalagem
            </h2>
            <HeroShowcase />
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <div className='flex w-full items-center justify-center'>
            <CaixaHome3d
              alt='Modelo 3D - Linha de Produtos Profills'
              modelSrc='/caixa-teste-3d.glb'
              cameraOrbit='40deg 75deg 105%'
              autoRotate={true}
              eager={true}
              isMobile={true}
              className='h-[320px] w-full'
            />
          </div>
        </BlurFade>
        <ScrollHint variant='mobile' />
      </div>
    </section>
  );
}

function DesktopHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [cardsHidden, setCardsHidden] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end']
  });

  // Timeline (200vh = 100vh de scroll real ≈ 1 volta de roda):
  // Cards saem cedo, vídeo entra e fica fixo (opacity:1) por ~85vh de hold,
  // até a section sticky desgrudar e revelar o conteúdo.
  const leftX = useTransform(scrollYProgress, [0, 0.1], [0, -300]);
  const rightX = useTransform(scrollYProgress, [0, 0.1], [0, 300]);
  // Forma de função (não array input/output): impede o framer-motion de
  // descarregar a opacity para uma WAAPI/ViewTimeline nativa, que renderiza
  // o progresso de scroll invertido. Transforms (x, scale) não sofrem isso.
  const cardsOpacity = useTransform(() => {
    const p = scrollYProgress.get();
    if (p <= 0) return 1;
    if (p >= 0.06) return 0;
    return 1 - p / 0.06;
  });

  // Vídeo entra em 0.04 com leve sobreposição ao fim do fade dos cards (0.06) — crossfade intencional
  const videoOpacity = useTransform(() => {
    const p = scrollYProgress.get();
    if (p <= 0.04) return 0;
    if (p >= 0.12) return 1;
    return (p - 0.04) / 0.08;
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.05]);

  // Esconde cards completamente quando opacity chega a 0
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCardsHidden(v > 0.06);
  });

  // Se reduced motion, mostra tudo estático
  if (shouldReduceMotion) {
    return (
      <section className='relative flex min-h-screen items-center justify-center bg-secondary'>
        <GridPattern />
        <div className='relative z-10 mx-auto max-w-[70vw]'>
          <HeroTextContent />
        </div>
      </section>
    );
  }

  return (
    <section ref={heroRef} className='relative h-[200vh]'>
      <div className='sticky top-0 h-screen overflow-hidden pt-16'>
        {/* Background escuro base */}
        <div className='absolute inset-0 bg-secondary' />

        {/* Grid pattern — sempre visível, mantém o padrão da seção atrás do vídeo */}
        <div className='absolute inset-0'>
          <GridPattern />
        </div>

        {/* Layout principal */}
        <div className='relative z-10 flex h-full w-full items-center justify-center'>
          <div className='relative mx-auto flex h-full w-full max-w-[70vw] flex-row items-center'>
            {/* Card esquerdo: texto */}
            <motion.div
              className='pointer-events-none relative flex h-full w-1/2 flex-col items-center justify-center'
              style={{
                x: leftX,
                opacity: cardsOpacity,
                visibility: cardsHidden ? 'hidden' : 'visible'
              }}>
              <div className='flex w-full items-center justify-center text-left'>
                <HeroTextContent />
              </div>
            </motion.div>

            {/* Vídeo central */}
            <motion.div
              className='absolute inset-0 flex items-center justify-center'
              style={{ opacity: videoOpacity, scale: videoScale }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload='metadata'
                poster='/videos/videoCurto-poster.webp'
                className='h-full max-h-[65vh] w-full max-w-[70vw] object-cover'>
                <source src='/videos/videoCurto.webm' type='video/webm' />
                <source src='/videos/videoCurto.mp4' type='video/mp4' />
              </video>
            </motion.div>

            {/* Card direito: modelo 3D */}
            <motion.div
              className='pointer-events-none relative flex h-full w-1/2 flex-col items-end justify-center'
              style={{
                x: rightX,
                opacity: cardsOpacity,
                visibility: cardsHidden ? 'hidden' : 'visible'
              }}>
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
        <ScrollHint variant='desktop' />
      </div>
    </section>
  );
}

const SLIDES = [
  {
    title: 'Máquinas Envasadoras',
    desc: 'Linha completa para sua linha de produção'
  },
  {
    title: 'Peças e Componentes',
    desc: 'Reposição rápida com peças originais'
  },
  {
    title: 'Consultoria Técnica',
    desc: 'Especialistas prontos para apoiar seu negócio'
  },
  { title: 'E muito mais!', desc: 'Soluções completas para toda sua empresa' }
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
  }, [startAutoRotate, stopAutoRotate]);

  return (
    <div
      className='pointer-events-auto mt-1 md:mt-6 w-full'
      onMouseEnter={stopAutoRotate}
      onMouseLeave={startAutoRotate}>
      {/* Separador com gradient accent */}
      <div className='mb-2 md:mb-4 h-px bg-linear-to-r from-accent/40 to-transparent' />

      {/* Slide com transição lateral */}
      <div className='relative min-h-[54px]'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeIndex}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className='flex items-start gap-3'>
            {/* Barra vertical accent */}
            <div className='mt-[3px] h-[50px] w-[3px] shrink-0 rounded-full bg-linear-to-b from-accent to-accent/10' />
            <div>
              <p className='text-[15px] font-bold text-secondary-foreground'>
                {SLIDES[activeIndex].title}
              </p>
              <p className='mt-1 text-[12px] leading-relaxed text-secondary-foreground/80'>
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
              i === activeIndex ? 'w-[22px] bg-accent' : 'w-[6px] bg-white/20'
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
      <h2 className='mt-1 text-lg text-accent md:text-xl'>
        Inovação a cada embalagem
      </h2>
      <HeroShowcase />
    </div>
  );
}
