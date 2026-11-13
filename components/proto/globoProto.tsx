'use client';

import { useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';

import { Globe as GlobeIcon } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

const GloboReal = dynamic(
  () => import('@/components/magicui/globe').then((m) => ({ default: m.Globe })),
  { ssr: false }
);
const GloboCobe = dynamic(() => import('./globoCobe'), { ssr: false });

const POSTER = '/proto/globo/globo.webp';

function Poster({ some = false }: { some?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-proto-globo
      src={POSTER}
      alt=''
      aria-hidden
      width={630}
      height={630}
      decoding='async'
      className={cn(
        'pointer-events-none absolute inset-0 m-auto h-full w-auto max-w-full object-contain transition-opacity duration-500 motion-reduce:transition-none',
        some ? 'opacity-0' : 'opacity-100'
      )}
    />
  );
}

function useIdleDepoisDoLoad() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const ir = () =>
      'requestIdleCallback' in window
        ? window.requestIdleCallback(() => setOk(true), { timeout: 4000 })
        : setTimeout(() => setOk(true), 1500);
    if (document.readyState === 'complete') ir();
    else window.addEventListener('load', ir, { once: true });
    return () => window.removeEventListener('load', ir);
  }, []);
  return ok;
}

function useNaTela<T extends HTMLElement>(margem = '200px') {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true);
          io.disconnect();
        }
      },
      { rootMargin: margem }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margem]);
  return [ref, visto] as const;
}

function MapaPontilhado({ girar }: { girar: boolean }) {
  return (
    <div
      data-proto-mapa-wrap
      className='absolute inset-0 m-auto aspect-square h-full max-w-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#eef2fb_55%,#dfe6f5_100%)] shadow-[0_0_40px_6px_rgba(45,98,239,0.18)]'>
      {/* faixa com o mapa duplicado: transladar 50% fecha o loop sem emenda */}
      <div
        className={cn(
          'absolute top-[12%] left-0 h-[76%] w-[365%]',
          girar && 'proto-pan'
        )}
        style={{ transform: girar ? undefined : 'translateX(-4.4%)' }}>
        <svg
          data-proto-mapa
          viewBox='0 0 2880 600'
          preserveAspectRatio='xMinYMid slice'
          className='h-full w-full'>
          <image href='/proto/mapa-pontos.svg' width='2880' height='600' />
          {[0, 1440].map((dx) => (
            <g key={dx}>
              {[
                [-49.27, -25.43],
                [-49.17, -22.79]
              ].map(([lng, lat]) => {
                const x = (lng + 180) * 4 + dx;
                const y = (90 - lat) * 4;
                return (
                  <g key={lng}>
                    <circle cx={x} cy={y} r={4} fill='#2d62ef' />
                    <circle
                      cx={x}
                      cy={y}
                      r={4}
                      fill='none'
                      stroke='#2d62ef'
                      strokeWidth={2}
                      className='proto-pulso'
                    />
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
      <div className='pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_55%,rgba(223,230,245,0.9)_100%)]' />
    </div>
  );
}

export function GloboProto({ v }: { v: number }) {
  const reduzir = Boolean(useReducedMotion());
  const idle = useIdleDepoisDoLoad();
  const [refTela, naTela] = useNaTela<HTMLDivElement>('200px');
  const [refDentro, dentro] = useNaTela<HTMLDivElement>('0px 0px -25% 0px');
  const [pedido, setPedido] = useState(false);
  const [pronto, setPronto] = useState(false);

  if (v === 1) {
    return (
      <div className='absolute inset-0'>
        <Poster some={pronto} />
        {idle && (
          <GloboReal
            className='absolute inset-0'
            girar={!reduzir}
            onPronto={() => setPronto(true)}
          />
        )}
      </div>
    );
  }

  if (v === 2) {
    return (
      <div ref={refTela} className='absolute inset-0 flex items-center justify-center'>
        {naTela && <GloboCobe girar={!reduzir} />}
      </div>
    );
  }

  if (v === 3) {
    return (
      <div className='absolute inset-0 p-[8%]'>
        <div className='relative h-full w-full'>
          <MapaPontilhado girar={!reduzir} />
        </div>
      </div>
    );
  }

  if (v === 4) {
    return (
      <div className='absolute inset-0'>
        <Poster />
      </div>
    );
  }

  if (v === 5) {
    return (
      <div
        data-proto-globo-alvo
        className='absolute inset-0 cursor-pointer'
        onPointerEnter={(e) => e.pointerType === 'mouse' && setPedido(true)}
        onClick={() => setPedido(true)}>
        <Poster some={pronto} />
        {pedido && (
          <GloboReal
            className='absolute inset-0'
            girar={!reduzir}
            onPronto={() => setPronto(true)}
          />
        )}
        {!pedido && (
          <span className='absolute bottom-[14%] left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-xs border border-[rgba(45,98,239,0.35)] bg-white/85 px-2.5 py-1 text-xs font-medium text-accent backdrop-blur'>
            <GlobeIcon className='size-3.5' /> Girar o globo
          </span>
        )}
      </div>
    );
  }

  // v6: o módulo do globo (com three) só baixa quando o bloco entra na tela; pausa fora dela
  return (
    <div ref={refDentro} className='absolute inset-0'>
      <Poster some={pronto} />
      {dentro && (
        <GloboReal
          className='absolute inset-0'
          girar={!reduzir}
          montarSoVisivel
          pausarFora
          onPronto={() => setPronto(true)}
        />
      )}
    </div>
  );
}
