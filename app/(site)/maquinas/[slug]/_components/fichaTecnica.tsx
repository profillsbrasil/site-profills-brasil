import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { EspecificacaoItem, MaquinaCatalogo } from '@/lib/data/maquinas';
import { cn } from '@/lib/utils';

function PlacaSpecs({
  titulo,
  itens,
  children
}: {
  titulo: string;
  itens: EspecificacaoItem[];
  children?: React.ReactNode;
}) {
  return (
    <div className='relative flex-1 border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-5'>
      <span className='text-accent/60 absolute -top-2 -left-1 font-mono text-xs'>
        +
      </span>
      <h3 className='flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-white uppercase'>
        <span className='bg-accent inline-block h-1.5 w-1.5' />
        {titulo}
      </h3>
      <dl className='mt-3 font-mono'>
        {itens.map((item) => (
          <div
            key={item.rotulo}
            className='flex items-baseline justify-between gap-4 border-b border-[rgba(148,178,235,0.12)] py-2 last:border-0'>
            <dt className='text-muted-foreground/70 text-[11px] tracking-wider uppercase'>
              {item.rotulo}
            </dt>
            <dd className='max-w-[60%] text-right text-sm text-white'>
              {item.valor}
            </dd>
          </div>
        ))}
      </dl>
      {children}
    </div>
  );
}

export function FichaTecnica({ maquina }: { maquina: MaquinaCatalogo }) {
  if (!maquina.imagens) return null;

  return (
    <section id='ficha-tecnica' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer>
        <h2 className='text-lg font-bold text-white md:text-xl'>
          Ficha técnica
        </h2>
        <p className='text-muted-foreground/70 mt-1 font-mono text-xs tracking-wider'>
          Fonte: Catálogo de Máquinas Profills 2026
        </p>

        <div className='mt-5 flex flex-col gap-4 md:flex-row'>
          <PlacaSpecs titulo='Máquina' itens={maquina.specsMaquina} />
          <PlacaSpecs titulo='Embalagem' itens={maquina.specsEmbalagem}>
            <Image
              src={maquina.imagens.embalagem}
              alt={`Embalagem da ${maquina.nome}`}
              className={cn(
                'mx-auto mt-4 max-h-56 w-auto object-contain md:max-h-64',
                maquina.imagens.embalagemClassName
              )}
            />
          </PlacaSpecs>
        </div>

        <p className='text-muted-foreground/50 mt-3 text-xs italic'>
          Valores máximos de referência. A produção varia conforme produto,
          volume, embalagem e configuração do projeto. Especificações sujeitas a
          validação técnica de engenharia.
        </p>
      </AnimatedContainer>
    </section>
  );
}
