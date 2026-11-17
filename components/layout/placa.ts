'use client';

import {
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState
} from 'react';

import { usePathname } from 'next/navigation';

import type { IdMenu } from '@/components/layout/navegacao';

import { flushSync } from 'react-dom';

/**
 * Intenção de hover: o menu abre, ou troca com a gaveta aberta, quando o
 * ponteiro fica REPOUSO_MS dentro de um raio de REPOUSO_PX sobre o gatilho.
 * Quem cruza um gatilho a caminho de outro lugar não repousa nele.
 */
export const REPOUSO_MS = 90;
export const REPOUSO_PX = 6;
export const FECHA_MS = 150;

/** O clique que chega logo depois de o hover abrir é o mesmo gesto: não fecha. */
export const CLIQUE_IGNORA_MS = 350;

/** A placa compacta acima de ENTRA_COMPACTA_PX e só volta em SAI_COMPACTA_PX ou menos. */
export const ENTRA_COMPACTA_PX = 24;
export const SAI_COMPACTA_PX = 4;

interface Ponto {
  readonly x: number;
  readonly y: number;
}

/** Onde e desde quando o ponteiro está parado sobre um gatilho. */
export interface Repouso {
  readonly menu: IdMenu;
  readonly x: number;
  readonly y: number;
  readonly desde: number;
}

interface GavetaAberta {
  readonly menu: IdMenu;
  readonly anterior: IdMenu | null;
  readonly abertaEm: number;
}

export type EstadoPlaca =
  | {
      readonly fase: 'fechada';
      readonly devolverFocoA: IdMenu | null;
      /**
       * Fechado por clique ou Esc com o ponteiro talvez em cima: o hover só
       * volta a armar esse menu depois de o ponteiro sair do gatilho.
       */
      readonly dispensado: IdMenu | null;
    }
  | { readonly fase: 'armando'; readonly repouso: Repouso }
  | (GavetaAberta & {
      readonly fase: 'aberta';
      /** Outro gatilho sob o ponteiro: vira o menu aberto se o ponteiro repousar nele. */
      readonly candidato: Repouso | null;
    })
  | (GavetaAberta & { readonly fase: 'fechando' });

/**
 * Eventos do ponteiro na zona da navbar (placa, ponte e gaveta). `real` é
 * falso quando o evento repete as coordenadas do último pointermove: veio de
 * layout, não da mão, e não arma nem reinicia repouso ou candidato.
 */
export type EventoPlaca =
  | {
      readonly tipo: 'ponteiro-entrou' | 'ponteiro-moveu';
      readonly menu: IdMenu;
      readonly x: number;
      readonly y: number;
      readonly agora: number;
      readonly real: boolean;
    }
  | { readonly tipo: 'ponteiro-fora-de-gatilho'; readonly real: boolean }
  | { readonly tipo: 'ponteiro-entrou-na-zona' }
  | { readonly tipo: 'ponteiro-saiu-da-zona' }
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
  devolverFocoA: null,
  dispensado: null
};

export function menuVisivel(estado: EstadoPlaca): IdMenu | null {
  return estado.fase === 'aberta' || estado.fase === 'fechando'
    ? estado.menu
    : null;
}

function abrir(estado: EstadoPlaca, menu: IdMenu, agora: number): EstadoPlaca {
  if (estado.fase !== 'aberta' && estado.fase !== 'fechando') {
    return {
      fase: 'aberta',
      menu,
      anterior: null,
      abertaEm: agora,
      candidato: null
    };
  }

  return estado.menu === menu
    ? {
        fase: 'aberta',
        menu,
        anterior: estado.anterior,
        abertaEm: estado.abertaEm,
        candidato: null
      }
    : {
        fase: 'aberta',
        menu,
        anterior: estado.menu,
        abertaEm: agora,
        candidato: null
      };
}

/** O mesmo repouso enquanto o ponteiro não sai do raio; senão, a espera recomeça. */
function seguirRepouso(
  atual: Repouso | null,
  { menu, x, y, agora }: { menu: IdMenu; x: number; y: number; agora: number }
): Repouso {
  return atual?.menu === menu &&
    Math.hypot(x - atual.x, y - atual.y) <= REPOUSO_PX
    ? atual
    : { menu, x, y, desde: agora };
}

/** O repouso que o relógio espera vencer, se houver. */
export function repousoPendente(estado: EstadoPlaca): Repouso | null {
  if (estado.fase === 'armando') return estado.repouso;

  return estado.fase === 'aberta' ? estado.candidato : null;
}

/**
 * Transição pura. Timer atrasado ou repetido devolve o mesmo estado:
 * venceu-abre só age num repouso que já durou REPOUSO_MS e venceu-fecha
 * só em fechando.
 */
