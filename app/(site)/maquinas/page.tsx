'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { Button } from '@/components/ui/button';
import { TextAnimate } from '@/components/ui/text-animate';
import { cn } from '@/lib/utils';

import CardMaquina from './_components/cardMaquinas/cardMaquina';
import {
  categorias,
  maquinasData,
  tiposEmbalagem
} from './_components/cardMaquinas/maquinasData';

/* Chip de filtro da Prancheta Industrial: tracejado em repouso,
   sólido accent quando ativo (mesma gramática das setas do hero) */
function chipFiltro(ativo: boolean) {
  return cn(
    'z-11 rounded-xs border text-xs transition-colors md:text-sm',
    ativo
      ? 'border-solid border-accent bg-accent/15 text-white hover:bg-accent/20'
      : 'text-muted-foreground border-dashed border-[rgba(148,178,235,0.3)] bg-transparent hover:border-solid hover:border-accent hover:bg-accent/10 hover:text-white'
  );
}

function MaquinasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todas');
  const [embalagemFiltro, setEmbalagemFiltro] = useState<string>('Todas');

  // Função para atualizar a URL com os filtros
  const updateUrl = (categoria: string, embalagem: string) => {
    const params = new URLSearchParams();

    if (categoria !== 'Todas') {
      params.set('categoria', categoria);
    }

    if (embalagem !== 'Todas') {
      params.set('embalagem', embalagem);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl, { scroll: false });
  };

  // Lê os parâmetros da URL e aplica os filtros
  useEffect(() => {
    const categoriaFromUrl = searchParams.get('categoria');
    const embalagemFromUrl = searchParams.get('embalagem');

    if (
      categoriaFromUrl &&
      categorias.includes(categoriaFromUrl as (typeof categorias)[number])
    ) {
      setCategoriaFiltro(categoriaFromUrl);
    }

    if (
      embalagemFromUrl &&
      tiposEmbalagem.includes(
        embalagemFromUrl as (typeof tiposEmbalagem)[number]
      )
    ) {
      setEmbalagemFiltro(embalagemFromUrl);
    }
  }, [searchParams]);

  // Estado para controlar se os filtros foram aplicados da URL
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    // Marca que os filtros foram aplicados após a primeira leitura da URL
    const timer = setTimeout(() => {
      setFiltersApplied(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [categoriaFiltro, embalagemFiltro]);

  const maquinasFiltradas = useMemo(() => {
    return maquinasData.filter((maquina) => {
      const categoriaPassa =
        categoriaFiltro === 'Todas' || maquina.categoria === categoriaFiltro;
      const embalagemPassa =
        embalagemFiltro === 'Todas' ||
        maquina.embalagensCompativeis.includes(embalagemFiltro);

      return categoriaPassa && embalagemPassa;
    });
  }, [categoriaFiltro, embalagemFiltro]);

  // Tipos de embalagem dinâmicos com base nas máquinas filtradas por categoria
  const tiposVisiveis = useMemo(() => {
    if (categoriaFiltro === 'Todas') return tiposEmbalagem;
    const set = new Set<string>();
    maquinasData.forEach((m) => {
      if (m.categoria === categoriaFiltro) {
        m.embalagensCompativeis.forEach((e) => set.add(e));
      }
    });
    const lista = Array.from(set);
    // Mantém ordem base de tiposEmbalagem para UX consistente
    return tiposEmbalagem.filter((t) => lista.includes(t));
  }, [categoriaFiltro]);

  return (
    <div className='tema-navy bg-background text-foreground relative flex min-h-screen w-full flex-col items-center justify-center py-10'>
      <GridPattern />
      <TextAnimate
        animation='blurInUp'
        by='word'
        as='h1'
        once
        startOnView
        className='z-10 pt-20 pb-4 text-2xl font-bold text-white md:pt-24 md:text-3xl'>
        Nossas Máquinas
      </TextAnimate>
      {/* Navegação superior - visível em desktop */}
      <div className='bg-background sticky top-16 left-0 z-20 hidden h-14 w-full items-center justify-center gap-3 py-2 md:flex'>
        <GridPattern />
        <Button
          variant='ghost'
          onClick={() => {
            setCategoriaFiltro('Todas');
            updateUrl('Todas', embalagemFiltro);
          }}
          className={chipFiltro(categoriaFiltro === 'Todas')}>
          Todas
        </Button>
        {categorias.map((categoria) => (
          <Button
            key={categoria}
            variant='ghost'
            onClick={() => {
              setCategoriaFiltro(categoria);
              updateUrl(categoria, embalagemFiltro);
            }}
            className={chipFiltro(categoriaFiltro === categoria)}>
            {categoria}
          </Button>
        ))}
      </div>

      {/* Scroll horizontal mobile - apenas tipos de máquinas */}
      <div className='scrollbar-hide bg-background sticky top-16 left-0 z-20 w-full px-4 py-2 md:hidden'>
        <div className='scrollbar-hide flex gap-3 overflow-x-auto'>
          <Button
            variant='ghost'
            onClick={() => {
              setCategoriaFiltro('Todas');
              updateUrl('Todas', embalagemFiltro);
            }}
            className={cn(
              'flex-shrink-0 whitespace-nowrap',
              chipFiltro(categoriaFiltro === 'Todas')
            )}>
            Todas
          </Button>
          {categorias.map((categoria) => (
            <Button
              key={categoria}
              variant='ghost'
              onClick={() => {
                setCategoriaFiltro(categoria);
                updateUrl(categoria, embalagemFiltro);
              }}
              className={cn(
                'flex-shrink-0 whitespace-nowrap',
                chipFiltro(categoriaFiltro === categoria)
              )}>
              {categoria}
            </Button>
          ))}
        </div>
      </div>

      <div className='flex w-full gap-5 pr-0 md:pr-3'>
        {/* Sidebar desktop */}
        <div className='sticky top-32 left-0 z-10 ml-2 hidden h-full w-1/6 flex-col items-center justify-start gap-2 rounded-xs bg-transparent md:flex'>
          <Button
            onClick={() => {
              setEmbalagemFiltro('Todas');
              setCategoriaFiltro('Todas');
              updateUrl('Todas', 'Todas');
            }}
            variant='ghost'
            className={cn(
              'mb-2 w-full py-2 text-center font-semibold text-white',
              chipFiltro(false)
            )}>
            Embalagens Compatíveis
          </Button>
          <div className='flex w-3/4 flex-col gap-2'>
            <Button
              variant='ghost'
              onClick={() => {
                setEmbalagemFiltro('Todas');
                updateUrl(categoriaFiltro, 'Todas');
              }}
              className={chipFiltro(embalagemFiltro === 'Todas')}>
              Todas
            </Button>
            {tiposVisiveis.map((tipo) => (
              <Button
                key={tipo}
                variant='ghost'
                onClick={() => {
                  setEmbalagemFiltro(tipo);
                  updateUrl(categoriaFiltro, tipo);
                }}
                className={chipFiltro(embalagemFiltro === tipo)}>
                {tipo}
              </Button>
            ))}
          </div>
        </div>

        {maquinasFiltradas.length === 0 ? (
          <div className='z-10 mt-8 mr-2 grid min-h-screen w-full grid-cols-12 grid-rows-12 rounded-xs px-4 md:max-w-5/6 md:px-0'>
            {/* Empty state em placa técnica */}
            <div className='relative col-span-12 col-start-1 row-span-1 row-start-1 flex w-full max-w-md flex-col items-center justify-center gap-3 place-self-center rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60 p-4 md:col-span-4 md:col-start-5 md:row-span-2 md:row-start-2 md:p-6'>
              <span
                aria-hidden
                className='absolute top-0.5 right-1.5 font-mono text-xs text-[rgba(148,178,235,0.4)]'>
                +
              </span>
              <p className='text-muted-foreground text-center text-sm md:text-base'>
                Nenhuma máquina encontrada para os filtros selecionados.
              </p>
              <Button
                variant='ghost'
                onClick={() => {
                  setEmbalagemFiltro('Todas');
                  setCategoriaFiltro('Todas');
                  updateUrl('Todas', 'Todas');
                }}
                className={cn('z-20 w-full md:w-auto', chipFiltro(false))}>
                Limpar filtros
              </Button>
            </div>
          </div>
        ) : (
          <CardMaquina
            maquinas={maquinasFiltradas}
            filterKey={`${categoriaFiltro}-${embalagemFiltro}`}
            filtersApplied={filtersApplied}
          />
        )}
      </div>
    </div>
  );
}

export default function Maquinas() {
  return (
    <Suspense
      fallback={
        <div className='tema-navy bg-background flex min-h-screen w-full items-center justify-center'>
          <div className='text-muted-foreground'>Carregando...</div>
        </div>
      }>
      <MaquinasContent />
    </Suspense>
  );
}
