'use client';

import { useEffect, useRef, useState } from 'react';

import Image, { type StaticImageData } from 'next/image';

import sketchCaixas from '@/lib/images/blog/sketch-caixas.webp';
import sketchFlowpack from '@/lib/images/blog/sketch-flowpack.webp';
import sketchGable from '@/lib/images/blog/sketch-gable.webp';
import sketchPouch from '@/lib/images/blog/sketch-pouch.webp';
import sketchRotativa from '@/lib/images/blog/sketch-rotativa.webp';
import sketchSaches from '@/lib/images/blog/sketch-saches.webp';
import sketchVertical from '@/lib/images/blog/sketch-vertical.webp';
import { cn } from '@/lib/utils';

import { INICIO_PX, PASSO_PX, quantosDesenhos } from './desenhos-fundo';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';

export type TelaBlog = 'listagem' | 'leitura';

// A listagem e a leitura usam desenhos diferentes (decisão do user, 15/11/2026).
const desenhos: Record<TelaBlog, StaticImageData[]> = {
  listagem: [sketchGable, sketchCaixas, sketchFlowpack, sketchRotativa],
  leitura: [sketchPouch, sketchSaches, sketchVertical]
};

// Tamanho do protótipo aprovado; a opacidade sobe um degrau (0,4 para 0,5), pedido do user.
// A posição é em px, não em % da página: em % os sketches se empilhavam na página curta (16/11/2026).
const layout: Record<TelaBlog, { margem: number; classe: string }> = {
  listagem: {
    margem: -9,
    classe: 'w-[min(66vw,740px)] opacity-30 md:opacity-50'
  },
  leitura: {
    margem: -5,
    classe:
      'w-[85vw] opacity-25 min-[901px]:w-[min(42vw,620px)] min-[901px]:opacity-50'
  }
};

function Desenho({
  src,
  indice,
  tela
}: {
  src: StaticImageData;
  indice: number;
  tela: TelaBlog;
}) {
  const { scrollY } = useScroll();
  const reduzido = useReducedMotion();
  const fator = 0.18 + (indice % 3) * 0.08;
  const y = useTransform(() => scrollY.get() * fator);
  const { margem, classe } = layout[tela];

  return (
    <m.div
      className={cn('absolute', classe)}
      style={{
        top: INICIO_PX[tela] + indice * PASSO_PX[tela],
        [indice % 2 ? 'left' : 'right']: `${margem}%`,
        y: reduzido ? 0 : y
      }}>
      <Image src={src} alt='' sizes='(max-width: 900px) 85vw, 740px' />
    </m.div>
  );
}

/** Sketches blueprint nas margens, só ambientação: nunca capa de post. */
export function FundoBlog({ tela }: { tela: TelaBlog }) {
  const caixa = useRef<HTMLDivElement>(null);
  // Um só até medir: o servidor não sabe a altura da página.
  const [quantos, setQuantos] = useState(1);

  useEffect(() => {
    const elemento = caixa.current;

    if (!elemento) return;

    const medir = () =>
      setQuantos(quantosDesenhos(elemento.clientHeight, PASSO_PX[tela]));

    const observador = new ResizeObserver(medir);

    observador.observe(elemento);

    return () => observador.disconnect();
  }, [tela]);

  const ciclo = desenhos[tela];

  return (
    <div
      ref={caixa}
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 overflow-hidden'>
      {Array.from({ length: quantos }, (_, i) => (
        <Desenho key={i} src={ciclo[i % ciclo.length]} indice={i} tela={tela} />
      ))}
    </div>
  );
}
