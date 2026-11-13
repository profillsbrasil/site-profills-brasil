import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Marca o conteúdo do topo de página: nasce visível no HTML do servidor e só
 * sobe 14 px por CSS (keyframes `entrada-topo` em app/globals.css), parado com
 * reduced motion. Animações que disparam ao rolar continuam com BlurFade e
 * AnimatedContainer.
 */
export function EntradaTopo({
  children,
  className,
  ordem = 0
}: {
  children: ReactNode;
  className?: string;
  /** Posição na cascata: cada passo atrasa a entrada em 60 ms */
  ordem?: number;
}) {
  return (
    <div
      className={cn('entrada-topo', className)}
      style={ordem ? ({ '--ordem': ordem } as CSSProperties) : undefined}>
      {children}
    </div>
  );
}
