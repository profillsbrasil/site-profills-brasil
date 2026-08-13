'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';
import { cn } from '@/lib/utils';

const OptimizedEmbalagem3d = dynamic(
  () =>
    import('@/components/modelo3d/optimizedEmbalagem3d').then((m) => ({
      default: m.OptimizedEmbalagem3d
    })),
  { ssr: false }
);

export function EmbalagemBloco({ maquina }: { maquina: MaquinaCatalogo }) {
  return (
    <section id='embalagem' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer className='flex flex-col items-center gap-8 md:flex-row'>
        <div className='md:w-1/2'>
          <h2 className='text-lg font-bold text-white md:text-xl'>
            A embalagem que ela entrega
          </h2>
          <dl className='mt-4 max-w-md font-mono'>
            {maquina.specsEmbalagem.map((item) => (
              <div
                key={item.rotulo}
                className='flex items-baseline justify-between gap-4 border-b border-[rgba(148,178,235,0.15)] py-2 last:border-0'>
                <dt className='text-muted-foreground/70 text-[11px] tracking-wider uppercase'>
                  {item.rotulo}
                </dt>
                <dd className='max-w-[60%] text-right text-sm text-white'>
                  {item.valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className='relative w-full border border-dashed border-[rgba(148,178,235,0.35)] p-4 md:w-1/2'>
          {maquina.embalagem3d ? (
            <>
              <OptimizedEmbalagem3d
                modelSrc={maquina.embalagem3d.glb}
                cameraOrbit={maquina.embalagem3d.cameraOrbit}
                alt={`Embalagem produzida pela ${maquina.nome}`}
                className='h-64 w-full md:h-80'
              />
              <p className='text-muted-foreground/50 mt-2 text-center font-mono text-[10px]'>
                ⟲ arraste para girar o modelo 3D
              </p>
            </>
          ) : (
            <Image
              src={maquina.imagens.embalagem}
              alt={`Embalagem produzida pela ${maquina.nome}`}
              className={cn(
                'mx-auto max-h-64 w-auto object-contain md:max-h-80',
                maquina.imagens.embalagemClassName
              )}
            />
          )}
        </div>
      </AnimatedContainer>
    </section>
  );
}
