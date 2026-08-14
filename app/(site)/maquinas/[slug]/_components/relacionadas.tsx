import Image from 'next/image';
import Link from 'next/link';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { type MaquinaCatalogo, maquinasCatalogo } from '@/lib/data/maquinas';
import { getMaquinasRelacionadas } from '@/lib/data/maquinas/relacionadas';

/* Setas-chip do carrossel: tracejado em repouso, accent no hover —
   mesma gramática dos filtros da listagem. `static` desarma o
   posicionamento absoluto default do shadcn. */
const setaCarrossel =
  'static size-8 translate-y-0 rounded-xs border-dashed border-[rgba(148,178,235,0.4)] bg-transparent text-accent hover:border-solid hover:border-accent hover:bg-accent/10 hover:text-accent disabled:opacity-40';

/* Fileira sempre cheia: com menos que isso o carrossel fica "magro" —
   a vista desktop mostra ~3.3 cards, 8 garante deslize de verdade */
const MINIMO_CARROSSEL = 8;

export function Relacionadas({ maquina }: { maquina: MaquinaCatalogo }) {
  const relacionadas = getMaquinasRelacionadas(maquina, maquinasCatalogo, {
    minimo: MINIMO_CARROSSEL
  });
  if (relacionadas.length === 0) return null;

  return (
    <section className='w-full py-10 md:py-14'>
      <AnimatedContainer>
        <Carousel opts={{ align: 'start' }}>
          <div className='mx-auto mb-4 flex w-full max-w-7xl items-center justify-between px-4 md:px-8'>
            <h2 className='text-base font-bold text-white'>
              Máquinas relacionadas
            </h2>
            <div className='flex gap-2'>
              <CarouselPrevious className={setaCarrossel} />
              <CarouselNext className={setaCarrossel} />
            </div>
          </div>
          {/* Trilho full-bleed de verdade: o 1º card nasce colado na borda
              esquerda da página e a fileira corre até a direita */}
          <CarouselContent>
            {relacionadas.map((m) => (
              <CarouselItem
                key={m.slug}
                className='basis-[75%] sm:basis-[320px] md:basis-[360px]'>
                <Link
                  href={`/maquinas/${m.slug}`}
                  className='group block h-full border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-4 text-center transition-colors hover:border-[rgba(148,178,235,0.6)]'>
                  <Image
                    src={m.imagens.maquina}
                    alt={m.nomeCompleto}
                    className='mx-auto h-40 w-auto object-contain md:h-48'
                  />
                  <p className='mt-3 text-sm font-semibold text-white'>
                    {m.nome}
                  </p>
                  {m.capacidadeMaxima && (
                    <p className='text-muted-foreground/70 font-mono text-xs'>
                      até {m.capacidadeMaxima.toLocaleString('pt-BR')} un/h
                    </p>
                  )}
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </AnimatedContainer>
    </section>
  );
}
