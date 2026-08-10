'use client';

import { useCallback, useEffect, useState } from 'react';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { cn } from '@/lib/utils';

import { HeroRings } from './heroRings';
import { HeroSlideCopy } from './heroSlideCopy';
import { HeroSlideStage } from './heroSlideStage';
import { AUTOPLAY_MS, SLIDES } from './slideData';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, useReducedMotion } from 'motion/react';

function indice(n: number) {
  return String(n).padStart(2, '0');
}

export default function HeroCarrossel() {
  const reduzirMovimento = useReducedMotion();
  const [atual, setAtual] = useState(0);
  const [direcao, setDirecao] = useState<1 | -1>(1);
  const [pingKey, setPingKey] = useState(0);

  const trocar = useCallback((dir: 1 | -1) => {
    setDirecao(dir);
    setAtual((i) => (i + dir + SLIDES.length) % SLIDES.length);
    setPingKey((k) => k + 1);
  }, []);

  // Autoplay: reinicia a cada troca (manual ou automática); desligado em reduced motion
  useEffect(() => {
    if (reduzirMovimento) return;
    const timer = setTimeout(() => trocar(1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [atual, reduzirMovimento, trocar]);

  const slide = SLIDES[atual];
  const proximo = SLIDES[(atual + 1) % SLIDES.length];
  const estatico = Boolean(reduzirMovimento);

  return (
    <section className='relative flex min-h-screen items-center overflow-hidden bg-secondary pt-16'>
      {/* fundo: gradiente radial navy + grid pattern mascarado */}
      <div className='absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_40%,#1b2a4d_0%,#0f172a_46%,#0a1122_100%)]' />
      <div className='absolute inset-0 [mask-image:radial-gradient(85%_85%_at_60%_45%,black_30%,transparent_100%)]'>
        <GridPattern />
      </div>

      <div className='relative z-10 mx-auto grid w-[min(1280px,94vw)] grid-cols-1 items-center gap-2 pt-4 pb-24 min-[900px]:grid-cols-2 min-[900px]:pb-16'>
        {/* Coluna de texto */}
        <div>
          {estatico ? (
            <HeroSlideCopy slide={slide} primeiro={atual === 0} estatico />
          ) : (
            <AnimatePresence mode='wait'>
              <HeroSlideCopy
                key={slide.id}
                slide={slide}
                primeiro={atual === 0}
              />
            </AnimatePresence>
          )}
        </div>

        {/* Palco: anéis fixos, máquina troca */}
        <div className='relative mt-6 h-[min(48vh,460px)] min-[900px]:mt-0 min-[900px]:max-[1180px]:h-[min(70vh,640px)] min-[900px]:h-[min(76vh,700px)] min-[900px]:translate-x-[6%]'>
          <HeroRings estatico={estatico} pingKey={pingKey} />
          {estatico ? (
            <HeroSlideStage
              slide={slide}
              direcao={direcao}
              primeiro={atual === 0}
              estatico
            />
          ) : (
            <AnimatePresence mode='wait' custom={direcao}>
              <HeroSlideStage
                key={slide.id}
                slide={slide}
                direcao={direcao}
                primeiro={atual === 0}
              />
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Navegação do carrossel */}
      <div className='absolute bottom-6 left-1/2 z-20 flex w-[min(1280px,94vw)] -translate-x-1/2 items-center justify-between min-[900px]:bottom-10'>
        <div className='flex items-center gap-4'>
          <span className='font-mono text-xs text-[#b6c5e2]'>
            <b data-testid='indice-atual' className='font-semibold text-white'>
              {indice(atual + 1)}
            </b>{' '}
            / {indice(SLIDES.length)}
          </span>
          {!estatico && (
            <span className='h-0.5 w-[130px] overflow-hidden bg-[rgba(148,178,235,0.18)]'>
              <i
                key={atual}
                className='block h-full origin-left animate-[hero-track_7s_linear_1_forwards] bg-accent'
              />
            </span>
          )}
          <span className='text-xs text-[#b6c5e2] max-[900px]:hidden'>
            A seguir:{' '}
            <b className='font-semibold text-white'>{proximo.labelCurto}</b>
          </span>
        </div>
        <div className='flex gap-2'>
          <button
            type='button'
            aria-label='Slide anterior'
            onClick={() => trocar(-1)}
            className={cn(
              'grid size-11 place-items-center rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(148,178,235,0.07)] text-white transition-colors',
              'hover:border-solid hover:border-accent hover:bg-accent/15'
            )}>
            <ArrowLeft className='size-[18px]' />
          </button>
          <button
            type='button'
            aria-label='Próximo slide'
            onClick={() => trocar(1)}
            className={cn(
              'grid size-11 place-items-center rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(148,178,235,0.07)] text-white transition-colors',
              'hover:border-solid hover:border-accent hover:bg-accent/15'
            )}>
            <ArrowRight className='size-[18px]' />
          </button>
        </div>
      </div>
    </section>
  );
}
