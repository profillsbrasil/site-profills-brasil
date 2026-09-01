'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { Button } from '@/components/ui/button';
import { categoriasCatalogo, maquinasCatalogo } from '@/lib/data/maquinas';
import { tiposEmbalagem } from '@/lib/data/maquinas/tipos-embalagem';
import { cn } from '@/lib/utils';

import CardMaquina from './cardMaquinas/cardMaquina';
import {
  FiltrosMobile,
  FiltrosSidebar,
  chipFiltro
} from './filtrosSidebar';

/* Busca sem cerimônia: ignora acento e caixa (NFD separa os diacríticos,
   a faixa U+0300–U+036F os remove) */
function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function MaquinasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todas');
  const [embalagemFiltro, setEmbalagemFiltro] = useState<string>('Todas');
  const [busca, setBusca] = useState<string>('');

  // Função para atualizar a URL com os filtros
  const updateUrl = (categoria: string, embalagem: string, q: string) => {
    const params = new URLSearchParams();

    if (categoria !== 'Todas') {
      params.set('categoria', categoria);
    }

    if (embalagem !== 'Todas') {
      params.set('embalagem', embalagem);
    }

    if (q.trim() !== '') {
      params.set('q', q.trim());
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl, { scroll: false });
  };

  // Lê os parâmetros da URL e aplica os filtros
  useEffect(() => {
    const categoriaFromUrl = searchParams.get('categoria');
    const embalagemFromUrl = searchParams.get('embalagem');
    const buscaFromUrl = searchParams.get('q');

    if (
      categoriaFromUrl &&
      categoriasCatalogo.includes(
        categoriaFromUrl as (typeof categoriasCatalogo)[number]
      )
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

    if (buscaFromUrl) {
      setBusca(buscaFromUrl);
    }
  }, [searchParams]);

  // Digitação atualiza a listagem na hora; a URL só depois de uma pausa,
  // para o replace do router não rodar a cada tecla
  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrl(categoriaFiltro, embalagemFiltro, busca);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca]);

  // Estado para controlar se os filtros foram aplicados da URL
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    // Marca que os filtros foram aplicados após a primeira leitura da URL
    const timer = setTimeout(() => {
      setFiltersApplied(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [categoriaFiltro, embalagemFiltro]);

  const termoBusca = normalizar(busca.trim());

  const maquinasFiltradas = useMemo(() => {
    return maquinasCatalogo.filter((maquina) => {
      const categoriaPassa =
        categoriaFiltro === 'Todas' || maquina.categoria === categoriaFiltro;
      const embalagemPassa =
        embalagemFiltro === 'Todas' ||
        maquina.embalagensCompativeis.includes(embalagemFiltro);
      const buscaPassa =
        termoBusca === '' ||
        normalizar(`${maquina.nome} ${maquina.nomeCompleto}`).includes(
          termoBusca
        );

      return categoriaPassa && embalagemPassa && buscaPassa;
    });
  }, [categoriaFiltro, embalagemFiltro, termoBusca]);

  // Tipos de embalagem dinâmicos com base nas máquinas filtradas por categoria
  const tiposVisiveis = useMemo(() => {
    if (categoriaFiltro === 'Todas') return tiposEmbalagem;
    const set = new Set<string>();
    maquinasCatalogo.forEach((m) => {
      if (m.categoria === categoriaFiltro) {
        m.embalagensCompativeis.forEach((e) => set.add(e));
      }
    });
    const lista = Array.from(set);
    // Mantém ordem base de tiposEmbalagem para UX consistente
    return tiposEmbalagem.filter((t) => lista.includes(t));
  }, [categoriaFiltro]);

  // Contagem por categoria = o que o clique produz: interseção com a
  // embalagem ativa e a busca; se a embalagem for totalmente incompatível
  // com a categoria, o clique a reseta (aplicarCategoria) — a busca nunca
  // reseta, então sempre entra na conta
  const contagemPorCategoria = useMemo(() => {
    const passaEmbalagem = (m: (typeof maquinasCatalogo)[number]) =>
      embalagemFiltro === 'Todas' ||
      m.embalagensCompativeis.includes(embalagemFiltro);
    const passaBusca = (m: (typeof maquinasCatalogo)[number]) =>
      termoBusca === '' ||
      normalizar(`${m.nome} ${m.nomeCompleto}`).includes(termoBusca);
    const contagem: Record<string, number> = {
      Todas: maquinasCatalogo.filter((m) => passaEmbalagem(m) && passaBusca(m))
        .length
    };
    for (const categoria of categoriasCatalogo) {
      const daCategoria = maquinasCatalogo.filter(
        (m) => m.categoria === categoria
      );
      const embalagemMantida =
        embalagemFiltro === 'Todas' || daCategoria.some(passaEmbalagem);
      contagem[categoria] = daCategoria.filter(
        (m) => (!embalagemMantida || passaEmbalagem(m)) && passaBusca(m)
      ).length;
    }
    return contagem;
  }, [embalagemFiltro, termoBusca]);

  // Trocar de categoria descarta embalagem incompatível com a nova categoria
  // (antes ela ficava ativa e invisível, zerando a listagem sem explicação)
  const aplicarCategoria = (categoria: string) => {
    const tiposDaCategoria =
      categoria === 'Todas'
        ? tiposEmbalagem
        : tiposEmbalagem.filter((t) =>
            maquinasCatalogo.some(
              (m) =>
                m.categoria === categoria && m.embalagensCompativeis.includes(t)
            )
          );
    const embalagem = tiposDaCategoria.includes(
      embalagemFiltro as (typeof tiposEmbalagem)[number]
    )
      ? embalagemFiltro
      : 'Todas';
    setCategoriaFiltro(categoria);
    setEmbalagemFiltro(embalagem);
    updateUrl(categoria, embalagem, busca);
  };

  const aplicarEmbalagem = (tipo: string) => {
    setEmbalagemFiltro(tipo);
    updateUrl(categoriaFiltro, tipo, busca);
  };

  const limparFiltros = () => {
    setCategoriaFiltro('Todas');
    setEmbalagemFiltro('Todas');
    setBusca('');
    updateUrl('Todas', 'Todas', '');
  };

  const propsFiltros = {
    categoriaFiltro,
    embalagemFiltro,
    busca,
    tiposVisiveis,
    contagemPorCategoria,
    totalFiltrado: maquinasFiltradas.length,
    onCategoria: aplicarCategoria,
    onEmbalagem: aplicarEmbalagem,
    onBusca: setBusca,
    onLimpar: limparFiltros
  };

  return (
    <div className='tema-navy bg-background text-foreground relative flex min-h-screen w-full flex-col items-center justify-center pt-16 pb-10'>
      <GridPattern />
      <h1 className='sr-only'>Nossas Máquinas</h1>

      <FiltrosMobile {...propsFiltros} />

      <div className='flex w-full gap-5 pr-0 md:pr-3'>
        <FiltrosSidebar {...propsFiltros} />

        {maquinasFiltradas.length === 0 ? (
          <div className='z-10 mt-8 mr-2 grid min-h-screen w-full grid-cols-12 grid-rows-12 rounded-xs px-4 md:px-0'>
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
                onClick={limparFiltros}
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

export default function CatalogoMaquinas() {
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
