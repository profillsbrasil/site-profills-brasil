'use client';

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { GridPatternMobile } from '@/components/layout/gridPatternBgMobile';
import { CaixaHome3d } from '@/components/modelo3d/caixaHome3d';

import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheckBig } from 'lucide-react';

interface ScrollExpandMediaProps {
  children?: ReactNode;
}

const EXPANSION_PROGRESS_THRESHOLD = 0.9;
const CONTENT_HIDE_PROGRESS_THRESHOLD = 0.3;
const VIDEO_MOUNT_PROGRESS_THRESHOLD = 0.12;
const WHEEL_SENSITIVITY = 0.0015;

const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

export default function ScrollExpandMedia({
  children
}: ScrollExpandMediaProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldRenderCenterVideo, setShouldRenderCenterVideo] = useState(false);

  const scrollProgressRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const mediaFullyExpandedRef = useRef(false);
  const showContentRef = useRef(false);
  const shouldRenderCenterVideoRef = useRef(false);
  const animationFrameId = useRef<number | null>(null);
  const queuedProgressRef = useRef<number | null>(null);

  const springTransition = {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20
  };

  const updateScrollProgress = useCallback((nextProgress: number) => {
    queuedProgressRef.current = clampProgress(nextProgress);

    if (animationFrameId.current !== null) {
      return;
    }

    animationFrameId.current = requestAnimationFrame(() => {
      animationFrameId.current = null;

      const committedProgress =
        queuedProgressRef.current ?? scrollProgressRef.current;
      queuedProgressRef.current = null;

      scrollProgressRef.current = committedProgress;
      setScrollProgress(committedProgress);

      if (committedProgress >= EXPANSION_PROGRESS_THRESHOLD) {
        if (!mediaFullyExpandedRef.current) {
          mediaFullyExpandedRef.current = true;
          setMediaFullyExpanded(true);
        }
        if (!showContentRef.current) {
          showContentRef.current = true;
          setShowContent(true);
        }
      } else {
        if (mediaFullyExpandedRef.current) {
          mediaFullyExpandedRef.current = false;
          setMediaFullyExpanded(false);
        }
        if (
          showContentRef.current &&
          committedProgress < CONTENT_HIDE_PROGRESS_THRESHOLD
        ) {
          showContentRef.current = false;
          setShowContent(false);
        }
      }

      if (
        !shouldRenderCenterVideoRef.current &&
        committedProgress >= VIDEO_MOUNT_PROGRESS_THRESHOLD
      ) {
        shouldRenderCenterVideoRef.current = true;
        setShouldRenderCenterVideo(true);
      }
    });
  }, []);

  const handleWheel = useCallback(
    (event: globalThis.WheelEvent) => {
      if (
        mediaFullyExpandedRef.current &&
        event.deltaY < 0 &&
        window.scrollY <= 5
      ) {
        event.preventDefault();
        mediaFullyExpandedRef.current = false;
        setMediaFullyExpanded(false);
      } else if (!mediaFullyExpandedRef.current) {
        event.preventDefault();
        const scrollDelta = event.deltaY * WHEEL_SENSITIVITY;
        updateScrollProgress(scrollProgressRef.current + scrollDelta);
      }
    },
    [updateScrollProgress]
  );

  const handleTouchStart = useCallback((event: globalThis.TouchEvent) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  }, []);

  const handleTouchMove = useCallback(
    (event: globalThis.TouchEvent) => {
      if (touchStartYRef.current === null) return;

      const touchY = event.touches[0]?.clientY;
      if (typeof touchY !== 'number') return;

      const deltaY = touchStartYRef.current - touchY;

      if (
        mediaFullyExpandedRef.current &&
        deltaY < -30 &&
        window.scrollY <= 5
      ) {
        event.preventDefault();
        mediaFullyExpandedRef.current = false;
        setMediaFullyExpanded(false);
      } else if (!mediaFullyExpandedRef.current) {
        event.preventDefault();
        const scrollFactor =
          deltaY < 0 ? (isMobile ? 0.004 : 0.006) : isMobile ? 0.003 : 0.004;

        updateScrollProgress(scrollProgressRef.current + deltaY * scrollFactor);
        touchStartYRef.current = touchY;
      }
    },
    [isMobile, updateScrollProgress]
  );

  const handleTouchEnd = useCallback(() => {
    touchStartYRef.current = null;
  }, []);

  useEffect(
    () => () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    },
    []
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchEnd, handleTouchMove, handleTouchStart, handleWheel, isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehaviorY = document.body.style.overscrollBehaviorY;

    if (!mediaFullyExpanded) {
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehaviorY = 'contain';
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehaviorY = previousOverscrollBehaviorY;
    };
  }, [mediaFullyExpanded, isMobile]);

  const visualCalculations = useMemo(() => {
    const leftCardTranslateX = scrollProgress * (isMobile ? -150 : -300);
    const rightCardTranslateX = scrollProgress * (isMobile ? 150 : 300);

    const centerImageOpacity = Math.max(
      0,
      Math.min(1, (scrollProgress - (isMobile ? 0.15 : 0.2)) * 2)
    );

    const cardsOpacity = Math.max(
      0,
      1 - scrollProgress * (isMobile ? 1.2 : 1.5)
    );

    const centerImageScale = (isMobile ? 0.9 : 0.8) + scrollProgress * 0.4;

    const backgroundTransition = Math.min(
      1,
      Math.max(0, (centerImageOpacity - 0.1) / 0.8)
    );

    const easeTransition =
      backgroundTransition *
      backgroundTransition *
      (3 - 2 * backgroundTransition);

    return {
      leftCardTranslateX,
      rightCardTranslateX,
      centerImageOpacity,
      cardsOpacity,
      centerImageScale,
      easeTransition
    };
  }, [scrollProgress, isMobile]);

  if (isMobile) {
    return (
      <div className='relative min-h-[calc(100vh-5rem)] bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'>
        <GridPatternMobile />

        <div className='relative z-10 flex min-h-screen w-full flex-col items-center justify-center'>
          <div className='h-1/2 w-full flex flex-col items-center justify-center'>
            <h1 className='text-center font-bold bg-linear-to-r bg-clip-text text-4xl leading-tight text-accent'>
              Soluções para o seu negócio!
            </h1>
            <div className='flex flex-col gap-1 pt-4'>
              <p className='group flex w-full items-center gap-3 font-semibold hover:text-white'>
                <CircleCheckBig className='text-accent h-5 w-5' />
                Máquinas Evasadoreas
              </p>
              <p className='group flex items-center gap-3 font-semibold hover:text-white'>
                <CircleCheckBig className='text-accent h-5 w-5' />
                Peças
              </p>
              <p className='group flex items-center gap-3 font-semibold hover:text-white'>
                <CircleCheckBig className='text-accent h-5 w-5' />
                Consultoria e Suporte Técnico
              </p>
              <p className='group flex items-center gap-3 font-semibold hover:text-white'>
                <CircleCheckBig className='text-accent h-5 w-5' />E muito mais!
              </p>
            </div>
          </div>

          <div className='flex h-1/2 w-1/2 items-center justify-center'>
            <CaixaHome3d
              alt='Modelo 3D - Linha de Produtos Profills'
              modelSrc='/caixa-teste-3d.glb'
              cameraOrbit='40deg 75deg 105%'
              autoRotate={true}
              isMobile={true}
              fallbackLabel='Linha de Produtos Profills'
              posterSrc='/images/caixinha-profills.png'
              className='h-full w-full'
            />
          </div>
        </div>

        <section className='relative z-20 min-h-screen bg-white pt-8'>
          {children}
        </section>
      </div>
    );
  }

  return (
    <div
      className='relative min-h-screen transition-colors duration-1000'
      style={{
        backgroundColor: `rgb(${15 + visualCalculations.easeTransition * 240}, ${
          23 + visualCalculations.easeTransition * 232
        }, ${42 + visualCalculations.easeTransition * 213})`
      }}>
      <GridPattern />

      <motion.div
        className='absolute inset-0 z-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          opacity: Math.max(0, 0.1 - visualCalculations.easeTransition * 0.1)
        }}>
        <div
          className='absolute inset-0 transition-all duration-1500 ease-out'
          style={{
            background: `linear-gradient(to bottom right,
              rgba(${2 + visualCalculations.easeTransition * 246}, ${6 + visualCalculations.easeTransition * 244}, ${
                23 + visualCalculations.easeTransition * 229
              }, ${0.95 - visualCalculations.easeTransition * 0.3}),
              rgba(${15 + visualCalculations.easeTransition * 226}, ${
                23 + visualCalculations.easeTransition * 222
              }, ${42 + visualCalculations.easeTransition * 207}, ${0.9 - visualCalculations.easeTransition * 0.3}),
              rgba(${2 + visualCalculations.easeTransition * 246}, ${6 + visualCalculations.easeTransition * 244}, ${
                23 + visualCalculations.easeTransition * 229
              }, ${0.95 - visualCalculations.easeTransition * 0.3}))`
          }}
        />
      </motion.div>

      <div className='relative z-10 flex min-h-screen w-full items-center justify-center overflow-hidden'>
        <div className='w-full flex-1 px-4 md:px-0'>
          <div className='relative mx-auto flex h-full w-full max-w-[95vw] flex-col items-center justify-center gap-4 md:max-w-[70vw] md:flex-row md:items-start md:gap-0'>
            <motion.div
              className='relative flex h-full w-full flex-col items-center justify-between md:h-[85vh] md:w-1/2'
              style={{
                transform: `translateX(${visualCalculations.leftCardTranslateX}px)`,
                opacity: visualCalculations.cardsOpacity
              }}
              transition={springTransition}>
              <div className='flex h-full w-full items-center justify-center text-center md:text-left'>
                <div className='relative flex h-full w-full flex-col justify-center font-bold'>
                  <motion.span
                    className='from-accent via-accent/70 to-accent/50 w-full bg-linear-to-r bg-clip-text text-transparent'
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'linear'
                    }}>
                    <h1 className='text-5xl leading-tight select-none'>
                      Tudo Para Seu Negócio! <br />
                    </h1>
                    <h2>Inovação a cada embalagem</h2>
                    <div className='flex flex-col gap-1 pt-4'>
                      <p className='group flex w-full items-center gap-3 text-gray-300 hover:text-white'>
                        <CircleCheckBig className='text-accent h-5 w-5' />
                        Máquinas Evasadoreas
                      </p>
                      <p className='group flex items-center gap-3 text-gray-300 hover:text-white'>
                        <CircleCheckBig className='text-accent h-5 w-5' />
                        Peças
                      </p>
                      <p className='group flex items-center gap-3 text-gray-300 hover:text-white'>
                        <CircleCheckBig className='text-accent h-5 w-5' />
                        Consultoria e Suporte Técnico
                      </p>
                      <p className='group flex items-center gap-3 text-gray-300 hover:text-white'>
                        <CircleCheckBig className='text-accent h-5 w-5' />E muito mais!
                      </p>
                    </div>
                  </motion.span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className='absolute inset-0 flex items-center justify-center'
              style={{
                opacity: visualCalculations.centerImageOpacity,
                scale: visualCalculations.centerImageScale
              }}
              transition={springTransition}>
              {shouldRenderCenterVideo && (
                <video
                  src='/videos/videoCurto.mp4'
                  autoPlay={true}
                  loop
                  muted
                  playsInline
                  preload='metadata'
                  className='relative h-full max-h-[65vh] w-full max-w-[70vw] object-cover pt-5'
                  style={{
                    willChange:
                      visualCalculations.centerImageOpacity > 0.3
                        ? 'transform'
                        : 'auto'
                  }}
                />
              )}
            </motion.div>

            <motion.div
              className='relative flex w-full flex-col items-center justify-center md:w-1/2 md:items-end'
              style={{
                transform: `translateX(${visualCalculations.rightCardTranslateX}px)`,
                opacity: visualCalculations.cardsOpacity
              }}
              transition={springTransition}>
              <div className='relative flex h-full w-full items-center justify-center md:min-h-[60vh]'>
                <motion.div
                  className='absolute -inset-1 h-full bg-linear-to-r from-blue-500/20 to-cyan-500/20 blur-3xl md:min-h-[90vh]'
                  animate={{
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: 1.5
                  }}
                />

                <CaixaHome3d
                  alt='Modelo 3D - Linha de Produtos Profills'
                  modelSrc='/caixa-teste-3d.glb'
                  cameraOrbit='40deg 75deg 105%'
                  autoRotate={true}
                  isMobile={isMobile}
                  fallbackLabel='Linha de Produtos Profills'
                  posterSrc='/images/caixinha-profills.png'
                  className='relative mt-4 flex h-full w-1/2 items-center justify-center overflow-hidden transition-opacity duration-200 md:mt-10 md:h-[85vh]'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showContent && (
          <section className='relative z-20 min-h-screen bg-white'>
            {children}
          </section>
        )}
      </AnimatePresence>
    </div>
  );
}
