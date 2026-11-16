'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { LinkDaArvore } from '@/components/layout/linkDaArvore';
import {
  type ChaveVitrine,
  type FolhaFoto,
  type FolhaVitrine,
  type IdMenu,
  NAVEGACAO,
  type NoMenu,
  ehAtual
} from '@/components/layout/navegacao';
import {
  type Placa,
  idGatilho,
  idPainel,
  usePlaca,
  useRolouAlem
} from '@/components/layout/placa';
import { temaDoTopo } from '@/components/layout/temaDoTopo';
import type { VitrinesDoMenu } from '@/lib/data/maquinas/menu';
import { cn } from '@/lib/utils';
import logoBranco from '@/public/logo-branco.png';
import logoCor from '@/public/logo.png';

import { ArrowUpRight, ChevronDown } from 'lucide-react';

const ORDEM_MENUS = NAVEGACAO.menus.map((m) => m.id);
const LIMIAR_COMPACTA = 24;
const SAIDA = 'cubic-bezier(0.22, 1, 0.36, 1)';

// As cores da placa são variáveis de .placa-navbar (globals.css), trocadas pelo data-tema.
const TRACEJADO = 'border-(--placa-tracejado)';
const TRACEJADO_SUTIL = 'border-(--placa-tracejado-sutil)';
const CARD = 'bg-(--placa-card)';

const ITEM =
  'group/item inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xs border border-transparent px-3 text-sm leading-none font-medium whitespace-nowrap text-(--placa-texto) outline-none max-xl:px-2.5 hover:border-dashed hover:border-(--placa-tracejado) hover:bg-(--placa-hover) focus-visible:border-dashed focus-visible:border-(--placa-tracejado) focus-visible:bg-(--placa-hover) aria-expanded:border-dashed aria-expanded:border-(--placa-tracejado) aria-expanded:bg-(--placa-recuo) aria-[current=page]:border-dashed aria-[current=page]:border-(--placa-tracejado) aria-[current=page]:bg-(--placa-recuo) transition-[background-color,border-color,color] duration-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

const LINHA_DO_PAINEL =
  'flex h-11 items-center gap-3 rounded-xs border border-dashed border-transparent px-3 text-sm leading-[1.2] font-medium text-(--placa-texto) outline-none hover:border-solid hover:border-accent hover:bg-(--placa-recuo) focus-visible:border-solid focus-visible:border-accent focus-visible:bg-(--placa-recuo) transition-[background-color,border-color,color] duration-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

const CANTO = 'pointer-events-none absolute z-[2] size-2 border-accent';

function Cantos() {
  return (
    <>
      <span
        aria-hidden
        className={cn(CANTO, '-top-px -left-px border-t border-l')}
      />
      <span
        aria-hidden
        className={cn(CANTO, '-right-px -bottom-px border-r border-b')}
      />
    </>
  );
}

function Gatilho({ menu, placa }: { menu: NoMenu; placa: Placa }) {
  const pathname = usePathname();

  return (
    <li>
      <button
        type='button'
        {...placa.gatilho(menu.id)}
        aria-current={ehAtual(menu, pathname) ? 'page' : undefined}
        className={ITEM}>
        {menu.rotuloCurto ?? menu.rotulo}
        <ChevronDown
          aria-hidden
          className='size-3.5 text-(--placa-texto-2) transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-aria-expanded/item:rotate-180 group-aria-expanded/item:text-accent motion-reduce:transition-none'
        />
      </button>
    </li>
  );
}

