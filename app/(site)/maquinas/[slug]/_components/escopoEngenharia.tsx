import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';
import { compostosJuntos } from '@/lib/utils/nbsp';

interface EscopoEngenhariaProps {
  conteudo: NonNullable<MaquinaCatalogo['conteudoEngenharia']>;
}

export function EscopoEngenharia({ conteudo }: EscopoEngenhariaProps) {
  return (
    <section id='escopo' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer className='flex flex-col gap-8 md:flex-row'>
        <div className='md:w-3/5'>
          <h2 className='text-xl font-bold text-white md:text-2xl'>
            Escopo da solução
          </h2>
          {conteudo.escopo && (
            <p className='text-muted-foreground mt-3 text-lg leading-relaxed text-pretty'>
              {conteudo.escopo}
            </p>
          )}
        </div>
        <div className='md:w-2/5'>
          <div className='relative border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-5'>
            <span className='text-accent/60 absolute -top-2 -left-1 font-mono text-xs'>
              +
            </span>
            <h3 className='font-mono text-sm font-semibold tracking-widest text-white uppercase'>
              Composição da solução
            </h3>
            <dl className='mt-3 font-mono'>
              {conteudo.blocos.map((item) => (
                <div
                  key={item.rotulo}
                  className='flex items-baseline justify-between gap-4 border-b border-[rgba(148,178,235,0.12)] py-2 last:border-0'>
                  <dt className='text-muted-foreground/70 text-[13px] tracking-wider uppercase'>
                    {item.rotulo}
                  </dt>
                  <dd className='max-w-[60%] text-right text-base text-pretty text-white'>
                    {compostosJuntos(item.valor)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </AnimatedContainer>
    </section>
  );
}
