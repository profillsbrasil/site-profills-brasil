'use client';

import type { ComponentProps } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type Destino, ehAtual } from '@/components/layout/navegacao';

/**
 * O único jeito de a navbar virar <a>. O data-nav é o contrato do teste de
 * paridade entre desktop e mobile.
 */
export function LinkDaArvore({
  alvo,
  ...resto
}: { alvo: Destino } & Omit<ComponentProps<typeof Link>, 'href'>) {
  const pathname = usePathname();

  return (
    <Link
      {...resto}
      href={alvo.href}
      data-nav={alvo.id}
      aria-current={ehAtual(alvo, pathname) ? 'page' : undefined}
    />
  );
}
