'use client';

import { useEffect, useRef, useState } from 'react';

import { motion, useReducedMotion } from 'motion/react';

type ScrollHintProps = {
  variant: 'desktop' | 'mobile';
  idleMs?: number;
  targetRef?: React.RefObject<HTMLElement | null>;
  testId?: string;
};

export function ScrollHint({
  variant,
  idleMs = 2500,
  targetRef,
  testId,
}: ScrollHintProps) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setTimeout(() => {
      if (!dismissedRef.current) setVisible(true);
    }, idleMs);

    const target: HTMLElement | Window = targetRef?.current ?? window;
    const onScroll = () => {
      dismissedRef.current = true;
      window.clearTimeout(timer);
      setVisible(false);
      target.removeEventListener('scroll', onScroll);
    };

    target.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      target.removeEventListener('scroll', onScroll);
    };
  }, [idleMs, reduceMotion, targetRef]);

  if (reduceMotion) return null;

  const resolvedTestId =
    testId ?? (variant === 'desktop' ? 'scroll-hint-desktop' : 'scroll-hint-mobile');

  if (variant === 'desktop') {
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
          Role para descobrir
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      data-testid={resolvedTestId}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className='scroll-hint-pill pointer-events-none fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/85'>
      <span>Role para descobrir</span>
      <span className='scroll-hint-chevron-single' />
    </motion.div>
  );
}
