'use client';

import { useState } from 'react';

import Image from 'next/image';

import logoBranco from '@/public/logo-branco.png';

import {
  FileText,
  Images,
  type LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Tags
} from 'lucide-react';

const itens: { nome: string; Icone: LucideIcon; total: number }[] = [
  { nome: 'Posts', Icone: FileText, total: 4 },
  { nome: 'Imagens', Icone: Images, total: 7 },
  { nome: 'Assuntos', Icone: Tags, total: 6 }
];

const classeItem =
  'flex items-center gap-2.5 rounded-xs px-2.5 py-2 text-left text-sm whitespace-nowrap text-[#b6c5e2] transition-colors outline-none hover:bg-[rgba(148,178,235,0.12)] hover:text-white focus-visible:bg-[rgba(148,178,235,0.12)] focus-visible:text-white motion-reduce:transition-none';

export function Lateral() {
  const [recolhida, setRecolhida] = useState(false);
  const IconeRecolher = recolhida ? PanelLeftOpen : PanelLeftClose;
  const rotuloRecolher = recolhida ? 'Abrir o menu' : 'Recolher o menu';

  return (
    <nav
      aria-label='Admin do blog'
      data-recolhida={recolhida}
      className={`flex flex-col gap-1 overflow-hidden px-2 py-3 text-white transition-[width] motion-reduce:transition-none ${recolhida ? 'w-14' : 'w-56'}`}>
      <div
        className={`flex items-center gap-2 px-1 pb-3 ${recolhida ? 'justify-center' : 'justify-between'}`}>
        {recolhida ? null : (
          <Image
            src={logoBranco}
            alt='Profills'
            sizes='131px'
            className='h-5 w-auto'
          />
        )}
        <button
          type='button'
          aria-label={rotuloRecolher}
          title={rotuloRecolher}
          onClick={() => setRecolhida((r) => !r)}
          className='grid size-8 shrink-0 place-items-center rounded-xs text-[#b6c5e2] transition-colors outline-none hover:bg-[rgba(148,178,235,0.12)] hover:text-white focus-visible:bg-[rgba(148,178,235,0.12)] focus-visible:text-white motion-reduce:transition-none'>
          <IconeRecolher aria-hidden='true' className='size-[18px]' />
        </button>
      </div>

      <button
        type='button'
        aria-label={recolhida ? 'Novo post' : undefined}
        title='Novo post'
        className={`mb-2 flex items-center justify-center gap-2 rounded-xs bg-[#3b80f6] py-2 text-sm font-semibold text-white transition-colors outline-none hover:bg-[#2f6fe0] focus-visible:bg-[#2f6fe0] motion-reduce:transition-none ${recolhida ? 'px-0' : 'px-2.5'}`}>
        <Plus aria-hidden='true' className='size-[18px]' />
        {recolhida ? null : 'Novo post'}
      </button>

      {itens.map(({ nome, Icone, total }) => (
        <button
          key={nome}
          type='button'
          aria-label={recolhida ? nome : undefined}
          aria-current={nome === 'Posts' ? 'page' : undefined}
          title={nome}
          className={`${classeItem} aria-[current=page]:bg-[rgba(148,178,235,0.18)] aria-[current=page]:text-white ${recolhida ? 'justify-center px-0' : ''}`}>
          <Icone aria-hidden='true' className='size-[18px] shrink-0' />
          {recolhida ? null : (
            <>
              <span>{nome}</span>
              <span className='ml-auto font-mono text-xs text-[#b6c5e2]'>
                {total}
              </span>
            </>
          )}
        </button>
      ))}
    </nav>
  );
}