export function reduzirPlaca(
  estado: EstadoPlaca,
  evento: EventoPlaca
): EstadoPlaca {
  switch (evento.tipo) {
    case 'ponteiro-entrou':
    case 'ponteiro-moveu': {
      if (!evento.real) return estado;

      if (
        estado.fase === 'fechada' &&
        evento.tipo === 'ponteiro-moveu' &&
        estado.dispensado === evento.menu
      ) {
        return estado;
      }

      if (estado.fase === 'fechada' || estado.fase === 'armando') {
        const atual = estado.fase === 'armando' ? estado.repouso : null;
        const repouso = seguirRepouso(atual, evento);

        return repouso === atual ? estado : { fase: 'armando', repouso };
      }

      if (estado.menu === evento.menu) {
        return estado.fase === 'aberta' && estado.candidato === null
          ? estado
          : abrir(estado, evento.menu, evento.agora);
      }

      const atual = estado.fase === 'aberta' ? estado.candidato : null;
      const candidato = seguirRepouso(atual, evento);

      return candidato === atual
        ? estado
        : {
            fase: 'aberta',
            menu: estado.menu,
            anterior: estado.anterior,
            abertaEm: estado.abertaEm,
            candidato
          };
    }

    case 'ponteiro-fora-de-gatilho':
      if (!evento.real) return estado;

      if (
        estado.fase === 'armando' ||
        (estado.fase === 'fechada' && estado.dispensado !== null)
      ) {
        return PLACA_INICIAL;
      }

      return estado.fase === 'aberta' && estado.candidato !== null
        ? { ...estado, candidato: null }
        : estado;

    case 'ponteiro-entrou-na-zona':
      return estado.fase === 'fechando'
        ? { ...estado, fase: 'aberta', candidato: null }
        : estado;

    case 'ponteiro-saiu-da-zona':
      if (
        estado.fase === 'armando' ||
        (estado.fase === 'fechada' && estado.dispensado !== null)
      ) {
        return PLACA_INICIAL;
      }

      return estado.fase === 'aberta'
        ? {
            fase: 'fechando',
            menu: estado.menu,
            anterior: estado.anterior,
            abertaEm: estado.abertaEm
          }
        : estado;

    case 'clique': {
      const visivel = menuVisivel(estado);

      if (
        visivel === evento.menu &&
        (estado.fase === 'aberta' || estado.fase === 'fechando') &&
        evento.agora - estado.abertaEm > CLIQUE_IGNORA_MS
      ) {
        return {
          fase: 'fechada',
          devolverFocoA: null,
          dispensado: evento.menu
        };
      }

      return abrir(estado, evento.menu, evento.agora);
    }

    case 'teclado-abriu':
      return abrir(estado, evento.menu, evento.agora);

    case 'esc': {
      const visivel = menuVisivel(estado);

      return visivel === null
        ? estado
        : { fase: 'fechada', devolverFocoA: visivel, dispensado: visivel };
    }

    case 'fora':
    case 'navegou':
      return estado.fase === 'fechada' &&
        estado.devolverFocoA === null &&
        estado.dispensado === null
        ? estado
        : PLACA_INICIAL;

    case 'venceu-abre': {
      const repouso = repousoPendente(estado);

      return repouso && evento.agora - repouso.desde >= REPOUSO_MS
        ? abrir(estado, repouso.menu, evento.agora)
        : estado;
    }

    case 'venceu-fecha':
      return estado.fase === 'fechando' ? PLACA_INICIAL : estado;
  }
}

export function ehMovimentoReal(
  ultimo: Ponto | null,
  x: number,
  y: number
): boolean {
  return ultimo === null || ultimo.x !== x || ultimo.y !== y;
}

export function proximaCompacta(atual: boolean, scrollY: number): boolean {
  return scrollY > (atual ? SAI_COMPACTA_PX : ENTRA_COMPACTA_PX);
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
  /** Ponteiro na zona ou menu aberto: a geometria da placa não pode mudar. */
  readonly travada: boolean;
  /**
   * A zona do ponteiro: placa, ponte e gaveta. Clique e foco fora dela
   * fecham, e sair dela é o único jeito de o ponteiro fechar a gaveta.
   */
  readonly raiz: RefObject<HTMLDivElement | null>;
  /** Vai no elemento que é a área de hit do gatilho. */
  alvo(menu: IdMenu): { 'data-menu': IdMenu };
  gatilho(menu: IdMenu): {
    id: string;
    'aria-expanded': boolean;
    'aria-controls': string;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
    ref: (el: HTMLButtonElement | null) => void;
  };
  /** A gaveta: o hook liga nela o Tab que sai pelo fim. */
  readonly gaveta: RefObject<HTMLDivElement | null>;
}

