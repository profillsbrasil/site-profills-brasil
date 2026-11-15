'use client';

import { type MouseEvent, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

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

export type PaginaAdmin = 'posts' | 'novo' | 'editor';

type Props = {
  atual: PaginaAdmin;
  totalPosts: number;
  /** Chama `preventDefault()` no evento para segurar a saída da página. */
  aoNavegar?: (evento: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

type ItemLateral = { nome: string; Icone: LucideIcon } & (
  | { tipo: 'link'; href: string; total: number }
  | { tipo: 'emBreve' }
);

const classeItem =
  'flex items-center gap-2 rounded-xs px-3 py-2 text-sm whitespace-nowrap text-[#b6c5e2]';

const classeLink = `${classeItem} transition-colors outline-none hover:bg-[rgba(148,178,235,0.12)] hover:text-white focus-visible:bg-[rgba(148,178,235,0.12)] focus-visible:text-white motion-reduce:transition-none aria-[current=page]:bg-[rgba(148,178,235,0.18)] aria-[current=page]:text-white`;

export function Lateral({ atual, totalPosts, aoNavegar }: Props) {
  const [recolhida, setRecolhida] = useState(false);
  const IconeRecolher = recolhida ? PanelLeftOpen : PanelLeftClose;
  const rotuloRecolher = recolhida ? 'Abrir o menu' : 'Recolher o menu';

  const itens: ItemLateral[] = [
    {
      tipo: 'link',
      nome: 'Posts',
      Icone: FileText,
      href: '/admin/blog',
      total: totalPosts
    },
    { tipo: 'emBreve', nome: 'Imagens', Icone: Images },
    { tipo: 'emBreve', nome: 'Assuntos', Icone: Tags }
  ];

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

      <Link
        href='/admin/blog/novo'
        aria-label={recolhida ? 'Novo post' : undefined}
        aria-current={atual === 'novo' ? 'page' : undefined}
        title='Novo post'
        onClick={(e) => aoNavegar?.(e, '/admin/blog/novo')}
        className={`mb-2 flex items-center justify-center gap-2 rounded-xs bg-white py-2 text-sm font-medium text-[#0f172b] transition-colors outline-none hover:bg-[#e2e8f4] focus-visible:bg-[#e2e8f4] motion-reduce:transition-none ${recolhida ? 'px-0' : 'px-3'}`}>
        <Plus aria-hidden='true' className='size-[18px]' />
        {recolhida ? null : 'Novo post'}
      </Link>

      {itens.map((item) => {
        const { nome, Icone } = item;
        const alinhamento = recolhida ? 'justify-center px-0' : '';

        const icone = (
          <Icone aria-hidden='true' className='size-[18px] shrink-0' />
        );

        if (item.tipo === 'emBreve') {
          return (
            <div
              key={nome}
              title={recolhida ? `${nome}, em breve` : undefined}
              className={`${classeItem} ${alinhamento} opacity-50`}>
              {icone}
              {recolhida ? (
                <span className='sr-only'>{nome}, em breve</span>
              ) : (
                <>
                  <span>{nome}</span>
                  <span className='ml-auto text-xs'>em breve</span>
                </>
              )}
            </div>
          );
        }

        const { href, total } = item;

        return (
          <Link
            key={nome}
            href={href}
            aria-label={recolhida ? nome : undefined}
            aria-current={atual === 'posts' ? 'page' : undefined}
            title={nome}
            onClick={(e) => aoNavegar?.(e, href)}
            className={`${classeLink} ${alinhamento}`}>
            {icone}
            {recolhida ? null : (
              <>
                <span>{nome}</span>
                <span className='ml-auto font-mono text-xs text-[#b6c5e2]'>
                  {total}
                </span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
