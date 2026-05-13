'use client';

import { useEffect, useState } from 'react';

import { motion, useReducedMotion } from 'motion/react';

const HIDE_THRESHOLD_PX = 50;

type ScrollHintProps = {
  variant: 'desktop' | 'mobile';
  targetRef?: React.RefObject<HTMLElement | null>;
  testId?: string;
};

export function ScrollHint({ variant, targetRef, testId }: ScrollHintProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    const target: HTMLElement | Window = targetRef?.current ?? window;

    const readPosition = () => {
      if (target === window) return window.scrollY;
      return (target as HTMLElement).scrollTop;
    };

    const checkPosition = () => {
      setVisible(readPosition() < HIDE_THRESHOLD_PX);
    };

    checkPosition();
    target.addEventListener('scroll', checkPosition, { passive: true });

    return () => {
      target.removeEventListener('scroll', checkPosition);
    };
  }, [reduceMotion, targetRef]);

  if (reduceMotion) return null;

  const resolvedTestId =
    testId ?? (variant === 'desktop' ? 'scroll-hint-desktop' : 'scroll-hint-mobile');

  const label =
    variant === 'mobile' ? 'Arraste para baixo' : 'Role para descobrir';

  return (
    <motion.div
      data-testid={resolvedTestId}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className='pointer-events-none fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2'>
      <div className='flex flex-col items-center'>
        <span className='scroll-hint-chevron' style={{ animationDelay: '0s' }} />
        <span
          className='scroll-hint-chevron'
          style={{ animationDelay: '0.25s' }}
        />
        <span
          className='scroll-hint-chevron'
          style={{ animationDelay: '0.5s' }}
        />
      </div>
      <span className='text-xs uppercase tracking-wider text-white/70'>
        {label}
      </span>
    </motion.div>
  );
}
