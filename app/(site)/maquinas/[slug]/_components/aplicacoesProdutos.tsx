import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';
import { categoriasProdutoInfo } from '@/lib/data/maquinas/categorias-produto';

export function AplicacoesProdutos({
  aplicacoes
}: {
  aplicacoes: MaquinaCatalogo['aplicacoes'];
}) {
  return (
    <section id='aplicacoes' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer className='flex flex-col gap-8 md:flex-row md:items-start'>
        <div className='md:w-1/2'>
          <h2 className='text-lg font-bold text-white md:text-xl'>
            Aplicações e produtos
          </h2>
          <p className='text-muted-foreground/70 mt-1 font-mono text-xs tracking-wider'>
            {aplicacoes.categoriaPrincipal}
          </p>

          <details className='group mt-5 max-w-md border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60'>
            <summary className='text-muted-foreground flex cursor-pointer list-none items-center justify-between px-4 py-3 font-mono text-sm select-none'>
              Ver produtos compatíveis ({aplicacoes.produtos.length})
              <span className='text-accent transition-transform group-open:rotate-45'>
                ＋
              </span>
            </summary>
            <ul className='flex flex-wrap gap-2 border-t border-dashed border-[rgba(148,178,235,0.25)] p-4'>
              {aplicacoes.produtos.map((p) => (
                <li
                  key={p}
                  className='text-muted-foreground rounded-full border border-[rgba(148,178,235,0.25)] px-3 py-1 text-xs'>
                  {p}
                </li>
              ))}
            </ul>
          </details>
          <p className='text-muted-foreground/50 mt-3 max-w-md text-xs italic'>
            Exemplos editoriais, sujeitos à validação técnica com produto,
            volume, embalagem e dosador.
          </p>
        </div>

        <div className='flex flex-wrap gap-2 md:w-1/2 md:justify-end'>
          {aplicacoes.categorias.map((cat) => {
            const info = categoriasProdutoInfo[cat];
            return (
              <figure
                key={cat}
                className='relative w-[92px] overflow-hidden rounded-md border border-[rgba(148,178,235,0.2)]'>
                <Image
                  src={info.img}
                  alt={`Categoria ${info.rotulo}`}
                  className='aspect-square w-full object-cover'
                />
                <figcaption className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(3,8,20,0.92)] to-transparent px-2 pt-4 pb-1 text-[9px] font-semibold tracking-wider text-white uppercase'>
                  {info.rotulo}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </AnimatedContainer>
    </section>
  );
}