export const idPainel = (menu: IdMenu) => `placa-painel-${menu}`;
export const idGatilho = (menu: IdMenu) => `placa-gatilho-${menu}`;

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
  const [naZona, setNaZona] = useState(false);
  const raiz = useRef<HTMLDivElement | null>(null);
  const gaveta = useRef<HTMLDivElement | null>(null);
  const gatilhos = useRef(new Map<IdMenu, HTMLButtonElement>());
  const pathname = usePathname();
  const aberto = menuVisivel(estado);

  useEffect(() => {
    const zona = raiz.current;

    if (!zona) return;

    let ultimo: Ponto | null = null;
    let sob: IdMenu | null = null;

    // No documento, e não na zona, para saber onde o ponteiro parou também
    // fora dela: a zona que cresce sob um ponteiro parado não é movimento.
    const aoMover = (e: globalThis.PointerEvent) => {
      if (e.pointerType === 'touch') return;

      const real = ehMovimentoReal(ultimo, e.clientX, e.clientY);

      ultimo = { x: e.clientX, y: e.clientY };

      if (!(e.target instanceof Element) || !zona.contains(e.target)) return;

      const id = e.target.closest<HTMLElement>('[data-menu]')?.dataset.menu;
      const menu = ordem.find((m) => m === id) ?? null;

      if (menu === null) {
        if (real) sob = null;
        despachar({ tipo: 'ponteiro-fora-de-gatilho', real });

        return;
      }

      const tipo = menu === sob ? 'ponteiro-moveu' : 'ponteiro-entrou';

      if (real) sob = menu;
      despachar({
        tipo,
        menu,
        x: e.clientX,
        y: e.clientY,
        agora: performance.now(),
        real
      });
    };

    const aoEntrar = (e: globalThis.PointerEvent) => {
      if (e.pointerType === 'touch') return;

      setNaZona(true);
      despachar({ tipo: 'ponteiro-entrou-na-zona' });
    };

    const aoSair = (e: globalThis.PointerEvent) => {
      if (e.pointerType === 'touch') return;

      sob = null;
      setNaZona(false);
      despachar({ tipo: 'ponteiro-saiu-da-zona' });
    };

    document.addEventListener('pointermove', aoMover, { passive: true });
    zona.addEventListener('pointerenter', aoEntrar);
    zona.addEventListener('pointerleave', aoSair);

    return () => {
      document.removeEventListener('pointermove', aoMover);
      zona.removeEventListener('pointerenter', aoEntrar);
      zona.removeEventListener('pointerleave', aoSair);
    };
  }, [ordem]);

  useEffect(() => {
    const repouso = repousoPendente(estado);

    if (repouso) {
      // O evento leva o prazo, não a hora do disparo: o setTimeout trunca o
      // atraso fracionário e pode disparar uma fração de ms antes dele.
      const prazo = repouso.desde + REPOUSO_MS;

      const t = setTimeout(
        () => despachar({ tipo: 'venceu-abre', agora: prazo }),
        Math.max(0, prazo - performance.now())
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
        ![...gatilhos.current.values()].some((g) => g === alvo)
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

  useEffect(() => {
    const el = gaveta.current;

    if (!el) return;

    const aoTeclar = (e: globalThis.KeyboardEvent) => {
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
          ...(dono
            ?.closest('nav')
            ?.querySelectorAll<HTMLElement>('a, button') ?? [])
        ];

        const proximo = dono ? focaveis[focaveis.indexOf(dono) + 1] : undefined;

        despachar({ tipo: 'fora' });
        proximo?.focus();
      }
    };

    el.addEventListener('keydown', aoTeclar);

    return () => el.removeEventListener('keydown', aoTeclar);
  }, [aberto]);

  return {
    aberto,
    prestes: estado.fase === 'armando' ? estado.repouso.menu : aberto,
    sentido: sentidoDaTroca(estado, ordem),
    travada: naZona || aberto !== null,
    raiz,
    alvo: (menu: IdMenu) => ({ 'data-menu': menu }),
    gatilho,
    gaveta
  };
}

/**
 * `compacta` só muda com a placa destravada: enquanto `travada` vale, a
 * rolagem não é lida, e a mudança pendente entra quando ela solta.
 * `animar`: falso do HTML do servidor até dois quadros depois da hidratação,
 * para quem recarrega já rolado ver a placa compacta sem a animação de encolher.
 */
export function useCompacta(travada: boolean) {
  const [compacta, setCompacta] = useState(false);
  const [animar, setAnimar] = useState(false);

  useLayoutEffect(() => {
    if (travada) return;

    const seguir = () => {
      const y = window.scrollY;

      setCompacta((atual) => proximaCompacta(atual, y));
    };

    seguir();
    window.addEventListener('scroll', seguir, { passive: true });

    return () => window.removeEventListener('scroll', seguir);
  }, [travada]);

  useEffect(() => {
    let quadro = requestAnimationFrame(() => {
      quadro = requestAnimationFrame(() => setAnimar(true));
    });

    return () => cancelAnimationFrame(quadro);
  }, []);

  return { compacta, animar };
}
