'use client';

import {
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';

import { usePathname } from 'next/navigation';

import type { IdMenu } from '@/components/layout/navegacao';

import { flushSync } from 'react-dom';

export const ABRE_MS = 80;
export const FECHA_MS = 150;

/** O clique que chega logo depois de o hover abrir é o mesmo gesto: não fecha. */
export const CLIQUE_IGNORA_MS = 350;

export type EstadoPlaca =
  | { readonly fase: 'fechada'; readonly devolverFocoA: IdMenu | null }
  | { readonly fase: 'armando'; readonly alvo: IdMenu }
  | {
      readonly fase: 'aberta' | 'fechando';
      readonly menu: IdMenu;
      readonly anterior: IdMenu | null;
      readonly abertaEm: number;
    };

export type EventoPlaca =
  | { readonly tipo: 'ponteiro-entrou'; readonly menu: IdMenu }
  | { readonly tipo: 'ponteiro-entrou-gaveta' }
  | { readonly tipo: 'ponteiro-saiu' }
  | { readonly tipo: 'clique'; readonly menu: IdMenu; readonly agora: number }
  | {
      readonly tipo: 'teclado-abriu';
      readonly menu: IdMenu;
      readonly agora: number;
    }
  | { readonly tipo: 'esc' }
  | { readonly tipo: 'fora' }
  | { readonly tipo: 'navegou' }
  | { readonly tipo: 'venceu-abre'; readonly agora: number }
  | { readonly tipo: 'venceu-fecha' };

export const PLACA_INICIAL: EstadoPlaca = {
  fase: 'fechada',
  devolverFocoA: null
};

export function menuVisivel(estado: EstadoPlaca): IdMenu | null {
  return estado.fase === 'aberta' || estado.fase === 'fechando'
    ? estado.menu
    : null;
}

function abrir(estado: EstadoPlaca, menu: IdMenu, agora: number): EstadoPlaca {
  const visivel = menuVisivel(estado);

  if (visivel === null) {
    return { fase: 'aberta', menu, anterior: null, abertaEm: agora };
  }

  if (estado.fase !== 'aberta' && estado.fase !== 'fechando') return estado;

  return visivel === menu
    ? { ...estado, fase: 'aberta' }
    : { fase: 'aberta', menu, anterior: visivel, abertaEm: agora };
}

/**
 * Transição pura. Timer atrasado ou repetido devolve o mesmo estado:
 * venceu-abre só age em armando e venceu-fecha só em fechando.
 */
export function reduzirPlaca(
  estado: EstadoPlaca,
  evento: EventoPlaca
): EstadoPlaca {
  switch (evento.tipo) {
    case 'ponteiro-entrou': {
      if (estado.fase === 'fechada' || estado.fase === 'armando') {
        return estado.fase === 'armando' && estado.alvo === evento.menu
          ? estado
          : { fase: 'armando', alvo: evento.menu };
      }

      return estado.menu === evento.menu && estado.fase === 'aberta'
        ? estado
        : abrir(estado, evento.menu, estado.abertaEm);
    }

    case 'ponteiro-entrou-gaveta':
      return estado.fase === 'fechando'
        ? { ...estado, fase: 'aberta' }
        : estado;

    case 'ponteiro-saiu':
      if (estado.fase === 'armando') return PLACA_INICIAL;

      return estado.fase === 'aberta'
        ? { ...estado, fase: 'fechando' }
        : estado;

    case 'clique': {
      const visivel = menuVisivel(estado);

      if (
        visivel === evento.menu &&
        (estado.fase === 'aberta' || estado.fase === 'fechando') &&
        evento.agora - estado.abertaEm > CLIQUE_IGNORA_MS
      ) {
        return PLACA_INICIAL;
      }

      return abrir(estado, evento.menu, evento.agora);
    }

    case 'teclado-abriu':
      return abrir(estado, evento.menu, evento.agora);

    case 'esc': {
      const visivel = menuVisivel(estado);

      return visivel === null
        ? estado
        : { fase: 'fechada', devolverFocoA: visivel };
    }

    case 'fora':
    case 'navegou':
      return estado.fase === 'fechada' && estado.devolverFocoA === null
        ? estado
        : PLACA_INICIAL;

    case 'venceu-abre':
      return estado.fase === 'armando'
        ? abrir(PLACA_INICIAL, estado.alvo, evento.agora)
        : estado;

    case 'venceu-fecha':
      return estado.fase === 'fechando' ? PLACA_INICIAL : estado;
  }
}

/** -1, 0 ou 1: o lado de onde o conteúdo novo entra na gaveta. */
export function sentidoDaTroca(
  estado: EstadoPlaca,
  ordem: readonly IdMenu[]
): -1 | 0 | 1 {
  if (estado.fase !== 'aberta' && estado.fase !== 'fechando') return 0;

  if (estado.anterior === null) return 0;

  const passo = ordem.indexOf(estado.menu) - ordem.indexOf(estado.anterior);

  if (passo > 0) return 1;

  return passo < 0 ? -1 : 0;
}

export interface Placa {
  readonly aberto: IdMenu | null;
  /** Menu que abriu ou está para abrir: a gaveta só carrega as imagens dele. */
  readonly prestes: IdMenu | null;
  readonly sentido: -1 | 0 | 1;
  /** Envolve a placa e a gaveta: clique e foco fora dela fecham. */
  readonly raiz: RefObject<HTMLDivElement | null>;
  gatilho(menu: IdMenu): {
    id: string;
    'aria-expanded': boolean;
    'aria-controls': string;
    onPointerEnter: (e: PointerEvent) => void;
    onPointerLeave: (e: PointerEvent) => void;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
    ref: (el: HTMLButtonElement | null) => void;
  };
  readonly gaveta: {
    ref: RefObject<HTMLDivElement | null>;
    onPointerEnter: (e: PointerEvent) => void;
    onPointerLeave: (e: PointerEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  idPainel(menu: IdMenu): string;
}

const idPainel = (menu: IdMenu) => `placa-painel-${menu}`;
const idGatilho = (menu: IdMenu) => `placa-gatilho-${menu}`;

function linksDoPainel(menu: IdMenu): HTMLAnchorElement[] {
  return [
    ...(document
      .getElementById(idPainel(menu))
      ?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? [])
  ];
}

/**
 * Liga o reducer ao relógio (um timer por fase com prazo) e ao documento
 * (Esc, clique e foco fora, troca de rota). Toque não tem hover: só o clique.
 */
export function usePlaca(ordem: readonly IdMenu[]): Placa {
  const [estado, despachar] = useReducer(reduzirPlaca, PLACA_INICIAL);
  const raiz = useRef<HTMLDivElement | null>(null);
  const gaveta = useRef<HTMLDivElement | null>(null);
  const gatilhos = useRef(new Map<IdMenu, HTMLButtonElement>());
  const pathname = usePathname();
  const aberto = menuVisivel(estado);

  useEffect(() => {
    if (estado.fase === 'armando') {
      const t = setTimeout(
        () => despachar({ tipo: 'venceu-abre', agora: performance.now() }),
        ABRE_MS
      );

      return () => clearTimeout(t);
    }

    if (estado.fase === 'fechando') {
      const t = setTimeout(() => despachar({ tipo: 'venceu-fecha' }), FECHA_MS);

      return () => clearTimeout(t);
    }

    if (estado.fase === 'fechada' && estado.devolverFocoA) {
      gatilhos.current.get(estado.devolverFocoA)?.focus();
    }
  }, [estado]);

  useEffect(() => {
    despachar({ tipo: 'navegou' });
  }, [pathname]);

  useEffect(() => {
    if (aberto === null) return;

    const aoTeclar = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      e.preventDefault();
      despachar({ tipo: 'esc' });
    };

    const aoApontar = (e: globalThis.PointerEvent) => {
      if (e.target instanceof Node && !raiz.current?.contains(e.target)) {
        despachar({ tipo: 'fora' });
      }
    };

    const aoFocar = (e: FocusEvent) => {
      const alvo = e.target;

      if (
        alvo instanceof Node &&
        !gaveta.current?.contains(alvo) &&
        alvo !== gatilhos.current.get(aberto)
      ) {
        despachar({ tipo: 'fora' });
      }
    };

    document.addEventListener('keydown', aoTeclar);
    document.addEventListener('pointerdown', aoApontar);
    document.addEventListener('focusin', aoFocar);

    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.removeEventListener('pointerdown', aoApontar);
      document.removeEventListener('focusin', aoFocar);
    };
  }, [aberto]);

  const gatilho = useCallback(
    (menu: IdMenu) => ({
      id: idGatilho(menu),
      'aria-expanded': aberto === menu,
      'aria-controls': idPainel(menu),
      onPointerEnter: (e: PointerEvent) => {
        if (e.pointerType !== 'touch') {
          despachar({ tipo: 'ponteiro-entrou', menu });
        }
      },
      onPointerLeave: (e: PointerEvent) => {
        if (e.pointerType !== 'touch') despachar({ tipo: 'ponteiro-saiu' });
      },
      onClick: () =>
        despachar({ tipo: 'clique', menu, agora: performance.now() }),
      onKeyDown: (e: KeyboardEvent) => {
        const entrarNoPainel =
          e.key === 'ArrowDown' ||
          (e.key === 'Tab' && !e.shiftKey && aberto === menu);

        if (!entrarNoPainel) return;

        e.preventDefault();
        flushSync(() =>
          despachar({ tipo: 'teclado-abriu', menu, agora: performance.now() })
        );
        linksDoPainel(menu)[0]?.focus();
      },
      ref: (el: HTMLButtonElement | null) => {
        if (el) gatilhos.current.set(menu, el);
        else gatilhos.current.delete(menu);
      }
    }),
    [aberto]
  );

  const aoTeclarNaGaveta = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || aberto === null) return;

    const links = linksDoPainel(aberto);
    const dono = gatilhos.current.get(aberto);

    if (e.shiftKey && document.activeElement === links[0]) {
      e.preventDefault();
      dono?.focus();

      return;
    }

    if (!e.shiftKey && document.activeElement === links.at(-1)) {
      e.preventDefault();

      const focaveis = [
        ...(dono?.closest('nav')?.querySelectorAll<HTMLElement>('a, button') ??
          [])
      ];

      const proximo = dono ? focaveis[focaveis.indexOf(dono) + 1] : undefined;

      despachar({ tipo: 'fora' });
      proximo?.focus();
    }
  };

  return {
    aberto,
    prestes: estado.fase === 'armando' ? estado.alvo : aberto,
    sentido: sentidoDaTroca(estado, ordem),
    raiz,
    gatilho,
    gaveta: {
      ref: gaveta,
      onPointerEnter: (e) => {
        if (e.pointerType !== 'touch') {
          despachar({ tipo: 'ponteiro-entrou-gaveta' });
        }
      },
      onPointerLeave: (e) => {
        if (e.pointerType !== 'touch') despachar({ tipo: 'ponteiro-saiu' });
      },
      onKeyDown: aoTeclarNaGaveta
    },
    idPainel
  };
}

/** true depois de `limiar` px de rolagem. */
export function useRolouAlem(limiar: number): boolean {
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    let quadro = 0;

    const medir = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => setRolou(window.scrollY > limiar));
    };

    medir();
    window.addEventListener('scroll', medir, { passive: true });

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener('scroll', medir);
    };
  }, [limiar]);

  return rolou;
}