function PainelVitrine({
  folhas,
  vitrines,
  preparado
}: {
  folhas: readonly FolhaVitrine[];
  vitrines: VitrinesDoMenu;
  preparado: boolean;
}) {
  const [foco, setFoco] = useState<ChaveVitrine>('todas');
  const { vitrine } = vitrines[foco];
  const [todas, ...categorias] = folhas;

  const linha = (folha: FolhaVitrine, extra?: string) => (
    <LinkDaArvore
      key={folha.id}
      alvo={folha}
      className={cn(LINHA_DO_PAINEL, extra)}
      onPointerEnter={() => setFoco(folha.vitrine)}
      onFocus={() => setFoco(folha.vitrine)}>
      <folha.icone aria-hidden className='size-5 shrink-0 text-accent' />
      <span className='min-w-0 flex-1 truncate'>{folha.rotulo}</span>
      <span className='font-mono text-xs leading-none font-medium text-(--placa-texto-2)'>
        {vitrines[folha.vitrine].total}
      </span>
    </LinkDaArvore>
  );

  return (
    <div className='grid grid-cols-[minmax(0,1fr)_340px] gap-5 max-[1100px]:grid-cols-[minmax(0,1fr)_260px]'>
      <div>
        {todas && linha(todas, 'font-semibold')}
        <div
          aria-hidden
          className={cn('my-2 border-t border-dashed', TRACEJADO_SUTIL)}
        />
        <div className='grid grid-cols-2 gap-x-3 gap-y-1'>
          {categorias.map((folha) => linha(folha))}
        </div>
      </div>
      <figure
        className={cn(
          'relative m-0 flex flex-col rounded-xs border border-dashed [contain:size]',
          TRACEJADO
        )}>
        <Cantos />
        {preparado && vitrine && (
          <div
            key={vitrine.slug}
            className='animate-in fade-in flex min-h-0 flex-1 flex-col duration-200 motion-reduce:animate-none'>
            <Image
              src={vitrine.imagem}
              alt={vitrine.nome}
              sizes='340px'
              className='min-h-0 w-full flex-1 object-contain p-3'
            />
            <figcaption
              className={cn(
                'border-t border-dashed bg-(--placa-recuo) px-3 py-2',
                TRACEJADO_SUTIL
              )}>
              <strong className='block text-sm font-bold text-(--placa-texto)'>
                {vitrine.nome}
              </strong>
              <small className='block font-mono text-[10px] leading-[1.4] tracking-[0.08em] text-(--placa-texto-2) uppercase'>
                {vitrine.subtitulo}
              </small>
            </figcaption>
          </div>
        )}
        {preparado && !vitrine && (
          <div className='animate-in fade-in flex min-h-0 flex-1 flex-col items-center justify-center gap-2 bg-(--placa-recuo) duration-200 motion-reduce:animate-none'>
            <span
              aria-hidden
              className='font-mono text-2xl leading-none text-accent'>
              +
            </span>
            <span className='text-center font-mono text-[11px] leading-[1.6] tracking-[0.2em] text-(--placa-texto-2) uppercase'>
              Solução de engenharia
              <br />
              sob projeto
            </span>
          </div>
        )}
      </figure>
    </div>
  );
}

function PainelFotos({
  folhas,
  preparado
}: {
  folhas: readonly FolhaFoto[];
  preparado: boolean;
}) {
  const [foco, setFoco] = useState(0);

  return (
    <div className='grid grid-cols-[360px_minmax(0,1fr)] gap-5 max-[1100px]:grid-cols-[300px_minmax(0,1fr)]'>
      <div className='grid gap-1'>
        {folhas.map((folha, i) => (
          <LinkDaArvore
            key={folha.id}
            alvo={folha}
            className={cn(LINHA_DO_PAINEL, 'group/servico')}
            onPointerEnter={() => setFoco(i)}
            onFocus={() => setFoco(i)}>
            <span className='min-w-0 flex-1 truncate'>{folha.rotulo}</span>
            <ArrowUpRight
              aria-hidden
              className='size-4 shrink-0 text-(--placa-texto-2) group-hover/servico:text-accent group-focus-visible/servico:text-accent'
            />
          </LinkDaArvore>
        ))}
      </div>
      <div
        className={cn(
          'relative overflow-hidden rounded-xs border border-dashed',
          TRACEJADO
        )}>
        {preparado &&
          folhas.map((folha, i) => (
            <Image
              key={folha.id}
              src={folha.foto}
              alt={folha.altFoto}
              fill
              sizes='(min-width: 1280px) 800px, 60vw'
              className={cn(
                'object-cover opacity-0 transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                i === foco && 'opacity-100'
              )}
            />
          ))}
      </div>
    </div>
  );
}

