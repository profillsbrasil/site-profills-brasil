import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';

export function VisaoGeral({ maquina }: { maquina: MaquinaCatalogo }) {
  return (
    <section id='visao-geral' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer className='flex flex-col gap-8 md:flex-row'>
        <div className='md:w-3/5'>
          <h2 className='text-lg font-bold text-white md:text-xl'>
            Visão geral
          </h2>
          <p className='text-muted-foreground mt-3 leading-relaxed'>
            {maquina.descritivo}
          </p>
        </div>
        {maquina.recursos.length > 0 && (
          <div className='md:w-2/5'>
            <div className='relative border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-5'>
              <span className='text-accent/60 absolute -top-2 -left-1 font-mono text-xs'>
                +
              </span>
              <h3 className='font-mono text-xs font-semibold tracking-widest text-white uppercase'>
                Recursos e especiais
              </h3>
              <ul className='mt-3 space-y-2'>
                {maquina.recursos.map((r) => (
                  <li
                    key={r}
                    className='text-muted-foreground flex gap-2 text-sm'>
                    <span className='text-accent'>▸</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </AnimatedContainer>
    </section>
  );
}
