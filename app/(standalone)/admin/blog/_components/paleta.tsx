'use client';

import type { TipoBloco } from '@/lib/blog/tipos';

import type { Carga } from './arraste';
import { definicoesBlocos } from './registro-blocos';

type Props = {
  onInserir: (tipo: TipoBloco) => void;
  onArrastar: (evento: React.PointerEvent<HTMLElement>, carga: Carga) => void;
};

export function Paleta({ onInserir, onArrastar }: Props) {
  return (
    <ul className='grid gap-2' aria-label='Tipos de bloco'>
      {definicoesBlocos.map(({ tipo, nome, descricao, Icone }) => (
        <li key={tipo}>
          <button
            type='button'
            data-paleta={tipo}
            onClick={() => onInserir(tipo)}
            onPointerDown={(e) => onArrastar(e, { tipo: 'novo', bloco: tipo })}
            className='grid min-h-14 w-full cursor-grab touch-none grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-0.5 rounded-xs border border-[#dfe2e8] bg-white px-3 py-2 text-left transition-colors outline-none select-none hover:border-[#3b80f6] hover:bg-[#e8f0fe] focus-visible:border-[#3b80f6] focus-visible:bg-[#e8f0fe] active:cursor-grabbing motion-reduce:transition-none'>
            <Icone
              aria-hidden='true'
              className='row-span-2 size-5 text-[#5a6172]'
            />
            <b className='text-sm font-medium'>{nome}</b>
            <small className='truncate text-xs leading-snug text-[#5a6172]'>
              {descricao}
            </small>
          </button>
        </li>
      ))}
    </ul>
  );
}
