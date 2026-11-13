'use client';

import { LazyMotion, domAnimation } from 'motion/react';

// Os componentes `m` só animam dentro deste provider. Em dev, `strict` quebra
// a página se um `motion.*` trouxer o pacote completo de volta.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
