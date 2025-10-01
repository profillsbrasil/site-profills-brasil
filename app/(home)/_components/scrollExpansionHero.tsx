'use client';

import {
  type ReactNode,
  type TouchEvent,
  type WheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { Highlighter } from '@/components/magicui/highlighter';
import { CaixaHome3d } from '@/components/modelo3d/caixaHome3d';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus } from 'lucide-react';

// TODO: Scroll para o do meio esta muito lento
interface ScrollExpandMediaProps {
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  children
}: ScrollExpandMediaProps) {
  // === ESTADOS DE CONTROLE DA ANIMAÇÃO ===
  const [scrollProgress, setScrollProgress] = useState(0); // Progresso da animação (0-1)
  const [showContent, setShowContent] = useState(false); // Controla quando mostrar conteúdo expandido
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false); // Flag para liberar scroll normal
  const [touchStartY, setTouchStartY] = useState(0); // Posição inicial do touch para gestos mobile
  const [isMobile, setIsMobile] = useState(false); // Detecta se é dispositivo mobile
  const animationFrameId = useRef<number | null>(null); // Ref para cancelar animações em progresso

  // === CONFIGURAÇÕES DE ANIMAÇÃO ===
  const springTransition = {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20
  };

  // === FUNÇÕES DE CONTROLE DE ANIMAÇÃO ===

  // Atualiza o progresso da animação usando RequestAnimationFrame para suavidade
  const updateScrollProgress = useCallback((newProgress: number) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    animationFrameId.current = requestAnimationFrame(() => {
      setScrollProgress(newProgress);

      // Transições de estado baseadas no progresso
      if (newProgress >= 0.9) {
        setMediaFullyExpanded(true); // Libera scroll normal da página
        setShowContent(true); // Mostra conteúdo expandido
      } else if (newProgress < 0.3) {
        setShowContent(false); // Esconde conteúdo quando voltando
      }
    });
  }, []);

  // === HANDLERS DE INTERAÇÃO ===

  // Manipula scroll do mouse/trackpad durante a animação
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Se expandido e scroll para cima no topo, volta para animação
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        // Durante animação, intercepta scroll para controlar progresso
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0008; // Fator de sensibilidade
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );

        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollProgress(newProgress);
        });
      }
    },
    [scrollProgress, mediaFullyExpanded, updateScrollProgress]
  );

  // Captura posição inicial do toque mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  }, []);

  // Processa gestos de swipe mobile para controlar animação
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      // Se expandido e swipe para baixo, volta para animação
      if (mediaFullyExpanded && deltaY < -30 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        // Durante animação, converte swipe em progresso
        e.preventDefault();
        // Fatores de sensibilidade diferentes para mobile/desktop e direções
        const scrollFactor =
          deltaY < 0 ? (isMobile ? 0.004 : 0.006) : isMobile ? 0.003 : 0.004;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );

        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollProgress(newProgress);
        });
        setTouchStartY(touchY); // Atualiza posição para movimento contínuo
      }
    },
    [
      scrollProgress,
      mediaFullyExpanded,
      touchStartY,
      updateScrollProgress,
      isMobile
    ]
  );

  // Limpa estado do touch ao finalizar gesto
  const handleTouchEnd = useCallback(() => {
    setTouchStartY(0);
  }, []);

  // Bloqueia scroll da página durante animação
  const handleScroll = useCallback(() => {
    if (!mediaFullyExpanded) {
      window.scrollTo(0, 0); // Força scroll para o topo
    }
  }, [mediaFullyExpanded]);

  // === SETUP DE EVENT LISTENERS ===

  // Configura todos os listeners de interação (wheel, touch, scroll) - APENAS NO DESKTOP
  useEffect(() => {
    // Se for mobile, não adiciona os listeners que interceptam scroll
    if (isMobile) return;

    const wheelHandler = handleWheel as unknown as EventListener;
    const touchStartHandler = handleTouchStart as unknown as EventListener;
    const touchMoveHandler = handleTouchMove as unknown as EventListener;
    const touchEndHandler = handleTouchEnd as EventListener;
    const scrollHandler = handleScroll as EventListener;

    // passive: false permite preventDefault para interceptar eventos
    window.addEventListener('wheel', wheelHandler, { passive: false });
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('touchstart', touchStartHandler, {
      passive: false
    });
    window.addEventListener('touchmove', touchMoveHandler, { passive: false });
    window.addEventListener('touchend', touchEndHandler, { passive: true });

    return () => {
      // Cleanup: remove todos os listeners
      window.removeEventListener('wheel', wheelHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('touchstart', touchStartHandler);
      window.removeEventListener('touchmove', touchMoveHandler);
      window.removeEventListener('touchend', touchEndHandler);

      // Cancela animações pendentes
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScroll,
    isMobile // Adiciona isMobile como dependência
  ]);

  // Detecta mudanças de tamanho de tela para ajustar comportamento mobile/desktop
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Breakpoint md: do Tailwind
    };

    checkIfMobile(); // Executa na montagem
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Inicialização: reseta estados para garantir estado limpo
  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, []);

  // === CÁLCULOS VISUAIS DA ANIMAÇÃO ===

  // Otimiza cálculos complexos que dependem do progresso da animação
  const visualCalculations = useMemo(() => {
    // Movimento horizontal dos cards laterais (mobile usa menor distância)
    const leftCardTranslateX = scrollProgress * (isMobile ? -150 : -300);
    const rightCardTranslateX = scrollProgress * (isMobile ? 150 : 300);

    // Opacidade do vídeo central (aparece com delay, mobile aparece um pouco antes)
    const centerImageOpacity = Math.max(
      0,
      Math.min(1, (scrollProgress - (isMobile ? 0.15 : 0.2)) * 2)
    );

    // Opacidade dos cards laterais (desaparecem conforme animação avança)
    const cardsOpacity = Math.max(
      0,
      1 - scrollProgress * (isMobile ? 1.2 : 1.5)
    );

    // Escala do vídeo central (cresce durante a animação)
    const centerImageScale = (isMobile ? 0.9 : 0.8) + scrollProgress * 0.4;

    // Transição suave do background baseada na opacidade da imagem central
    const backgroundTransition = Math.min(
      1,
      Math.max(0, (centerImageOpacity - 0.1) / 0.8)
    );

    // Função de easing suave (smoothstep) para transições mais naturais
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

  // ===  MOBILE  ===
  // Se for mobile, renderiza versão simplificada sem animações de scroll.
  if (isMobile) {
    return (
      <div className='relative min-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-2'>
        {/* Pattern de fundo decorativo */}
        <GridPattern />

        {/* Layout mobile simplificado */}
        <div className='relative z-10 flex min-h-screen w-full flex-col items-center justify-center'>
          {/* Título principal */}
          <div className='h-1/2 w-full text-center'>
            <h1 className='from-accent via-accent/70 to-accent/50 bg-gradient-to-r bg-clip-text text-3xl leading-tight font-bold text-transparent'>
              Soluções para o seu negócio!
            </h1>
          </div>

          {/* Modelo 3D mobile */}
          <div className='mt-10 mb-8 flex h-1/2 w-1/2 items-center justify-center'>
            <CaixaHome3d
              alt='Modelo 3D - Linha de Produtos Profills'
              modelSrc='/caixa-teste-3d.glb'
              cameraOrbit='40deg 75deg 105%'
              autoRotate={true}
              isMobile={true}
              className='h-full w-full'
            />
          </div>
          {/* Slogan mobile */}
          <p className='text-xl text-white'>
            <Highlighter
              action='underline'
              color='#2d62ef'
              animationDuration={4000}
              textColor='text-white'>
              Embalando o Mundo!
            </Highlighter>
          </p>
        </div>

        {/* Conteúdo adicional mobile */}
        <section className='relative z-20 min-h-screen bg-white pt-8'>
          {children}
        </section>
      </div>
    );
  }

  // === RENDERIZAÇÃO DO COMPONENTE DESKTOP ===
  // Versão original com animações de scroll

  return (
    // Container principal com background dinâmico que transiciona de escuro para claro
    <div
      className='relative min-h-screen transition-colors duration-1000'
      style={{
        backgroundColor: `rgb(${15 + visualCalculations.easeTransition * 240}, ${
          23 + visualCalculations.easeTransition * 232
        }, ${42 + visualCalculations.easeTransition * 213})`
      }}>
      {/* Pattern de fundo decorativo */}
      <GridPattern />

      {/* Overlay com gradiente que desaparece durante a animação */}
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

      {/* Layout principal da animação */}
      <div className='relative z-10 flex min-h-screen w-full items-center justify-center overflow-hidden'>
        <div className='w-full flex-1 px-4 md:px-0'>
          {/* Container responsivo: mobile empilhado, desktop lado a lado */}
          <div className='relative mx-auto flex h-full w-full max-w-[95vw] flex-col items-center justify-center gap-4 md:max-w-[70vw] md:flex-row md:items-start md:gap-0'>
            {/* CARD ESQUERDO: Texto principal e slogan */}
            <motion.div
              className='relative flex h-full w-full flex-col items-center justify-between md:h-[85vh] md:w-1/2'
              style={{
                transform: `translateX(${visualCalculations.leftCardTranslateX}px)`,
                opacity: visualCalculations.cardsOpacity
              }}
              transition={springTransition}>
              {/* Container do texto */}
              <div className='flex h-full w-full items-center justify-center text-center md:text-left'>
                <div className='relative flex h-full w-full flex-col justify-center font-bold'>
                  {/* Título principal com gradiente animado */}
                  <motion.span
                    className='from-accent via-accent/70 to-accent/50 w-full bg-gradient-to-r bg-clip-text text-transparent'
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
                      <p className='group flex w-full items-center gap-2 text-gray-300 hover:text-white'>
                        <Minus className='text-accent h-3 w-3' />
                        Máquinas Evasadoreas
                      </p>
                      <p className='group flex items-center gap-2 text-gray-300 hover:text-white'>
                        <Minus className='text-accent h-3 w-3' />
                        Peças
                      </p>
                      <p className='group flex items-center gap-2 text-gray-300 hover:text-white'>
                        <Minus className='text-accent h-3 w-3' />
                        Consultoria e Suporte Técnico
                      </p>
                      <p className='group flex items-center gap-2 text-gray-300 hover:text-white'>
                        <Minus className='text-accent h-3 w-3' />E muito mais!
                      </p>
                    </div>
                  </motion.span>

                  {/* Slogan com destaque (visível apenas em desktop) */}
                  <p className='relative bottom-0 mt-0 flex h-1/5 w-full flex-col justify-end gap-2 text-xl text-white md:absolute md:text-3xl'>
                    <Highlighter
                      action='underline'
                      color='#2d62ef'
                      animationDuration={4000}
                      textColor='text-white select-none'>
                      Embalando o Mundo!
                    </Highlighter>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* VÍDEO CENTRAL: Aparece durante a animação de scroll */}
            <motion.div
              className='absolute inset-0 flex items-center justify-center'
              style={{
                opacity: visualCalculations.centerImageOpacity,
                scale: visualCalculations.centerImageScale
              }}
              transition={springTransition}>
              {/* Vídeo que reproduz quando fica visível */}
              <video
                src='/videos/video.mp4'
                autoPlay={visualCalculations.centerImageOpacity > 0.3}
                loop
                muted
                playsInline
                className='relative h-full max-h-[75vh] w-full max-w-[70vw] rounded-md object-cover pt-5'
                style={{
                  willChange:
                    visualCalculations.centerImageOpacity > 0.3
                      ? 'transform'
                      : 'auto'
                }}
              />
            </motion.div>

            {/* CARD DIREITO: Modelo 3D com efeitos visuais */}
            <motion.div
              className='relative flex w-full flex-col items-center justify-center md:w-1/2 md:items-end'
              style={{
                transform: `translateX(${visualCalculations.rightCardTranslateX}px)`,
                opacity: visualCalculations.cardsOpacity
              }}
              transition={springTransition}>
              {/* Container do modelo 3D */}
              <div className='relative flex h-full w-full items-center justify-center md:min-h-[60vh]'>
                {/* Efeito glow animado ao redor do modelo */}
                <motion.div
                  className='absolute -inset-1 h-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl md:min-h-[90vh]'
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

                {/* Componente do modelo 3D otimizado para mobile/desktop */}
                <CaixaHome3d
                  alt='Modelo 3D - Linha de Produtos Profills'
                  modelSrc='/caixa-teste-3d.glb'
                  cameraOrbit='40deg 75deg 105%'
                  autoRotate={true}
                  isMobile={isMobile}
                  className='relative mt-4 flex h-full w-1/2 items-center justify-center overflow-hidden transition-opacity duration-200 md:mt-10 md:h-[85vh]'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* SEÇÃO EXPANDIDA: Conteúdo adicional que aparece após animação completa */}
      <AnimatePresence>
        {showContent && (
          <section className='relative z-20 min-h-screen bg-white'>
            {children} {/* Conteúdo passado via props */}
          </section>
        )}
      </AnimatePresence>
    </div>
  );
}
