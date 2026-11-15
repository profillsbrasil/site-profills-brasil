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

const itensSemTela: { nome: string; Icone: LucideIcon; total: number }[] = [
  { nome: 'Imagens', Icone: Images, total: 7 },
  { nome: 'Assuntos', Icone: Tags, total: 6 }
];

const classeItem =
  'flex items-center gap-2.5 rounded-xs px-2.5 py-2 text-left text-sm whitespace-nowrap text-[#b6c5e2] transition-colors outline-none hover:bg-[rgba(148,178,235,0.12)] hover:text-white focus-visible:bg-[rgba(148,178,235,0.12)] focus-visible:text-white motion-reduce:transition-none aria-[current=page]:bg-[rgba(148,178,235,0.18)] aria-[current=page]:text-white';

export function Lateral({ atual, totalPosts, aoNavegar }: Props) {
  const [recolhida, setRecolhida] = useState(false);
  const IconeRecolher = recolhida ? PanelLeftOpen : PanelLeftClose;
  const rotuloRecolher = recolhida ? 'Abrir o menu' : 'Recolher o menu';

  const itens = [
    { nome: 'Posts', Icone: FileText, total: totalPosts, href: '/admin/blog' },
    ...itensSemTela.map((item) => ({ ...item, href: null }))
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
        className={`mb-2 flex items-center justify-center gap-2 rounded-xs bg-[#3b80f6] py-2 text-sm font-semibold text-white transition-colors outline-none hover:bg-[#2f6fe0] focus-visible:bg-[#2f6fe0] motion-reduce:transition-none ${recolhida ? 'px-0' : 'px-2.5'}`}>
        <Plus aria-hidden='true' className='size-[18px]' />
        {recolhida ? null : 'Novo post'}
      </Link>

      {itens.map(({ nome, Icone, total, href }) => {
        const conteudo = (
          <>
            <Icone aria-hidden='true' className='size-[18px] shrink-0' />
            {recolhida ? null : (
              <>
                <span>{nome}</span>
                <span className='ml-auto font-mono text-xs text-[#b6c5e2]'>
                  {total}
                </span>
              </>
            )}
          </>
        );

        const classe = `${classeItem} ${recolhida ? 'justify-center px-0' : ''}`;

        return href ? (
          <Link
            key={nome}
            href={href}
            aria-label={recolhida ? nome : undefined}
            aria-current={atual === 'posts' ? 'page' : undefined}
            title={nome}
            onClick={(e) => aoNavegar?.(e, href)}
            className={classe}>
            {conteudo}
          </Link>
        ) : (
          <button
            key={nome}
            type='button'
            aria-label={recolhida ? nome : undefined}
            title={nome}
            className={classe}>
            {conteudo}
          </button>
        );
      })}
    </nav>
  );
}