function ConteudoPainel({
  menu,
  vitrines,
  preparado
}: {
  menu: NoMenu;
  vitrines: VitrinesDoMenu;
  preparado: boolean;
}) {
  const { painel } = menu;

  switch (painel.forma) {
    case 'vitrine':
      return (
        <PainelVitrine
          folhas={painel.folhas}
          vitrines={vitrines}
          preparado={preparado}
        />
      );
    case 'cartoes':
      return (
        <div className='grid grid-cols-4 gap-3 max-[1100px]:grid-cols-2'>
          {painel.folhas.map((folha) => (
            <LinkDaArvore
              key={folha.id}
              alvo={folha}
              className={cn(
                'grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-xs border border-dashed bg-(--placa-recuo) p-3.5 text-(--placa-texto) outline-none hover:border-solid hover:border-accent focus-visible:border-solid focus-visible:border-accent transition-[background-color,border-color,color] duration-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                TRACEJADO_SUTIL
              )}>
              <folha.icone
                aria-hidden
                className='row-span-2 size-[22px] text-accent'
              />
              <strong className='truncate text-sm font-semibold'>
                {folha.rotulo}
              </strong>
              <span className='line-clamp-2 min-h-[2.8em] text-[13px] leading-[1.4] text-(--placa-texto-2)'>
                {folha.descricao}
              </span>
            </LinkDaArvore>
          ))}
        </div>
      );
    case 'fotos':
      return <PainelFotos folhas={painel.folhas} preparado={preparado} />;
  }
}

function deslizar(el: HTMLElement | null, de: number, para: number) {
  el?.animate?.(
    [
      { transform: `translateX(${de}px)` },
      { transform: `translateX(${para}px)` }
    ],
    { duration: 340, easing: SAIDA }
  );
}

