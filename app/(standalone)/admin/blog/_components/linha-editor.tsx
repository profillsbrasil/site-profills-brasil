'use client';

import { type Dispatch, useRef } from 'react';

import { Button } from '@/components/ui/button';
import {
  type Bloco,
  type Lado,
  type Linha,
  PROPORCAO_MAXIMA,
  PROPORCAO_MINIMA
} from '@/lib/blog/tipos';
import {
  Resizable,
  ResizableHandle,
  ResizablePanel
} from '@ui-sdk/react/resizable';

import type { Carga } from './arraste';
import { CamposBloco } from './campos-bloco';
import type { AcaoEditor } from './editor-reducer';
import { classeBotaoContorno, classeIcone } from './estilos';
import { registroBlocos } from './registro-blocos';
import {
  ChevronDown,
  ChevronUp,
  Columns2,
  GripVertical,
  Trash2Icon
} from 'lucide-react';

function CartaoBloco({
  bloco,
  dispatch
}: {
  bloco: Bloco;
  dispatch: Dispatch<AcaoEditor>;
}) {
  const { nome, Icone } = registroBlocos[bloco.tipo];

  return (
    <div
      data-bloco={bloco.tipo}
      className='min-w-0 rounded-xs border border-[#dfe2e8] bg-white px-4 pt-2 pb-4'>
      <div className='mb-2 flex items-center gap-2'>
        <Icone aria-hidden='true' className='size-4 text-[#5a6172]' />
        <b className='flex-1 truncate text-sm font-medium'>{nome}</b>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          aria-label={`Apagar bloco ${nome}`}
          className={classeIcone}
          onClick={() => dispatch({ tipo: 'removerBloco', blocoId: bloco.id })}>
          <Trash2Icon />
        </Button>
      </div>
      <CamposBloco
        bloco={bloco}
        mudar={(novo) => dispatch({ tipo: 'editarBloco', bloco: novo })}
      />
    </div>
  );
}

type Props = {
  linha: Linha;
  indice: number;
  total: number;
  ladoAlvo: Lado | null;
  arrastando: boolean;
  dispatch: Dispatch<AcaoEditor>;
  novoId: () => string;
  onArrastar: (
    evento: React.PointerEvent<HTMLElement>,
    carga: Carga,
    copiar: HTMLElement | null
  ) => void;
};

export function LinhaEditor({
  linha,
  indice,
  total,
  ladoAlvo,
  arrastando,
  dispatch,
  novoId,
  onArrastar
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const numero = indice + 1;

  return (
    <div
      ref={ref}
      data-linha-id={linha.id}
      data-colunas={linha.colunas.length}
      className={`relative ${arrastando ? 'opacity-40' : ''}`}>
      <div className='mb-1 flex items-center gap-0.5'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          aria-label={`Arrastar a linha ${numero}`}
          className={`${classeIcone} cursor-grab touch-none active:cursor-grabbing`}
          onPointerDown={(e) =>
            onArrastar(
              e,
              {
                tipo: 'linha',
                linhaId: linha.id,
                colunas: linha.colunas.length
              },
              ref.current
            )
          }>
          <GripVertical />
        </Button>
        <span className='font-mono text-xs text-[#5a6172]'>
          {String(numero).padStart(2, '0')}
        </span>
        {linha.colunas.length === 2 ? (
          <span
            data-proporcao={linha.proporcao}
            className='ml-2 font-mono text-xs text-[#5a6172]'>
            {linha.proporcao}% | {100 - linha.proporcao}%
          </span>
        ) : null}
        <span className='flex-1' />
        {linha.colunas.length === 2 ? (
          <Button
            type='button'
            variant='outline'
            size='sm'
            className={`${classeBotaoContorno} h-7 px-2 text-xs`}
            onClick={() =>
              dispatch({
                tipo: 'separarColunas',
                linhaId: linha.id,
                novaLinhaId: novoId()
              })
            }>
            <Columns2 aria-hidden='true' />
            Desfazer lado a lado
          </Button>
        ) : null}
        <Button
          type='button'
          variant='ghost'
          size='icon'
          aria-label={`Subir a linha ${numero}`}
          className={classeIcone}
          disabled={indice === 0}
          onClick={() =>
            dispatch({
              tipo: 'moverLinha',
              linhaId: linha.id,
              posicao: indice - 1
            })
          }>
          <ChevronUp />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          aria-label={`Descer a linha ${numero}`}
          className={classeIcone}
          disabled={indice === total - 1}
          onClick={() =>
            dispatch({
              tipo: 'moverLinha',
              linhaId: linha.id,
              posicao: indice + 2
            })
          }>
          <ChevronDown />
        </Button>
      </div>

      {linha.colunas.length === 1 ? (
        <CartaoBloco bloco={linha.colunas[0]} dispatch={dispatch} />
      ) : (
        <Resizable
          layout={[linha.proporcao, 100 - linha.proporcao]}
          onLayoutChange={([primeira]) =>
            dispatch({
              tipo: 'redimensionar',
              linhaId: linha.id,
              proporcao: primeira
            })
          }
          step={5}
          className='w-full'>
          <ResizablePanel
            minSize={PROPORCAO_MINIMA}
            maxSize={PROPORCAO_MAXIMA}
            className='min-w-0'>
            <CartaoBloco bloco={linha.colunas[0]} dispatch={dispatch} />
          </ResizablePanel>
          <ResizableHandle
            aria-label={`Largura das colunas da linha ${numero}`}
            className='group/alca relative flex w-4 items-center justify-center outline-none'>
            <span className='h-full w-px border-l border-dashed border-[#8a90a0] transition-colors group-data-dragging/alca:border-solid group-data-dragging/alca:border-[#3b80f6] group-data-hovering/alca:border-solid group-data-hovering/alca:border-[#3b80f6] group-focus-visible/alca:border-solid group-focus-visible/alca:border-[#3b80f6] motion-reduce:transition-none' />
            <span className='absolute grid h-8 w-3 place-items-center rounded-xs border border-[#dfe2e8] bg-white text-[#5a6172] transition-colors group-data-dragging/alca:border-[#3b80f6] group-data-dragging/alca:text-[#3b80f6] group-data-hovering/alca:border-[#3b80f6] group-data-hovering/alca:text-[#3b80f6] group-focus-visible/alca:border-[#3b80f6] group-focus-visible/alca:text-[#3b80f6] motion-reduce:transition-none'>
              <GripVertical aria-hidden='true' className='size-3' />
            </span>
          </ResizableHandle>
          <ResizablePanel
            minSize={PROPORCAO_MINIMA}
            maxSize={PROPORCAO_MAXIMA}
            className='min-w-0'>
            <CartaoBloco bloco={linha.colunas[1]} dispatch={dispatch} />
          </ResizablePanel>
        </Resizable>
      )}

      {ladoAlvo ? (
        <div
          aria-hidden='true'
          data-alvo-lado={ladoAlvo}
          className={`pointer-events-none absolute top-8 bottom-0 flex w-2 items-center bg-[#3b80f6] ${ladoAlvo === 'esquerda' ? '-left-1' : '-right-1'}`}>
          <span
            className={`absolute rounded-xs bg-[#3b80f6] px-2 py-0.5 text-xs font-medium whitespace-nowrap text-white ${ladoAlvo === 'esquerda' ? 'left-3' : 'right-3'}`}>
            Lado a lado
          </span>
        </div>
      ) : null}
    </div>
  );
}
