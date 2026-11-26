import Image, { type StaticImageData } from 'next/image';

import { cn } from '@/lib/utils';

export const REVISAO = '26/11/2026';

export const classeLinha = 'border-dashed border-[rgba(148,178,235,0.3)]';

const classeMoldura =
  "relative min-w-0 rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[#0d1424] before:absolute before:-top-px before:-left-px before:z-20 before:size-2 before:border-t before:border-l before:border-accent before:content-[''] after:absolute after:-right-px after:-bottom-px after:z-20 after:size-2 after:border-r after:border-b after:border-accent after:content-['']";

export const classeRecuoLateral = 'px-[clamp(1.25rem,3vw,2.25rem)]';

export const classeTexto =
  'flex min-w-0 flex-col gap-[1.15rem] text-[1.0625rem] leading-[1.7] text-[#d9e1f2] [&>p]:max-w-[38rem] [&>ul]:max-w-[38rem]';

export const classeLink =
  'underline decoration-[rgba(148,178,235,0.55)] decoration-dashed underline-offset-4 transition-colors hover:decoration-accent hover:decoration-solid focus-visible:decoration-accent focus-visible:decoration-solid focus-visible:outline-none';

export function Desenho({
  src,
  alto,
  className
}: {
  src: StaticImageData;
  alto?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden='true'
      className={cn('grid place-items-center', className)}>
      <Image
        src={src}
        alt=''
        sizes='(min-width: 1024px) 420px, 80vw'
        className={cn(
          'h-auto w-auto max-w-full',
          alto ? 'max-h-48 lg:max-h-[22rem]' : 'max-h-44 lg:max-h-64'
        )}
      />
    </div>
  );
}

function Celula({
  rotulo,
  valor,
  className
}: {
  rotulo: string;
  valor: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'min-w-0 px-[clamp(1.25rem,3vw,2.25rem)] py-2',
        classeLinha,
        className
      )}>
      {rotulo}
      <b className='block font-mono text-[0.8125rem] font-medium text-white tabular-nums'>
        {valor}
      </b>
    </span>
  );
}

/** Carimbo de prancha no pé da folha; no celular as folhas internas mostram só folha e revisão. */
export function Carimbo({ folha, capa }: { folha: string; capa?: boolean }) {
  const soNaCapa = capa ? '' : 'max-lg:hidden';

  return (
    <footer
      className={cn(
        'grid grid-cols-2 border-t text-[0.72rem] text-[#b6c5e2] lg:grid-cols-[1.2fr_1.6fr_1fr_1fr]',
        classeLinha
      )}>
      <Celula
        rotulo='Empresa'
        valor='Profills Brasil'
        className={cn('border-r border-b lg:border-b-0', soNaCapa)}
      />
      <Celula
        rotulo='Documento'
        valor='Política de Privacidade'
        className={cn('border-b lg:border-r lg:border-b-0', soNaCapa)}
      />
      <Celula rotulo='Folha' valor={folha} className='border-r' />
      <Celula rotulo='Revisão' valor={REVISAO} />
    </footer>
  );
}

export function Moldura({
  className,
  ...resto
}: React.ComponentProps<'section'>) {
  return <section className={cn(classeMoldura, className)} {...resto} />;
}

/** Uma seção da política como folha de prancha: título em cima do texto, desenho ao lado e carimbo no pé. */
export function Folha({
  id,
  numero,
  total,
  titulo,
  desenho,
  alto,
  semRecuo,
  children
}: {
  id: string;
  numero: number;
  total: number;
  titulo: string;
  desenho?: StaticImageData;
  alto?: boolean;
  semRecuo?: boolean;
  children: React.ReactNode;
}) {
  const doisDigitos = (n: number) => String(n).padStart(2, '0');

  return (
    <Moldura id={id} aria-labelledby={`${id}-titulo`} className='scroll-mt-24'>
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-rows-[auto_1fr]',
          desenho && 'lg:grid-cols-[minmax(0,40rem)_minmax(0,1fr)]'
        )}>
        <div
          className={cn(
            'z-10 bg-[#0d1424] pt-[clamp(1.5rem,3vw,2.25rem)] pb-3 lg:sticky lg:top-[3.75rem]',
            classeRecuoLateral
          )}>
          <span className='mb-2 block font-mono text-[0.8125rem] font-medium text-[#b6c5e2] tabular-nums'>
            {doisDigitos(numero)}
          </span>
          <h2
            id={`${id}-titulo`}
            className='text-2xl leading-[1.15] font-extrabold tracking-tight text-balance'>
            {titulo}
          </h2>
        </div>
        <div
          className={cn(
            'min-w-0',
            semRecuo
              ? ''
              : cn(
                  'pt-1 pb-[clamp(1.5rem,3vw,2.25rem)]',
                  classeRecuoLateral,
                  classeTexto
                )
          )}>
          {children}
        </div>
        {desenho ? (
          <Desenho
            src={desenho}
            alto={alto}
            className='px-[clamp(1.25rem,3vw,2.25rem)] pb-[clamp(1.5rem,3vw,2.25rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center lg:pt-[clamp(1.5rem,3vw,2.25rem)] lg:pl-0'
          />
        ) : null}
      </div>
      <Carimbo folha={`${doisDigitos(numero)}/${doisDigitos(total)}`} />
    </Moldura>
  );
}

/** Faixa de uma seção longa: texto de um lado, desenho do outro, com a linha de cima de borda a borda. */
export function Bloco({
  desenho,
  alto,
  invertido,
  primeiro,
  children
}: {
  desenho: StaticImageData;
  alto?: boolean;
  invertido?: boolean;
  primeiro?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid items-center gap-x-12 gap-y-6 pb-[clamp(1.5rem,3vw,2.25rem)]',
        classeRecuoLateral,
        primeiro
          ? 'pt-2'
          : 'border-t border-dashed border-[rgba(148,178,235,0.22)] pt-[clamp(1.5rem,3vw,2.25rem)]',
        invertido
          ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,38rem)]'
          : 'lg:grid-cols-[minmax(0,38rem)_minmax(0,1fr)]'
      )}>
      <div className={classeTexto}>{children}</div>
      <Desenho
        src={desenho}
        alto={alto}
        className={invertido ? 'lg:order-first' : ''}
      />
    </div>
  );
}
