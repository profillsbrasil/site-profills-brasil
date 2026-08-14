import { useState } from 'react';

import { ICONE_CATEGORIA } from '@/components/layout/iconesCategorias';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { categoriasCatalogo } from '@/lib/data/maquinas';
import { cn } from '@/lib/utils';

import { Layers, Search, SlidersHorizontal, X } from 'lucide-react';

/* Chip de filtro da Prancheta Industrial: tracejado em repouso,
   sólido accent quando ativo (mesma gramática das setas do hero) */
export function chipFiltro(ativo: boolean) {
  return cn(
    'z-11 rounded-xs border text-xs transition-colors md:text-sm',
    ativo
      ? 'border-solid border-accent bg-accent/15 text-white hover:bg-accent/20'
      : 'text-muted-foreground border-dashed border-[rgba(148,178,235,0.3)] bg-transparent hover:border-solid hover:border-accent hover:bg-accent/10 hover:text-white'
  );
}

interface FiltrosProps {
  categoriaFiltro: string;
  embalagemFiltro: string;
  busca: string;
  tiposVisiveis: readonly string[];
  contagemPorCategoria: Record<string, number>;
  totalFiltrado: number;
  onCategoria: (categoria: string) => void;
  onEmbalagem: (tipo: string) => void;
  onBusca: (valor: string) => void;
  onLimpar: () => void;
}

function temFiltroAtivo({
  categoriaFiltro,
  embalagemFiltro,
  busca
}: FiltrosProps) {
  return (
    categoriaFiltro !== 'Todas' ||
    embalagemFiltro !== 'Todas' ||
    busca.trim() !== ''
  );
}

/* Campo de busca da placa: lupa accent, tracejado em repouso e sólido no
   foco (mesma gramática dos chips), × para limpar quando há termo. */
function CampoBusca({
  busca,
  onBusca
}: {
  busca: string;
  onBusca: (valor: string) => void;
}) {
  return (
    <div className='relative'>
      <Search className='text-accent pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
      <input
        type='text'
        value={busca}
        onChange={(e) => onBusca(e.target.value)}
        placeholder='Buscar máquina…'
        aria-label='Buscar máquina'
        className='placeholder:text-muted-foreground/60 focus:border-accent w-full rounded-xs border border-dashed border-[rgba(148,178,235,0.35)] bg-transparent py-2 pr-9 pl-9 text-sm text-white transition-colors focus:border-solid focus:outline-none'
      />
      {busca !== '' && (
        <button
          type='button'
          onClick={() => onBusca('')}
          aria-label='Limpar busca'
          className='text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 p-1 transition-colors hover:text-white'>
          <X className='size-4' />
        </button>
      )}
    </div>
  );
}

/* Contador vivo em Geist Mono: número em accent, rótulo apagado */
function ContadorMaquinas({ total }: { total: number }) {
  return (
    <span className='font-mono text-xs tracking-wider text-white'>
      <span className='text-accent'>{total}</span>{' '}
      {total === 1 ? 'MÁQUINA' : 'MÁQUINAS'}
    </span>
  );
}

/* As duas seções de filtro — compartilhadas entre a sidebar desktop
   e a gaveta mobile para manter uma única fonte de comportamento.
   `denso` aperta o passo vertical no desktop (ponteiro preciso) para o
   painel inteiro caber no viewport sem scroll interno; a gaveta mobile
   fica com os alvos de toque maiores. */
function SecoesFiltro(props: FiltrosProps & { denso?: boolean }) {
  const {
    categoriaFiltro,
    embalagemFiltro,
    tiposVisiveis,
    contagemPorCategoria,
    onCategoria,
    onEmbalagem,
    denso = false
  } = props;

  return (
    <>
      <p className='text-muted-foreground/70 mb-2 font-mono text-[11px] tracking-wider uppercase'>
        Categoria
      </p>
      <div className='flex flex-col gap-1'>
        {(['Todas', ...categoriasCatalogo] as const).map((categoria) => {
          const Icone =
            categoria === 'Todas' ? Layers : ICONE_CATEGORIA[categoria];
          const ativo = categoriaFiltro === categoria;
          return (
            <button
              key={categoria}
              type='button'
              onClick={() => onCategoria(categoria)}
              className={cn(
                'flex w-full items-center gap-2 rounded-xs border px-2.5 text-left text-[13px] leading-snug transition-colors',
                denso ? 'py-2' : 'py-2.5',
                ativo
                  ? 'border-solid border-accent bg-accent/15 text-white'
                  : 'text-muted-foreground border-dashed border-transparent hover:border-[rgba(148,178,235,0.3)] hover:text-white'
              )}>
              <Icone className='text-accent size-4 shrink-0' />
              <span className='min-w-0 flex-1'>{categoria}</span>
              <span
                aria-hidden
                className={cn(
                  'font-mono text-[10px]',
                  ativo ? 'text-white/70' : 'text-muted-foreground/60'
                )}>
                {contagemPorCategoria[categoria] ?? 0}
              </span>
              <span className='sr-only'>
                ({contagemPorCategoria[categoria] ?? 0}{' '}
                {(contagemPorCategoria[categoria] ?? 0) === 1
                  ? 'máquina'
                  : 'máquinas'}
                )
              </span>
            </button>
          );
        })}
      </div>

      <p className='text-muted-foreground/70 mt-5 mb-2 font-mono text-[11px] tracking-wider uppercase'>
        Embalagem
      </p>
      <div className={cn('flex flex-wrap', denso ? 'gap-1.5' : 'gap-2')}>
        {['Todas', ...tiposVisiveis].map((tipo) => (
          <Button
            key={tipo}
            variant='ghost'
            onClick={() => onEmbalagem(tipo)}
            className={cn(
              denso ? 'h-8 px-3' : 'h-9 px-3',
              chipFiltro(embalagemFiltro === tipo)
            )}>
            {tipo}
          </Button>
        ))}
      </div>
    </>
  );
}

