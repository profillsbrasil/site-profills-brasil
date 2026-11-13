'use client';

import { useVariante } from '@/components/proto/variante';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { cn } from '@/lib/utils';

const SUBTITULO =
  'As marcas que confiam na engenharia Profills para suas linhas de produção.';

const CLASSE_H1 = 'text-3xl font-bold tracking-tight text-foreground md:text-5xl';
const CLASSE_P = 'mt-4 max-w-xl text-sm text-muted-foreground md:text-base';
const CLASSE_SECAO =
  'relative z-10 flex w-full flex-col items-center justify-center px-4 pt-24 pb-10 text-center md:pt-28 md:pb-14';

export default function HeroClientes() {
  const v = useVariante();

  if (v === 0) {
    return (
      <section className={CLASSE_SECAO}>
        <TextAnimate
          animation='blurInUp'
          by='word'
          as='h1'
          once
          startOnView
          className={CLASSE_H1}>
          Nossos Clientes
        </TextAnimate>
        <BlurFade delay={0.15} direction='up' inView>
          <p className={CLASSE_P}>{SUBTITULO}</p>
        </BlurFade>
      </section>
    );
  }

  const efeito =
    v === 3 ? 'proto-sobe' : v === 4 ? 'proto-fade' : v === 5 ? 'proto-mascara' : '';
  const i0 = { '--i': 0 } as React.CSSProperties;
  const i1 = { '--i': 2 } as React.CSSProperties;

  return (
    <section className={CLASSE_SECAO}>
      {v === 2 && <span aria-hidden className='proto-brilho' />}
      <h1 className={cn(CLASSE_H1, 'relative', v === 5 && 'overflow-hidden')}>
        <span className={cn('block', efeito)} style={i0}>
          Nossos{' '}
          <span className={cn(v === 6 && 'proto-realce text-accent')}>
            Clientes
          </span>
        </span>
      </h1>
      <div className={cn('relative', v === 5 && 'overflow-hidden')}>
        <p className={cn(CLASSE_P, efeito)} style={i1}>
          {SUBTITULO}
        </p>
      </div>
    </section>
  );
}
