"use client";

import { GridPattern } from "@/components/layout/gridPatternBg";
import { Highlighter } from "@/components/magicui/highlighter";
import { Caixa3d } from "@/components/modelo3d/caixaHome3d";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
  type WheelEvent,
} from "react";

interface ScrollExpandMediaProps {
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  children,
}: ScrollExpandMediaProps) {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.001; // Mais responsivo
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1,
        );
        setScrollProgress(newProgress);

        if (newProgress >= 0.9) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.3) {
          setShowContent(false);
        }
      }
    },
    [scrollProgress, mediaFullyExpanded],
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -30 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1,
        );
        setScrollProgress(newProgress);

        if (newProgress >= 0.9) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.3) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    },
    [scrollProgress, mediaFullyExpanded, touchStartY],
  );

  const handleTouchEnd = useCallback((): void => {
    setTouchStartY(0);
  }, []);

  const handleScroll = useCallback((): void => {
    if (!mediaFullyExpanded) {
      window.scrollTo(0, 0);
    }
  }, [mediaFullyExpanded]);

  // Event listeners em useEffect separado
  useEffect(() => {
    const wheelHandler = handleWheel as unknown as EventListener;
    const touchStartHandler = handleTouchStart as unknown as EventListener;
    const touchMoveHandler = handleTouchMove as unknown as EventListener;
    const touchEndHandler = handleTouchEnd as EventListener;
    const scrollHandler = handleScroll as EventListener;

    window.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("scroll", scrollHandler);
    window.addEventListener("touchstart", touchStartHandler, {
      passive: false,
    });
    window.addEventListener("touchmove", touchMoveHandler, { passive: false });
    window.addEventListener("touchend", touchEndHandler);

    return () => {
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", touchEndHandler);
    };
  }, [
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScroll,
  ]);

  // Mobile detection
  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Reset no mount
  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, []);

  // Movimentos mais suaves e naturais
  const leftCardTranslateX = scrollProgress * (isMobile ? -200 : -300);
  const rightCardTranslateX = scrollProgress * (isMobile ? 200 : 300);
  const centerImageOpacity = Math.max(
    0,
    Math.min(1, (scrollProgress - 0.2) * 2),
  );
  const cardsOpacity = Math.max(0, 1 - scrollProgress * 1.5);
  const centerImageScale = 0.8 + scrollProgress * 0.4;

  // Função de easing suave para transição do background
  const backgroundTransition = Math.min(
    1,
    Math.max(0, (centerImageOpacity - 0.1) / 0.8),
  );
  const easeTransition =
    backgroundTransition *
    backgroundTransition *
    (3 - 2 * backgroundTransition); // smoothstep

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen transition-colors duration-1000"
      style={{
        backgroundColor: `rgb(${15 + easeTransition * 240}, ${
          23 + easeTransition * 232
        }, ${42 + easeTransition * 213})`,
      }}
    >
      <GridPattern />
      {/* Background com transição */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          opacity: Math.max(0, 0.1 - easeTransition * 0.1),
        }}
      >
        <div
          className="absolute inset-0 transition-all duration-1500 ease-out"
          style={{
            background: `linear-gradient(to bottom right,
              rgba(${2 + easeTransition * 246}, ${6 + easeTransition * 244}, ${
                23 + easeTransition * 229
              }, ${0.95 - easeTransition * 0.3}),
              rgba(${15 + easeTransition * 226}, ${
                23 + easeTransition * 222
              }, ${42 + easeTransition * 207}, ${0.9 - easeTransition * 0.3}),
              rgba(${2 + easeTransition * 246}, ${6 + easeTransition * 244}, ${
                23 + easeTransition * 229
              }, ${0.95 - easeTransition * 0.3}))`,
          }}
        />
      </motion.div>

      {/* Layout principal */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center overflow-hidden">
        <div className="w-full flex-1">
          {/* Logo */}
          {/* <motion.div
            className="absolute top-0 left-[27.5%] flex h-1/4 w-1/4 -translate-x-1/2 items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Image
              src={logoProfills}
              alt="Profills Logo"
              className="h-full w-full object-contain drop-shadow-2xl filter"
            />
          </motion.div> */}
          <div className="relative mx-auto flex h-full w-full max-w-[70vw] flex-col items-start justify-center md:flex-row">
            {/* Card Esquerdo - Logo */}
            <motion.div
              className="relative flex h-[85vh] w-1/2 flex-col items-center justify-between"
              style={{
                transform: `translateX(${leftCardTranslateX}px)`,
                opacity: cardsOpacity,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {/* Card Esquerdo */}

              {/* Texto */}
              <motion.div
                className="flex h-full w-full items-center justify-center text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="relative flex h-full w-full flex-col justify-center font-bold">
                  <motion.span
                    className="from-accent via-accent/70 to-accent/50 w-full bg-gradient-to-r bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <h1 className="text-7xl">
                      Maquinas e<br />
                      Peças para o <br /> Seu Negócio!
                    </h1>
                  </motion.span>
                  <p className="absolute bottom-0 flex h-1/5 w-full flex-col justify-end gap-2 text-3xl text-white">
                    <Highlighter
                      action="underline"
                      color="#2d62ef"
                      animationDuration={4000}
                      textColor="text-white"
                    >
                      O futuro cabe aqui!
                    </Highlighter>
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Imagem Central - Aparece durante o scroll */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: centerImageOpacity,
                scale: centerImageScale,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <motion.div className="relative h-full max-h-[75vh] w-full max-w-[70vw] overflow-hidden">
                <video
                  src="/videos/video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full rounded-md object-cover"
                />

                <div className="absolute"></div>
              </motion.div>
            </motion.div>

            {/* Card Direito - Linha de Produtos */}
            <motion.div
              className="relative flex w-1/2 flex-col items-center lg:items-end"
              style={{
                transform: `translateX(${rightCardTranslateX}px)`,
                opacity: cardsOpacity,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {/* Container do Card */}
              <motion.div
                className="relative h-full min-h-[60vh] w-full rounded-3xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-1 min-h-[90vh] rounded-3xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                />

                {/* Imagem dos produtos */}
                <motion.div
                  className="relative mt-10 flex h-[85vh] w-full items-center justify-center overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <div className="h-full w-full">
                    <Caixa3d />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Seção de conteúdo expandido */}
      <AnimatePresence>
        {showContent && (
          <section className="relative z-20 min-h-screen bg-white">
            {children}
          </section>
        )}
      </AnimatePresence>
    </div>
  );
}
