import { dataCurta } from '@/lib/blog/apresentacao';
import { type Assunto, assuntos } from '@/lib/blog/tipos';

export function MetaPost({
  assunto,
  publicadoEm,
  minutos
}: {
  assunto: Assunto;
  publicadoEm: string;
  minutos?: number;
}) {
  return (
    <div className='flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[0.68rem] tracking-wider text-[#b6c5e2] uppercase'>
      <span className='flex items-center gap-2 text-white'>
        <span aria-hidden='true' className='size-1.5 bg-accent' />
        {assuntos[assunto].nome}
      </span>
      <time dateTime={publicadoEm} className='font-mono tabular-nums'>
        {dataCurta(publicadoEm)}
      </time>
      {minutos ? (
        <span className='font-mono tabular-nums'>{minutos} min de leitura</span>
      ) : null}
    </div>
  );
}
