'use client';

import { type ReactNode, useRef, useState } from 'react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import {
  ABAS_DO_CELULAR,
  type AbaComFolha,
  type AbaFolha,
  type AbaLink,
  type IdAba,
  type IdFolha,
  abaAtual,
  rotuloVer
} from '@/components/layout/abasCelular';
import { useNavCelular } from '@/components/layout/estadoCelular';
import { LinkDaArvore } from '@/components/layout/linkDaArvore';
import {
  type Destino,
  NAVEGACAO,
  type NoMenu
} from '@/components/layout/navegacao';
import {
  Drawer,
  DrawerAlca,
  DrawerClose,
  DrawerOverlay,
  DrawerPainel,
  DrawerPortal,
  DrawerTitle
} from '@/components/ui/drawer';
import type { VitrineMenu, VitrinesDoMenu } from '@/lib/data/maquinas/menu';
import { cn } from '@/lib/utils';
import logoBranco from '@/public/logo-branco.png';

import { ArrowRight, Factory, X } from 'lucide-react';

const SUAVE =
  'transition-[background-color,border-color,color] duration-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

const ABA = cn(
  'group/aba relative flex h-[52px] w-full flex-col items-center justify-center gap-[5px] rounded-xs border border-transparent text-xs leading-none font-medium whitespace-nowrap text-(--cel-texto-2) outline-none select-none [-webkit-tap-highlight-color:transparent]',
  'hover:border-dashed hover:border-(--cel-tracejado) hover:bg-(--cel-card) hover:text-white active:border-dashed active:border-(--cel-tracejado) active:bg-(--cel-card) active:text-white focus-visible:border-dashed focus-visible:border-(--cel-tracejado) focus-visible:bg-(--cel-card) focus-visible:text-white',
  'data-atual:text-white aria-expanded:border-solid aria-expanded:border-accent aria-expanded:bg-(--cel-card) aria-expanded:text-white',
  SUAVE
);

const ICONE_DA_ABA =
  'size-[22px] flex-none group-data-atual/aba:text-accent group-aria-expanded/aba:text-white';

const LINHA = cn(
  'group/linha flex min-h-12 w-full items-center gap-3 rounded-xs border border-dashed border-(--cel-tracejado-sutil) bg-(--cel-recuo) py-2 pr-2.5 pl-3 text-left text-base leading-[1.25] font-medium text-white outline-none [-webkit-tap-highlight-color:transparent]',
  'hover:border-(--cel-tracejado) hover:bg-(--cel-card) active:border-(--cel-tracejado) active:bg-(--cel-card) focus-visible:border-(--cel-tracejado) focus-visible:bg-(--cel-card)',
  'aria-pressed:border-solid aria-pressed:border-accent aria-pressed:bg-(--cel-card) aria-[current=page]:border-solid aria-[current=page]:border-accent',
  SUAVE
);

const ICONE_DA_LINHA =
  'size-5 flex-none text-(--cel-texto-2) group-aria-pressed/linha:text-accent group-aria-[current=page]/linha:text-accent';

const CONTA =
  'inline-grid h-6 min-w-7 flex-none place-items-center rounded-xs border border-(--cel-tracejado) bg-(--cel-recuo) px-1.5 font-mono text-[13px] leading-none font-medium text-(--cel-texto-2) tabular-nums';

const PE =
  'flex-none border-t border-dashed border-(--cel-tracejado) bg-(--cel-card) px-4 pt-3 pb-7';

const CANTO = 'pointer-events-none absolute size-2 border-accent';

const idFolha = (id: IdFolha) => `folha-celular-${id}`;

const FOLHAS = {
  maquinas: ABAS_DO_CELULAR[1],
  montar: ABAS_DO_CELULAR[2],
  menu: ABAS_DO_CELULAR[4]
} as const satisfies Record<IdFolha, AbaComFolha>;

