'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { Box, ImageIcon } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

const Mv3d = dynamic(() => import('./mv3d'), { ssr: false });

export type Embalagem = {
  title: string;
  description: string;
  modelSrc: string;
  cameraOrbit: string;
};

const slug = (src: string) => src.split('/').pop()!.replace('.glb', '');
const posterDe = (src: string) => `/proto/posters/${slug(src)}.webp`;

function Moldura({
  children,
  card,
  rodape
}: {
  children: React.ReactNode;
  card: Embalagem;
  rodape?: React.ReactNode;
}) {
  return (
    <div className='group flex h-full w-full flex-col'>
      <div className='relative flex-1 rounded-t-xs border border-dashed border-[rgba(148,178,235,0.3)] p-3 transition-colors duration-300 group-hover:border-[rgba(148,178,235,0.55)] md:p-5'>
        <span
          aria-hidden
          className='absolute -top-px -left-px z-10 h-2 w-2 border-t border-l border-accent'
        />
        <span
          aria-hidden
          className='absolute -right-px -bottom-px z-10 h-2 w-2 border-r border-b border-accent'
        />
        {children}
        {rodape}
      </div>
      <div className='flex flex-col gap-1 rounded-b-xs border border-t-0 border-dashed border-[rgba(148,178,235,0.22)] bg-slate-900/60 px-3 py-2 transition-colors duration-300 group-hover:bg-slate-900/85 md:gap-2 md:px-5'>
        <h3 className='flex-1 text-sm font-semibold text-white md:text-base'>
          {card.title}
        </h3>
        <p className='text-muted-foreground line-clamp-2 min-h-[2lh] pb-1 text-xs leading-relaxed md:pb-2 md:text-sm'>
          {card.description}
        </p>
      </div>
    </div>
  );
}

/** Poster sempre por baixo; o 3D monta por cima e o poster some quando o .glb carrega */
function Palco({
  card,
  montar,
  girar
}: {
  card: Embalagem;
  montar: boolean;
  girar: boolean;
}) {
  const [pronto, setPronto] = useState(false);
  const visivelPronto = montar && pronto;
  return (
    <div className='relative h-[250px] w-full'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterDe(card.modelSrc)}
        alt={`Embalagem ${card.title}`}
        width={400}
        height={250}
        loading='lazy'
        decoding='async'
        className={cn(
          'absolute inset-0 h-full w-full object-contain transition-opacity duration-300',
          visivelPronto ? 'opacity-0' : 'opacity-100'
        )}
      />
      {montar && (
        <div className='absolute inset-0'>
          <Mv3d
            src={card.modelSrc}
            alt={`Modelo 3D - ${card.title}`}
            cameraOrbit={card.cameraOrbit}
            autoRotate={girar}
            poster={posterDe(card.modelSrc)}
            onPronto={() => setPronto(true)}
          />
        </div>
      )}
    </div>
  );
}

function useCentral(refs: React.RefObject<(HTMLDivElement | null)[]>, ligado: boolean) {
  const [central, setCentral] = useState<number | null>(null);
  useEffect(() => {
    if (!ligado) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const medir = () => {
      const meio = window.innerHeight / 2;
      let melhor: number | null = null;
      let dist = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const d = Math.abs(r.top + r.height / 2 - meio);
        if (d < dist) {
          dist = d;
          melhor = i;
        }
      });
      setCentral(melhor);
    };
    const agendar = () => {
      clearTimeout(t);
      t = setTimeout(medir, 150);
    };
    medir();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
    };
  }, [refs, ligado]);
  return central;
}

function useVistos(refs: React.RefObject<(HTMLDivElement | null)[]>, ligado: boolean) {
  const [vistos, setVistos] = useState<Set<number>>(new Set());
  useEffect(() => {
    if (!ligado) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.i);
          setVistos((s) => (s.has(i) ? s : new Set(s).add(i)));
        });
      },
      { rootMargin: '100px', threshold: 0.1 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [refs, ligado]);
  return vistos;
}

function useIdleDepoisDoLoad(ligado: boolean) {
  const [liberado, setLiberado] = useState(false);
  useEffect(() => {
    if (!ligado) return;
    const idle = (fn: () => void) =>
      'requestIdleCallback' in window
        ? window.requestIdleCallback(fn, { timeout: 4000 })
        : setTimeout(fn, 1500);
    const ir = () => idle(() => setLiberado(true));
    if (document.readyState === 'complete') ir();
    else window.addEventListener('load', ir, { once: true });
    return () => window.removeEventListener('load', ir);
  }, [ligado]);
  return liberado;
}

