import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import { NumberTicker } from '@/components/magicui/number-ticker';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';
import { cn } from '@/lib/utils';

function Cantoneiras() {
  const base = 'absolute h-2.5 w-2.5 border-accent';
  return (
    <>
      <span className={cn(base, '-top-px -left-px border-t-2 border-l-2')} />
      <span className={cn(base, '-top-px -right-px border-t-2 border-r-2')} />
      <span className={cn(base, '-bottom-px -left-px border-b-2 border-l-2')} />
      <span
        className={cn(base, '-right-px -bottom-px border-r-2 border-b-2')}
      />
    </>
  );
}

interface HeroDossieProps {
  maquina: MaquinaCatalogo;
  children?: React.ReactNode;
}

export function HeroDossie({ maquina, children }: HeroDossieProps) {
  const linhasBase = maquina.destaqueHero ?? maquina.specsMaquina.slice(0, 3);
  const capacidadeMaxima = maquina.capacidadeMaxima;
  const temTicker = capacidadeMaxima != null;
  const linhas = temTicker
    ? linhasBase.filter((l) => !l.rotulo.startsWith('Capacidade')).slice(0, 2)
    : linhasBase;

  return (
    <AnimatedContainer trigger='mount' className='pt-8 md:pt-12'>
      <section className='relative border border-dashed border-[rgba(148,178,235,0.35)] p-5 md:p-8'>
        <Cantoneiras />
        <div className='flex items-center justify-between border-b border-dashed border-[rgba(148,178,235,0.25)] pb-3'>
          <span
            data-testid='categoria-hero'
            className='text-accent font-mono text-[10px] tracking-[0.2em] uppercase'>
            {maquina.categoria}
          </span>
          <span className='text-muted-foreground/60 font-mono text-[10px] tracking-wider'>
            FICHA · CATÁLOGO 2026 · {maquina.paginaCatalogo}
          </span>
        </div>

        <div className='flex flex-col items-center gap-6 pt-6 md:flex-row'>
          <div
            className={cn(
              'w-full',
              maquina.imagens ? 'md:w-[45%]' : 'md:w-full'
            )}>
            <h1 className='text-2xl leading-tight font-bold text-white md:text-4xl'>
              {maquina.nomeCompleto}
            </h1>
            <p className='text-muted-foreground mt-3 max-w-md text-sm md:text-base'>
              {maquina.headline}
            </p>

            <dl className='mt-5 w-full max-w-sm font-mono'>
              {temTicker && (
                <div className='flex items-baseline justify-between gap-4 border-b border-[rgba(148,178,235,0.15)] py-2 last:border-0'>
                  <dt className='text-muted-foreground/70 text-[11px] tracking-wider uppercase'>
                    Capacidade
                  </dt>
                  <dd className='text-right text-sm font-semibold text-white'>
                    <span data-ticker>
                      até{' '}
                      <NumberTicker
                        value={capacidadeMaxima}
                        startValue={Math.floor(capacidadeMaxima * 0.5)}
                        className='font-semibold text-white'
                      />{' '}
                      un/h
                    </span>
                  </dd>
                </div>
              )}
              {linhas.map((item) => (
                <div
                  key={item.rotulo}
                  className='flex items-baseline justify-between gap-4 border-b border-[rgba(148,178,235,0.15)] py-2 last:border-0'>
                  <dt className='text-muted-foreground/70 text-[11px] tracking-wider uppercase'>
                    {item.rotulo}
                  </dt>
                  <dd className='text-right text-sm font-semibold text-white'>
                    {item.valor}
                  </dd>
                </div>
              ))}
            </dl>

            {temTicker && (
              <p className='text-muted-foreground/50 mt-2 max-w-sm font-mono text-[10px] italic'>
                A produção varia conforme produto, volume, embalagem e
                configuração do projeto.
              </p>
            )}

            <div className='mt-6 flex flex-wrap gap-3'>{children}</div>
          </div>

          {maquina.imagens && (
            <div className='relative flex w-full justify-center md:w-[55%]'>
              <Image
                src={maquina.imagens.maquina}
                alt={`${maquina.nomeCompleto} Profills`}
                priority
                className={cn(
                  'md:-my-16 max-h-[320px] w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)] md:max-h-[480px]',
                  maquina.imagens.maquinaClassName
                )}
              />
            </div>
          )}
        </div>
      </section>
    </AnimatedContainer>
  );
}
