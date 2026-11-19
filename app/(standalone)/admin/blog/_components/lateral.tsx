'use client';

import { type MouseEvent, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { type FiltroPosts, filtrosPosts } from '@/lib/blog/apresentacao';
import { assuntos } from '@/lib/blog/tipos';
import logoBranco from '@/public/logo-branco.png';

import { sairDoAdmin } from '../../entrar/acoes';
import {
  ExternalLink,
  FileText,
  Images,
  LogOut,
  type LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Tags
} from 'lucide-react';

export type PaginaAdmin =
  FiltroPosts | 'novo' | 'editor' | 'imagens' | 'assuntos';

/** `imagens` é null quando o armazém não respondeu: o item fica sem número. */
export type TotaisLateral = {
  posts: number;
  publicados: number;
  rascunhos: number;
  imagens: number | null;
};

type Props = {
  atual: PaginaAdmin;
  totais: TotaisLateral;
  /** O usuário da sessão; sem nome, a linha da conta mostra "Admin". */
  usuario: string | null;
  /** Chama `preventDefault()` no evento para segurar a saída da página. */
  aoNavegar?: (evento: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

type ItemLateral = {
  nome: string;
  titulo: string;
  Icone: LucideIcon | null;
  href: string;
  pagina: PaginaAdmin;
  total: number | null;
};

const TOTAL_ASSUNTOS = Object.keys(assuntos).length;

type EstadoLateral = 'aberta' | 'recolhida' | 'reaberta';

const classeFade =
  'motion-safe:animate-in motion-safe:fade-in motion-safe:duration-160 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:delay-30 motion-safe:fill-mode-both';

const classeHover =
  'text-admin-lateral-texto transition-colors outline-none hover:bg-admin-lateral-hover hover:text-white focus-visible:bg-admin-lateral-hover focus-visible:text-white motion-reduce:transition-none';

const classeLink = `flex items-center gap-2 rounded-xs px-[11px] py-2 text-sm whitespace-nowrap ${classeHover} aria-[current=page]:bg-admin-lateral-ativo aria-[current=page]:text-white`;

const classeBotaoIcone = `grid size-8 shrink-0 place-items-center rounded-xs ${classeHover}`;

const classeGrupo = 'px-[11px] pt-3.5 pb-1 text-xs text-admin-lateral-texto/70';

export function Lateral({ atual, totais, usuario, aoNavegar }: Props) {
  const [estado, setEstado] = useState<EstadoLateral>('aberta');
  const recolhida = estado === 'recolhida';
  const fade = estado === 'reaberta' ? classeFade : '';
  const IconeRecolher = recolhida ? PanelLeftOpen : PanelLeftClose;
  const rotuloRecolher = recolhida ? 'Abrir o menu' : 'Recolher o menu';
  const nome = usuario || 'Admin';

  const marcado = (pagina: PaginaAdmin) =>
    atual === pagina ||
    (recolhida && pagina === 'todos' && Object.hasOwn(filtrosPosts, atual));

  const posts: ItemLateral[] = [
    {
      ...filtroComoItem('todos', totais.posts),
      titulo: 'Todos os posts',
      Icone: FileText
    },
    ...(recolhida
      ? []
      : [
          filtroComoItem('publicados', totais.publicados),
          filtroComoItem('rascunhos', totais.rascunhos)
        ])
  ];

  const biblioteca: ItemLateral[] = [
    {
      nome: 'Imagens',
      titulo: 'Imagens',
      Icone: Images,
      href: '/admin/blog/imagens',
      pagina: 'imagens',
      total: totais.imagens
    },
    {
      nome: 'Assuntos',
      titulo: 'Assuntos',
      Icone: Tags,
      href: '/admin/blog/assuntos',
      pagina: 'assuntos',
      total: TOTAL_ASSUNTOS
    }
  ];

  const item = ({ nome, titulo, Icone, href, pagina, total }: ItemLateral) => (
    <Link
      key={pagina}
      href={href}
      aria-label={recolhida ? titulo : undefined}
      aria-current={marcado(pagina) ? 'page' : undefined}
      title={titulo}
      onClick={(e) => aoNavegar?.(e, href)}
      className={`${classeLink} ${Icone ? '' : 'py-1.5 pl-[37px] text-[13px]'}`}>
      {Icone ? (
        <Icone aria-hidden='true' className='size-[18px] shrink-0' />
      ) : null}
      {recolhida ? null : (
        <>
          <span className={fade}>{nome}</span>
          {total === null ? null : (
            <span
              className={`ml-auto font-mono text-xs tabular-nums ${total === 0 ? 'opacity-70' : 'opacity-100'} ${fade}`}>
              {total}
            </span>
          )}
        </>
      )}
    </Link>
  );

  return (
    <nav
      aria-label='Admin do blog'
      data-recolhida={recolhida}
      className={`flex flex-col gap-1 overflow-hidden bg-admin-lateral bg-(image:--admin-lateral-grade) bg-size-[24px_24px] px-2 py-3 text-white ${recolhida ? 'w-14' : 'w-62'}`}>
      <div
        className={`flex items-center gap-2 px-1 pb-3 ${recolhida ? 'justify-center' : 'justify-between'}`}>
        {recolhida ? null : (
          <Image
            src={logoBranco}
            alt='Profills'
            sizes='131px'
            className={`h-5 w-auto ${fade}`}
          />
        )}
        <button
          type='button'
          aria-label={rotuloRecolher}
          title={rotuloRecolher}
          onClick={() =>
            setEstado((atual) =>
              atual === 'recolhida' ? 'reaberta' : 'recolhida'
            )
          }
          className={classeBotaoIcone}>
          <IconeRecolher aria-hidden='true' className='size-[18px]' />
        </button>
      </div>

      <Link
        href='/admin/blog/novo'
        aria-label={recolhida ? 'Novo post' : undefined}
        aria-current={atual === 'novo' ? 'page' : undefined}
        title='Novo post'
        onClick={(e) => aoNavegar?.(e, '/admin/blog/novo')}
        className={`mb-2 flex items-center justify-center gap-2 rounded-xs bg-white py-2 text-sm font-medium text-admin-lateral transition-colors outline-none hover:bg-[#e2e8f4] focus-visible:bg-[#e2e8f4] motion-reduce:transition-none ${recolhida ? 'px-0' : 'px-3'}`}>
        <Plus aria-hidden='true' className='size-[18px]' />
        {recolhida ? null : <span className={fade}>Novo post</span>}
      </Link>

      {recolhida ? null : <p className={`${classeGrupo} ${fade}`}>Posts</p>}
      {posts.map(item)}

      {recolhida ? null : (
        <p className={`${classeGrupo} ${fade}`}>Biblioteca</p>
      )}
      {biblioteca.map(item)}

      <a
        href='/blog'
        target='_blank'
        rel='noopener'
        aria-label={recolhida ? 'Ver o blog' : undefined}
        title='Ver o blog em outra aba'
        className={`${classeLink} mt-auto`}>
        <ExternalLink aria-hidden='true' className='size-[18px] shrink-0' />
        {recolhida ? null : <span className={fade}>Ver o blog</span>}
      </a>

      <div
        className={`mt-1.5 flex items-center gap-2 border-t border-admin-lateral-linha pt-2.5 ${recolhida ? 'justify-center' : 'pl-[11px]'}`}>
        {recolhida ? null : (
          <>
            <span
              aria-hidden='true'
              className={`grid size-6 shrink-0 place-items-center rounded-full bg-admin-lateral-ativo text-[11px] font-semibold text-white ${fade}`}>
              {nome.charAt(0).toUpperCase()}
            </span>
            <span className={`truncate text-sm font-medium ${fade}`}>
              {nome}
            </span>
          </>
        )}
        <form action={sairDoAdmin} className={recolhida ? '' : 'ml-auto'}>
          <button
            type='submit'
            aria-label='Sair'
            title='Sair'
            className={classeBotaoIcone}>
            <LogOut aria-hidden='true' className='size-[18px]' />
          </button>
        </form>
      </div>
    </nav>
  );
}

function filtroComoItem(filtro: FiltroPosts, total: number) {
  const { rotulo, href } = filtrosPosts[filtro];

  return {
    nome: rotulo,
    titulo: rotulo,
    Icone: null,
    href,
    pagina: filtro,
    total
  } satisfies ItemLateral;
}