function naBarra(evento: Event) {
  if (
    evento.target instanceof Element &&
    evento.target.closest('[data-barra-abas]')
  ) {
    evento.preventDefault();
  }
}

export default function NavbarMobile({
  vitrines
}: {
  vitrines: VitrinesDoMenu;
}) {
  const nav = useNavCelular();
  const atual = abaAtual(ABAS_DO_CELULAR, usePathname());
  const painel = useRef<HTMLDivElement>(null);
  const { folha } = nav;
  const aberta = folha.fase === 'aberta' ? folha.folha : null;
  const aba = folha.folha ? FOLHAS[folha.folha] : null;

  return (
    <>
      <FaixaDoLogo recolhida={nav.faixaRecolhida} />
      <nav
        aria-label='Principal'
        data-barra-abas
        className='nav-celular pointer-events-auto fixed inset-x-0 bottom-0 z-60 h-(--barra-celular) border-t border-dashed border-(--cel-tracejado) bg-secondary px-2 pb-[env(safe-area-inset-bottom)] max-[370px]:px-1 lg:hidden'>
        <ul className='m-0 grid h-[63px] list-none grid-cols-5 gap-2 p-0'>
          {ABAS_DO_CELULAR.map((a) => (
            <li key={a.id} className='flex min-w-0 items-center'>
              {a.tipo === 'link' ? (
                <AbaDeLink aba={a} atual={atual} aoTocar={nav.navegar} />
              ) : (
                <AbaDeFolha
                  aba={a}
                  atual={atual}
                  aberta={aberta === a.id}
                  aoTocar={nav.tocarAba}
                  refAba={nav.refAba(a.id)}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
      <Drawer
        open={aberta !== null}
        onOpenChange={(abrir) => {
          if (!abrir) nav.dispensar();
        }}
        closeThreshold={0.5}>
        <DrawerPortal>
          <DrawerOverlay
            data-veu-celular
            className='nav-celular z-50 bg-(--cel-veu) lg:hidden'
          />
          {aba && (
            <DrawerPainel
              key={aba.id}
              ref={painel}
              id={idFolha(aba.id)}
              data-folha-celular
              aria-describedby={undefined}
              onOpenAutoFocus={(evento) => {
                evento.preventDefault();
                painel.current?.focus({ preventScroll: true });
              }}
              onCloseAutoFocus={nav.aoDevolverFoco}
              onPointerDownOutside={naBarra}
              onFocusOutside={naBarra}
              className={cn(
                'nav-celular fixed inset-x-0 bottom-0 z-[55] flex max-h-[calc(100dvh-40px)] flex-col rounded-t-xs border-t border-dashed border-(--cel-tracejado) bg-(--cel-faixa) pb-(--barra-celular) outline-none lg:hidden',
                aba.altura === 'alta' && 'h-[calc(100dvh-40px)]'
              )}>
              <span
                aria-hidden
                className={cn(CANTO, '-top-px left-0 border-t border-l')}
              />
              <span
                aria-hidden
                className={cn(CANTO, '-top-px right-0 border-t border-r')}
              />
              <Cabecalho titulo={aba.titulo} />
              <ConteudoDaFolha aba={aba} vitrines={vitrines} />
            </DrawerPainel>
          )}
        </DrawerPortal>
      </Drawer>
    </>
  );
}

function FaixaDoLogo({ recolhida }: { recolhida: boolean }) {
  return (
    <header
      data-faixa-logo
      data-recolhida={recolhida || undefined}
      className='nav-celular fixed inset-x-0 top-0 z-40 flex h-[calc(var(--faixa-celular)+env(safe-area-inset-top))] items-center justify-center border-b border-dashed border-(--cel-tracejado-sutil) bg-secondary pt-[env(safe-area-inset-top)] transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-recolhida:-translate-y-full motion-reduce:transition-opacity motion-reduce:data-recolhida:pointer-events-none motion-reduce:data-recolhida:translate-y-0 motion-reduce:data-recolhida:opacity-0 lg:hidden'>
      <LinkDaArvore
        alvo={NAVEGACAO.marca}
        draggable={false}
        className={cn(
          'flex h-11 items-center rounded-xs border border-transparent px-3 outline-none select-none [-webkit-tap-highlight-color:transparent] hover:border-dashed hover:border-(--cel-tracejado) hover:bg-(--cel-card) active:border-dashed active:border-(--cel-tracejado) active:bg-(--cel-card) focus-visible:border-dashed focus-visible:border-(--cel-tracejado) focus-visible:bg-(--cel-card)',
          SUAVE
        )}>
        <Image
          src={logoBranco}
          alt='Profills, página inicial'
          draggable={false}
          priority
          sizes='144px'
          className='h-[22px] w-auto'
        />
      </LinkDaArvore>
    </header>
  );
}

function MarcaDaRota() {
  return (
    <span
      aria-hidden
      className='absolute -top-[7px] left-1/2 h-0.5 w-6 -translate-x-1/2 bg-accent'
    />
  );
}

function AbaDeLink({
  aba,
  atual,
  aoTocar
}: {
  aba: AbaLink;
  atual: IdAba | null;
  aoTocar: () => void;
}) {
  const ehAtual = atual === aba.id;

  return (
    <LinkDaArvore
      alvo={aba.destino}
      data-atual={ehAtual || undefined}
      onClick={aoTocar}
      className={ABA}>
      {ehAtual && <MarcaDaRota />}
      <aba.icone aria-hidden className={ICONE_DA_ABA} />
      <span>{aba.rotulo}</span>
    </LinkDaArvore>
  );
}

function AbaDeFolha({
  aba,
  atual,
  aberta,
  aoTocar,
  refAba
}: {
  aba: AbaComFolha;
  atual: IdAba | null;
  aberta: boolean;
  aoTocar: (folha: IdFolha) => void;
  refAba: (el: HTMLButtonElement | null) => void;
}) {
  const ehAtual = atual === aba.id;
  const montar = aba.id === 'montar';

  return (
    <button
      ref={refAba}
      type='button'
      aria-haspopup='dialog'
      aria-expanded={aberta}
      aria-controls={idFolha(aba.id)}
      aria-current={ehAtual ? 'page' : undefined}
      data-atual={ehAtual || undefined}
      onClick={() => aoTocar(aba.id)}
      className={cn(
        ABA,
        montar &&
          'justify-end pb-[5px] text-white hover:border-transparent hover:bg-transparent active:border-transparent active:bg-transparent focus-visible:border-transparent focus-visible:bg-transparent aria-expanded:border-transparent aria-expanded:bg-transparent'
      )}>
      {montar ? (
        <span
          aria-hidden
          className='absolute -top-5 left-1/2 grid size-[50px] -translate-x-1/2 place-items-center rounded-xs bg-accent text-white outline-4 outline-secondary transition-[background-color,translate] duration-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/aba:bg-[color-mix(in_oklch,var(--accent)_80%,var(--secondary))] group-focus-visible/aba:bg-[color-mix(in_oklch,var(--accent)_80%,var(--secondary))] group-active/aba:translate-y-px group-active/aba:bg-[color-mix(in_oklch,var(--accent)_80%,var(--secondary))] motion-reduce:transition-none'>
          <aba.icone className='size-[26px] stroke-2 transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-aria-expanded/aba:rotate-45 motion-reduce:transition-none' />
          {ehAtual && (
            <span className='absolute -bottom-3 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-accent' />
          )}
        </span>
      ) : (
        <>
          {ehAtual && <MarcaDaRota />}
          <aba.icone aria-hidden className={ICONE_DA_ABA} />
        </>
      )}
      <span>{aba.rotulo}</span>
    </button>
  );
}

function Cabecalho({ titulo }: { titulo: string }) {
  return (
    <div className='relative flex min-h-16 flex-none items-center gap-2 pt-4 pr-3 pb-1 pl-4 select-none'>
      <div className='absolute inset-x-0 top-[7px]'>
        <DrawerAlca className='h-1! w-10! rounded-xs! bg-(--cel-tracejado)! opacity-100!' />
      </div>
      <DrawerTitle className='min-w-0 flex-1 text-[19px] leading-[1.2] font-bold tracking-[-0.01em] text-white'>
        {titulo}
      </DrawerTitle>
      <DrawerClose
        aria-label='Fechar'
        className={cn(
          'grid size-11 flex-none place-items-center rounded-xs border border-dashed border-(--cel-tracejado) bg-(--cel-recuo) text-(--cel-texto-2) outline-none [-webkit-tap-highlight-color:transparent] hover:border-solid hover:border-accent hover:bg-(--cel-card) hover:text-white active:border-solid active:border-accent active:bg-(--cel-card) active:text-white focus-visible:border-solid focus-visible:border-accent focus-visible:bg-(--cel-card) focus-visible:text-white',
          SUAVE
        )}>
        <X aria-hidden className='size-5' />
      </DrawerClose>
    </div>
  );
}

function LinkDaFolha({
  alvo,
  className,
  children,
  ...resto
}: {
  alvo: Destino;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}) {
  return (
    <DrawerClose asChild>
      <LinkDaArvore alvo={alvo} className={className} {...resto}>
        {children}
      </LinkDaArvore>
    </DrawerClose>
  );
}

function ConteudoDaFolha({
  aba,
  vitrines
}: {
  aba: AbaComFolha;
  vitrines: VitrinesDoMenu;
}) {
  const { conteudo } = aba;

  switch (conteudo.forma) {
    case 'montar':
      return <CorpoMontar monte={conteudo.monte} />;
    case 'maquinas':
      return <CorpoMaquinas menu={conteudo.menu} vitrines={vitrines} />;
    case 'menu':
      return <CorpoMenu menus={conteudo.menus} pe={conteudo.pe} />;
  }
}

function CorpoMontar({
  monte
}: {
  monte: AbaFolha<'montar'>['conteudo']['monte'];
}) {
  return (
    <div className='grid grid-cols-2 gap-3 px-4 pt-1 pb-[30px] max-[370px]:gap-2'>
      {monte.map((no) => (
        <LinkDaFolha
          key={no.id}
          alvo={no}
          className={cn(
            'relative flex min-h-[132px] flex-col justify-between gap-5 rounded-xs border border-white bg-white p-4 text-[17px] leading-[1.2] font-bold tracking-[-0.01em] text-foreground outline-none [-webkit-tap-highlight-color:transparent] hover:bg-[color-mix(in_oklch,white_86%,var(--accent))] focus-visible:bg-[color-mix(in_oklch,white_86%,var(--accent))] active:translate-y-px active:bg-[color-mix(in_oklch,white_86%,var(--accent))] aria-[current=page]:border-accent max-[370px]:p-3.5 max-[370px]:text-base',
            'transition-[background-color,translate] duration-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
          )}>
          <no.icone aria-hidden className='size-[30px] text-accent' />
          <span>{no.rotulo}</span>
          <span
            aria-hidden
            className={cn(CANTO, '-right-px -bottom-px border-r border-b')}
          />
        </LinkDaFolha>
      ))}
    </div>
  );
}

const contagem = (total: number) =>
  total === 1 ? '1 máquina' : `${total} máquinas`;

function CorpoMaquinas({
  menu,
  vitrines
}: {
  menu: AbaFolha<'maquinas'>['conteudo']['menu'];
  vitrines: VitrinesDoMenu;
}) {
  const { folhas } = menu.painel;
  const [indice, setIndice] = useState(0);
  const [pintada, setPintada] = useState<VitrineMenu | null>(null);
  const escolhida = folhas[indice];

  if (!escolhida) return null;

  const { vitrine, total } = vitrines[escolhida.vitrine];
  const visivel = vitrine && (pintada ?? vitrine);

  const imagens =
    visivel && vitrine && visivel.slug !== vitrine.slug
      ? [visivel, vitrine]
      : visivel
        ? [visivel]
        : [];

  return (
    <>
      <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-1 pb-4'>
        <ul className='m-0 grid list-none gap-2 p-0'>
          {folhas.map((f, i) => (
            <li
              key={f.id}
              className={cn(
                i === 0 &&
                  'border-b border-dashed border-(--cel-tracejado-sutil) pb-2'
              )}>
              <button
                type='button'
                aria-pressed={i === indice}
                aria-label={`${f.rotulo}, ${contagem(vitrines[f.vitrine].total)}`}
                onClick={() => {
                  setIndice(i);

                  if (!vitrines[f.vitrine].vitrine) setPintada(null);
                }}
                className={LINHA}>
                <f.icone aria-hidden className={ICONE_DA_LINHA} />
                <span className='min-w-0 flex-1'>{f.rotulo}</span>
                <span className={CONTA}>{vitrines[f.vitrine].total}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={cn(
          PE,
          'grid grid-cols-[104px_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5 max-[370px]:grid-cols-[92px_minmax(0,1fr)]'
        )}>
        <div className='relative grid h-[76px] place-items-center rounded-xs border border-dashed border-(--cel-tracejado) bg-(--cel-recuo)'>
          <span
            aria-hidden
            className={cn(CANTO, '-top-px -left-px border-t border-l')}
          />
          <span
            aria-hidden
            className={cn(CANTO, '-right-px -bottom-px border-r border-b')}
          />
          {visivel ? (
            imagens.map((v) => (
              <Image
                key={v.slug}
                src={v.imagem}
                alt=''
                aria-hidden={v !== visivel || undefined}
                sizes='104px'
                onLoad={(evento) => {
                  const img = evento.currentTarget;

                  const pintar = () => {
                    if (img.isConnected) setPintada(v);
                  };

                  img.decode().then(pintar, pintar);
                }}
                className={cn(
                  'size-full object-contain p-1',
                  v !== visivel && 'absolute inset-0 opacity-0'
                )}
              />
            ))
          ) : (
            <Factory aria-hidden className='size-7 text-(--cel-texto-2)' />
          )}
        </div>
        <div className='min-w-0'>
          <strong className='line-clamp-2 text-base leading-[1.25] font-semibold text-white'>
            {vitrine ? vitrine.nome : escolhida.rotulo}
          </strong>
          <span className='mt-[3px] block text-sm leading-[1.35] text-(--cel-texto-2)'>
            {vitrine ? vitrine.subtitulo : contagem(total)}
          </span>
        </div>
        <LinkDaFolha
          alvo={escolhida}
          aria-label={
            escolhida.vitrine === 'todas'
              ? `Ver todas as ${total} máquinas`
              : `Ver as máquinas de ${escolhida.rotulo}`
          }
          className={cn(
            'col-span-full flex h-12 items-center justify-center gap-2 rounded-xs bg-accent text-base leading-none font-semibold text-white outline-none [-webkit-tap-highlight-color:transparent] hover:bg-[color-mix(in_oklch,var(--accent)_80%,var(--secondary))] focus-visible:bg-[color-mix(in_oklch,var(--accent)_80%,var(--secondary))] active:bg-[color-mix(in_oklch,var(--accent)_80%,var(--secondary))]',
            SUAVE
          )}>
          {rotuloVer(escolhida.vitrine, total)}
          <ArrowRight aria-hidden className='size-[18px]' />
        </LinkDaFolha>
      </div>
    </>
  );
}

function CorpoMenu({
  menus,
  pe
}: Pick<AbaFolha<'menu'>['conteudo'], 'menus' | 'pe'>) {
  return (
    <>
      <div className='min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-4 pt-1 pb-4'>
        {menus.map((menu) => (
          <SecaoDoMenu key={menu.id} menu={menu} />
        ))}
      </div>
      <div className={cn(PE, 'grid grid-cols-2 gap-2')}>
        {pe.map((link) => (
          <LinkDaFolha
            key={link.id}
            alvo={link}
            className={cn(
              'flex h-12 items-center justify-center gap-2 rounded-xs border border-dashed border-(--cel-tracejado) bg-(--cel-recuo) text-base leading-none font-semibold text-white outline-none [-webkit-tap-highlight-color:transparent] hover:border-solid hover:border-accent hover:bg-(--cel-faixa) active:border-solid active:border-accent active:bg-(--cel-faixa) focus-visible:border-solid focus-visible:border-accent focus-visible:bg-(--cel-faixa) aria-[current=page]:border-solid aria-[current=page]:border-accent',
              SUAVE
            )}>
            <link.icone aria-hidden className='size-[18px] text-accent' />
            {link.rotulo}
          </LinkDaFolha>
        ))}
      </div>
    </>
  );
}

function NomeDoProjeto({ rotulo }: { rotulo: string }) {
  const [prefixo, ...resto] = rotulo.split(' ');

  if (prefixo !== 'Profills' || resto.length === 0)
    return <span>{rotulo}</span>;

  return (
    <span>
      <span className='font-normal text-(--cel-texto-2)'>Profills</span>{' '}
      {resto.join(' ')}
    </span>
  );
}

function SecaoDoMenu({ menu }: { menu: NoMenu }) {
  const idTitulo = `secao-celular-${menu.id}`;

  return (
    <section aria-labelledby={idTitulo}>
      <h3
        id={idTitulo}
        className='mt-2 mb-3 flex items-center gap-2 text-base leading-[1.2] font-semibold text-white'>
        {menu.rotulo}
        <span aria-hidden className={CONTA}>
          {menu.painel.folhas.length}
        </span>
      </h3>
      <ListaDoPainel painel={menu.painel} />
    </section>
  );
}

function ListaDoPainel({ painel }: { painel: NoMenu['painel'] }) {
  switch (painel.forma) {
    case 'fotos':
      return (
        <ul className='m-0 grid list-none grid-cols-2 gap-2 p-0'>
          {painel.folhas.map((folha) => (
            <li key={folha.id} className='flex'>
              <LinkDaFolha
                alvo={folha}
                className={cn(
                  'flex w-full flex-col overflow-hidden rounded-xs border border-dashed border-(--cel-tracejado-sutil) bg-(--cel-recuo) text-white outline-none [-webkit-tap-highlight-color:transparent] hover:border-(--cel-tracejado) hover:bg-(--cel-card) active:border-(--cel-tracejado) active:bg-(--cel-card) focus-visible:border-(--cel-tracejado) focus-visible:bg-(--cel-card) aria-[current=page]:border-solid aria-[current=page]:border-accent',
                  SUAVE
                )}>
                <Image
                  src={folha.foto}
                  alt={folha.altFoto}
                  sizes='(min-width: 640px) 300px, 45vw'
                  className='aspect-[3/2] w-full object-cover'
                />
                <span className='px-3 pt-2.5 pb-3 text-base leading-[1.25] font-medium'>
                  {folha.rotulo}
                </span>
              </LinkDaFolha>
            </li>
          ))}
        </ul>
      );
    case 'cartoes':
    case 'vitrine':
      return (
        <ul className='m-0 grid list-none gap-2 p-0'>
          {painel.folhas.map((folha) => (
            <li key={folha.id}>
              <LinkDaFolha alvo={folha} className={LINHA}>
                <folha.icone aria-hidden className={ICONE_DA_LINHA} />
                <NomeDoProjeto rotulo={folha.rotulo} />
              </LinkDaFolha>
            </li>
          ))}
        </ul>
      );
  }
}