export default function NavbarDesktop({
  vitrines
}: {
  vitrines: VitrinesDoMenu;
}) {
  const tema = temaDoTopo(usePathname());
  const placa = usePlaca(ORDEM_MENUS);
  const { rolou: compacta, animar } = useRolouAlem(LIMIAR_COMPACTA);
  const { aberto, sentido, prestes, raiz, gaveta } = placa;
  const nav = useRef<HTMLElement>(null);
  const corpo = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLSpanElement>(null);
  const indicador = useRef<HTMLSpanElement>(null);
  const anterior = useRef<IdMenu | null>(null);
  // Imagem de painel só entra no DOM depois que o menu abre ou está para abrir.
  const [preparados, setPreparados] = useState<ReadonlySet<IdMenu>>(new Set());

  if (prestes && !preparados.has(prestes)) {
    setPreparados(new Set([...preparados, prestes]));
  }

  useLayoutEffect(() => {
    const posicionar = () => {
      const corpoEl = corpo.current;
      const baseEl = base.current;
      const indicadorEl = indicador.current;

      if (!corpoEl || !baseEl || !indicadorEl || !nav.current) return;

      if (aberto === null) {
        corpoEl.style.clipPath = '';
        baseEl.style.transform = '';

        return;
      }

      const daPlaca = nav.current.getBoundingClientRect();

      const doGatilho = document
        .getElementById(idGatilho(aberto))
        ?.getBoundingClientRect();

      const painel = document.getElementById(idPainel(aberto));
      const altura = (painel?.getBoundingClientRect().height ?? 0) + 1;
      const total = corpoEl.getBoundingClientRect().height;

      if (doGatilho) {
        indicadorEl.style.transform = `translateX(${doGatilho.left - daPlaca.left - 1}px) scaleX(${doGatilho.width})`;
      }

      corpoEl.style.clipPath = `inset(0 0 ${Math.max(0, total - altura)}px 0)`;
      baseEl.style.transform = `translateY(${altura - 1}px)`;
    };

    const indicadorEl = indicador.current;

    if (anterior.current === null && aberto !== null && indicadorEl) {
      indicadorEl.style.transition = 'none';
      posicionar();
      void indicadorEl.offsetWidth;
      indicadorEl.style.transition = '';
    } else {
      posicionar();
    }

    const reduzido = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!reduzido && sentido !== 0 && anterior.current && aberto) {
      deslizar(document.getElementById(idPainel(aberto)), sentido * 24, 0);
      deslizar(
        document.getElementById(idPainel(anterior.current)),
        0,
        -sentido * 24
      );
    }

    anterior.current = aberto;

    window.addEventListener('resize', posicionar);
    const navEl = nav.current;
    navEl?.addEventListener('transitionend', posicionar);

    return () => {
      window.removeEventListener('resize', posicionar);
      navEl?.removeEventListener('transitionend', posicionar);
    };
  }, [aberto, compacta, sentido]);

  return (
    <div
      ref={raiz}
      data-tema={tema}
      data-compacta={compacta || undefined}
      data-aberta={aberto !== null || undefined}
      data-sem-transicao={!animar || undefined}
      className='placa-navbar group/placa fixed inset-x-0 top-0 z-50 hidden h-0 lg:block'>
      <div className='relative mx-auto w-[min(1216px,calc(100%_-_2*clamp(16px,2.5vw,32px)))]'>
        <nav
          ref={nav}
          aria-label='Principal'
          className={cn(
            'absolute inset-x-0 top-0 grid translate-y-3 grid-rows-[62px] rounded-xs border border-dashed shadow-(--placa-sombra) transition-[translate,grid-template-rows] duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[compacta]/placa:translate-y-2 group-data-[compacta]/placa:grid-rows-[46px] motion-reduce:transition-none',
            TRACEJADO
          )}>
          <span
            aria-hidden
            className='pointer-events-none absolute inset-0 -z-10 rounded-xs bg-[color-mix(in_oklch,var(--placa-card)_76%,transparent)] backdrop-blur-[14px] backdrop-saturate-[1.15]'
          />
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 -z-10 rounded-xs transition-opacity duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[compacta]/placa:opacity-0 motion-reduce:duration-[120ms] motion-reduce:ease-linear',
              CARD
            )}
          />
          <Cantos />
          <div className='grid min-w-0 grid-cols-[252px_minmax(0,1fr)_auto] items-center gap-x-7 pr-3 pl-4 transition-[grid-template-columns,column-gap] duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[compacta]/placa:grid-cols-[26px_minmax(0,1fr)_auto] group-data-[compacta]/placa:gap-x-5 max-xl:grid-cols-[26px_minmax(0,1fr)_auto] max-xl:gap-x-4 motion-reduce:transition-none'>
            <LinkDaArvore
              alvo={NAVEGACAO.marca}
              className='group/logo block h-[38.4px] rounded-xs outline-none'>
              <Image
                src={tema === 'claro' ? logoCor : logoBranco}
                alt='Profills, página inicial'
                priority
                sizes='261px'
                className='h-(--logo-altura) w-auto max-w-none [transform-origin:var(--logo-origem)] [translate:var(--logo-desloc)] [clip-path:var(--logo-recorte)] transition-[clip-path,scale,opacity] duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:opacity-80 group-focus-visible/logo:opacity-80 group-data-[compacta]/placa:scale-80 group-data-[compacta]/placa:[clip-path:var(--logo-recorte-simbolo)] max-xl:scale-80 max-xl:[clip-path:var(--logo-recorte-simbolo)] motion-reduce:transition-none'
              />
            </LinkDaArvore>
            <ul className='m-0 flex min-w-0 list-none items-center gap-1 p-0'>
              {NAVEGACAO.menus.map((menu) => (
                <Gatilho key={menu.id} menu={menu} placa={placa} />
              ))}
              <li
                aria-hidden
                className={cn('mx-2 h-5 w-0 border-l border-dashed', TRACEJADO)}
              />
              {NAVEGACAO.links.map((link) => (
                <li key={link.id}>
                  <LinkDaArvore alvo={link} className={ITEM}>
                    {link.rotulo}
                  </LinkDaArvore>
                </li>
              ))}
            </ul>
            <div
              role='group'
              aria-label='Monte a sua'
              className='flex items-center gap-2.5'>
              <span
                aria-hidden
                className='text-[13px] leading-none whitespace-nowrap text-(--placa-texto-2) max-xl:hidden'>
                Monte a sua
              </span>
              <div className='flex gap-0.5'>
                {NAVEGACAO.monte.map((no) => (
                  <LinkDaArvore
                    key={no.id}
                    alvo={no}
                    aria-label={no.rotulo}
                    className='inline-flex h-9 items-center gap-[7px] border border-(--placa-botao) bg-(--placa-botao) px-3.5 text-sm leading-none font-semibold whitespace-nowrap text-(--placa-botao-texto) outline-none first:rounded-l-xs last:rounded-r-xs hover:border-accent hover:bg-accent hover:text-white focus-visible:border-accent focus-visible:bg-accent focus-visible:text-white aria-[current=page]:border-accent aria-[current=page]:bg-(--placa-recuo) aria-[current=page]:text-(--placa-texto) transition-[background-color,border-color,color] duration-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'>
                    <no.icone aria-hidden className='size-4' />
                    {no.rotuloCurto}
                  </LinkDaArvore>
                ))}
              </div>
            </div>
          </div>
          <span
            ref={indicador}
            aria-hidden
            className='pointer-events-none absolute -bottom-px left-0 h-0.5 w-px origin-left bg-accent opacity-0 transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[aberta]/placa:opacity-100 motion-reduce:transition-none'
          />
        </nav>
        <div
          ref={gaveta}
          className="pointer-events-none invisible absolute inset-x-0 top-0 translate-y-[84px] [transition:translate_340ms_cubic-bezier(0.22,1,0.36,1),visibility_0s_linear_220ms] before:absolute before:inset-x-0 before:-top-2.5 before:h-2.5 before:content-[''] group-data-[aberta]/placa:pointer-events-auto group-data-[aberta]/placa:visible group-data-[aberta]/placa:[transition:translate_340ms_cubic-bezier(0.22,1,0.36,1),visibility_0s] group-data-[compacta]/placa:translate-y-[62px] motion-reduce:transition-none">
          <div
            ref={corpo}
            className={cn(
              'grid rounded-t-xs border border-b-0 border-dashed [clip-path:inset(0_0_100%_0)] transition-[clip-path] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
              TRACEJADO,
              CARD
            )}>
            {NAVEGACAO.menus.map((menu) => {
              const ativo = aberto === menu.id;

              return (
                <section
                  key={menu.id}
                  id={idPainel(menu.id)}
                  aria-label={menu.rotulo}
                  inert={!ativo}
                  className={cn(
                    'invisible self-start p-5 opacity-0 [grid-area:1/1] [transition:opacity_140ms_cubic-bezier(0.22,1,0.36,1),visibility_0s_linear_140ms] motion-reduce:[transition:opacity_120ms_linear,visibility_0s]',
                    ativo &&
                      'visible opacity-100 [transition:opacity_220ms_cubic-bezier(0.22,1,0.36,1)_40ms,visibility_0s]'
                  )}>
                  <ConteudoPainel
                    menu={menu}
                    vitrines={vitrines}
                    preparado={preparados.has(menu.id)}
                  />
                </section>
              );
            })}
          </div>
          <span
            ref={base}
            aria-hidden
            className={cn(
              'absolute inset-x-0 top-0 h-px border-t border-dashed opacity-0 transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[aberta]/placa:opacity-100 motion-reduce:transition-none',
              TRACEJADO
            )}>
            <span
              aria-hidden
              className={cn(CANTO, '-right-px bottom-0 border-r border-b')}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
