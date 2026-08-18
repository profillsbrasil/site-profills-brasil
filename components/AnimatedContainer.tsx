'use client';

import type React from 'react';

import { motion, useReducedMotion } from 'motion/react';

type TriggerMode = 'inView' | 'mount';

export type AnimatedContainerProps = {
  delay?: number;
  className?: React.ComponentProps<'div'>['className'];
  children: React.ReactNode;
  /** "inView" = anima ao entrar na viewport; "mount" = anima ao montar (bom p/ tabs, modais, carrosséis) */
  trigger?: TriggerMode;
  /** Se usar inView, permitir reanimar quando voltar a aparecer */
  once?: boolean;
  /** Fração do elemento visível para disparar (0–1). Padrão mais estável que margin negativa. */
  amount?: number;
};

export function AnimatedContainer({
  className,
  delay = 0.1,
  children,
  trigger = 'inView',
  once = true,
  amount = 0.15
}: AnimatedContainerProps) {
  const reduce = useReducedMotion();

  /* Reduced motion NÃO pode trocar a árvore (div estática vs motion.div):
     o SSR emite opacity:0 inline e, num hydration mismatch, o React não
     corrige atributos — a página inteira ficava invisível para quem usa
     "reduzir animações". A árvore é sempre a mesma; com reduce, só a
     transition (que não vai ao HTML) zera: o conteúdo aparece instantâneo. */
  if (trigger === 'mount') {
    // Garante que aparece sempre, mesmo em tabs/modais/carrosséis
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce ? { duration: 0 } : { delay, duration: 0.6, ease: 'easeOut' }
        }
        className={className}>
        {children}
      </motion.div>
    );
  }

  // Modo padrão: anima ao entrar na viewport (sem margin negativa)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={
        reduce ? { duration: 0 } : { delay, duration: 0.4, ease: 'easeOut' }
      }
      className={className}>
      {children}
    </motion.div>
  );
}