/** Painel-placa único de filtros da listagem — desktop. */
export function FiltrosSidebar(props: FiltrosProps) {
  const { totalFiltrado, onLimpar } = props;
  return (
    <aside className='sticky top-[4.5rem] z-10 mt-8 ml-3 hidden w-80 shrink-0 self-start md:block'>
      {/* Placa da busca: instrumento separado, acima do console de filtros */}
      <div className='relative mb-3 rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60 p-3'>
        <span
          aria-hidden
          className='absolute top-0.5 right-1.5 font-mono text-xs text-[rgba(148,178,235,0.4)]'>
          +
        </span>
        <p className='text-muted-foreground/70 mb-2 font-mono text-[11px] tracking-wider uppercase'>
          Buscar
        </p>
        <CampoBusca busca={props.busca} onBusca={props.onBusca} />
      </div>
      <div className='relative rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60 p-4'>
        <span
          aria-hidden
          className='absolute top-0.5 right-1.5 font-mono text-xs text-[rgba(148,178,235,0.4)]'>
          +
        </span>
        <SecoesFiltro {...props} denso />
        <div className='mt-5 flex items-center justify-between border-t border-dashed border-[rgba(148,178,235,0.22)] pt-3'>
          <ContadorMaquinas total={totalFiltrado} />
          {temFiltroAtivo(props) && (
            <button
              type='button'
              onClick={onLimpar}
              className='text-muted-foreground hover:text-white text-xs transition-colors'>
              limpar ×
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

/** Barra sticky + gaveta de filtros da listagem — mobile. */
export function FiltrosMobile(props: FiltrosProps) {
  const { totalFiltrado, onLimpar } = props;
  const [aberto, setAberto] = useState(false);
  const ativos =
    Number(props.categoriaFiltro !== 'Todas') +
    Number(props.embalagemFiltro !== 'Todas') +
    Number(props.busca.trim() !== '');

  return (
    <div className='bg-background sticky top-16 z-20 flex w-full items-center justify-between px-4 py-2 md:hidden'>
      <Drawer open={aberto} onOpenChange={setAberto}>
        <DrawerTrigger asChild>
          <Button
            variant='ghost'
            className={cn('gap-2', chipFiltro(ativos > 0))}>
            <SlidersHorizontal className='size-4' />
            Filtrar{ativos > 0 && ` · ${ativos}`}
          </Button>
        </DrawerTrigger>
        <DrawerContent className='tema-navy bg-background border-[rgba(148,178,235,0.3)]'>
          <DrawerHeader>
            <DrawerTitle className='text-muted-foreground/70 font-mono text-[11px] tracking-wider uppercase'>
              Filtrar máquinas
            </DrawerTitle>
            <DrawerDescription className='sr-only'>
              Filtre as máquinas por categoria e tipo de embalagem
            </DrawerDescription>
          </DrawerHeader>
          <div className='overflow-y-auto px-4'>
            <p className='text-muted-foreground/70 mb-2 font-mono text-[11px] tracking-wider uppercase'>
              Buscar
            </p>
            <CampoBusca busca={props.busca} onBusca={props.onBusca} />
            <div
              aria-hidden
              className='my-4 border-t border-dashed border-[rgba(148,178,235,0.22)]'
            />
            <SecoesFiltro {...props} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className='bg-accent h-12 w-full rounded-xs text-white'>
                Ver {totalFiltrado}{' '}
                {totalFiltrado === 1 ? 'máquina' : 'máquinas'}
              </Button>
            </DrawerClose>
            {temFiltroAtivo(props) && (
              <button
                type='button'
                onClick={onLimpar}
                className='text-muted-foreground hover:text-white py-1 text-xs transition-colors'>
                limpar filtros ×
              </button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <ContadorMaquinas total={totalFiltrado} />
    </div>
  );
}