export function ListaEmbalagensProto({
  v,
  lista
}: {
  v: number;
  lista: Embalagem[];
}) {
  const reduzir = Boolean(useReducedMotion());
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [ativo, setAtivo] = useState<number | null>(null);
  const [modal, setModal] = useState<number | null>(null);
  const central = useCentral(refs, v === 3);
  const vistos = useVistos(refs, v === 5 || v === 6);
  const liberado = useIdleDepoisDoLoad(v === 6);
  const [montadosIdle, setMontadosIdle] = useState(0);

  // v6: depois do load + idle, monta um card visto por vez, cada um num idle novo
  useEffect(() => {
    if (v !== 6 || !liberado) return;
    const pendentes = [...vistos].filter((i) => i >= montadosIdle);
    if (pendentes.length === 0 && montadosIdle >= lista.length) return;
    const id =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(() => setMontadosIdle((n) => n + 1), {
            timeout: 2000
          })
        : setTimeout(() => setMontadosIdle((n) => n + 1), 400);
    return () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(id as number);
      else clearTimeout(id as ReturnType<typeof setTimeout>);
    };
  }, [v, liberado, montadosIdle, vistos, lista.length]);

  const deveMontar = useCallback(
    (i: number) => {
      switch (v) {
        case 1:
        case 2:
          return ativo === i;
        case 3:
          return central === i;
        case 5:
          return vistos.has(i);
        case 6:
          return liberado && i < montadosIdle && vistos.has(i);
        default:
          return false;
      }
    },
    [v, ativo, central, vistos, liberado, montadosIdle]
  );

  return (
    <>
      <div className='mb-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5'>
        {lista.map((card, i) => {
          const montar = deveMontar(i);
          const rodape =
            v === 2 ? (
              <button
                type='button'
                onClick={() => setAtivo((a) => (a === i ? null : i))}
                className='absolute right-2 bottom-2 z-20 inline-flex items-center gap-1.5 rounded-xs border border-[rgba(148,178,235,0.45)] bg-slate-950/80 px-2 py-1 text-[11px] font-medium text-white transition-colors hover:border-accent hover:bg-accent/25'>
                {ativo === i ? (
                  <>
                    <ImageIcon className='size-3.5' /> Ver foto
                  </>
                ) : (
                  <>
                    <Box className='size-3.5' /> Ver em 3D
                  </>
                )}
              </button>
            ) : v === 4 ? (
              <span className='pointer-events-none absolute right-2 bottom-2 z-20 inline-flex items-center gap-1.5 rounded-xs border border-[rgba(148,178,235,0.45)] bg-slate-950/80 px-2 py-1 text-[11px] font-medium text-white'>
                <Box className='size-3.5' /> Abrir em 3D
              </span>
            ) : v === 1 ? (
              <span className='pointer-events-none absolute right-2 bottom-2 z-20 inline-flex items-center gap-1 rounded-xs bg-slate-950/70 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-[#b6c5e2] uppercase'>
                <Box className='size-3' /> 3D
              </span>
            ) : null;

          return (
            <div
              key={card.modelSrc}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-i={i}
              data-proto-card
              data-montado={montar || undefined}
              className={cn(v === 4 && 'cursor-pointer', v === 1 && 'cursor-grab')}
              onPointerEnter={(e) => {
                if (v === 1 && e.pointerType === 'mouse') setAtivo(i);
              }}
              onPointerLeave={(e) => {
                if (v === 1 && e.pointerType === 'mouse')
                  setAtivo((a) => (a === i ? null : a));
              }}
              onClick={() => {
                if (v === 1) setAtivo(i);
                if (v === 4) setModal(i);
              }}>
              <Moldura card={card} rodape={rodape}>
                <Palco card={card} montar={montar} girar={!reduzir} />
              </Moldura>
            </div>
          );
        })}
      </div>

      {v === 4 && (
        <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
          <DialogContent className='max-w-3xl border-dashed border-[rgba(148,178,235,0.3)] bg-secondary text-white'>
            {modal !== null && (
              <>
                <DialogTitle>{lista[modal].title}</DialogTitle>
                <DialogDescription className='text-[#b6c5e2]'>
                  {lista[modal].description} Arraste para girar.
                </DialogDescription>
                <div className='relative h-[min(60vh,520px)] w-full'>
                  <Mv3d
                    src={lista[modal].modelSrc}
                    alt={`Modelo 3D - ${lista[modal].title}`}
                    cameraOrbit={lista[modal].cameraOrbit}
                    autoRotate={!reduzir}
                    poster={posterDe(lista[modal].modelSrc)}
                    altura='100%'
                  />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
