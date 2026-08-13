import Image from 'next/image';
import Link from 'next/link';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import { type MaquinaCatalogo, maquinasCatalogo } from '@/lib/data/maquinas';
import { getMaquinasRelacionadas } from '@/lib/data/maquinas/relacionadas';

function temImagens(m: MaquinaCatalogo): m is MaquinaCatalogo & {
  imagens: NonNullable<MaquinaCatalogo['imagens']>;
} {
  return m.imagens !== undefined;
}

export function Relacionadas({ maquina }: { maquina: MaquinaCatalogo }) {
  const relacionadas = getMaquinasRelacionadas(
    maquina,
    maquinasCatalogo
  ).filter(temImagens);
  if (relacionadas.length === 0) return null;

  return (
    <section className='border-t border-dashed border-[rgba(148,178,235,0.18)] py-10 md:py-14'>
      <AnimatedContainer>
        <h2 className='text-base font-bold text-white'>
          Máquinas relacionadas
        </h2>
        <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
          {relacionadas.map((m) => (
            <Link
              key={m.slug}
              href={`/maquinas/${m.slug}`}
              className='group relative border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-4 text-center transition-colors hover:border-[rgba(148,178,235,0.6)]'>
              <Image
                src={m.imagens.maquina}
                alt={m.nomeCompleto}
                className='mx-auto h-28 w-auto object-contain'
              />
              <p className='mt-2 text-sm font-semibold text-white'>{m.nome}</p>
              {m.capacidadeMaxima && (
                <p className='text-muted-foreground/70 font-mono text-xs'>
                  até {m.capacidadeMaxima.toLocaleString('pt-BR')} un/h
                </p>
              )}
            </Link>
          ))}
        </div>
      </AnimatedContainer>
    </section>
  );
}
