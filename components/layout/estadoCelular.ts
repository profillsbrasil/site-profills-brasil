'use client';

import {
  type RefCallback,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';

import { usePathname } from 'next/navigation';

import type { IdFolha } from '@/components/layout/abasCelular';

/**
 * Uma folha por vez, por construção. Fechada, `folha` é a última que abriu:
 * ela segue montada na saída do vaul e é a aba que recebe o foco de volta.
 */
export type EstadoFolha =
  | {
      readonly fase: 'fechada';
      readonly folha: IdFolha | null;
      readonly focoNaAba: boolean;
    }
  | { readonly fase: 'aberta'; readonly folha: IdFolha };

export type EventoFolha =
  | { readonly tipo: 'tocou-aba'; readonly folha: IdFolha }
  | {
      /** Esc, véu, arraste, Fechar ou link da folha: tudo chega pelo onOpenChange(false) do vaul. */
      readonly tipo: 'dispensou';
    }
  | {
      /** O pathname mudou por fora, como no voltar do navegador: fecha sem roubar o foco. */
      readonly tipo: 'navegou';
    }
  | {
      /** A largura passou do lg (tablet girado): a folha some por lg:hidden e o modal não pode ficar. */
      readonly tipo: 'saiu-do-celular';
    };

export const FOLHA_INICIAL: EstadoFolha = {
  fase: 'fechada',
  folha: null,
  focoNaAba: false
};

export function transicaoFolha(estado: EstadoFolha, evento: EventoFolha) {
  switch (evento.tipo) {
    case 'tocou-aba':
      if (estado.fase === 'aberta' && estado.folha === evento.folha) {
        return {
          fase: 'fechada',
          folha: estado.folha,
          focoNaAba: true
        } satisfies EstadoFolha;
      }

      return { fase: 'aberta', folha: evento.folha } satisfies EstadoFolha;
    case 'dispensou':
      if (estado.fase === 'fechada') return estado;

      return {
        fase: 'fechada',
        folha: estado.folha,
        focoNaAba: true
      } satisfies EstadoFolha;
    case 'navegou':
    case 'saiu-do-celular':
      if (estado.fase === 'aberta') {
        return {
          fase: 'fechada',
          folha: estado.folha,
          focoNaAba: false
        } satisfies EstadoFolha;
      }

      return estado.focoNaAba ? { ...estado, focoNaAba: false } : estado;
  }
}

/** Rolagem acumulada no mesmo sentido para trocar a faixa. */
export const LIMIAR_FAIXA_PX = 12;

/** Abaixo deste scrollY a faixa fica sempre à mostra. */
export const TOPO_FAIXA_PX = 56;

export interface EstadoFaixa {
  readonly recolhida: boolean;
  readonly ultimoY: number;
  /** Soma dos deltas no sentido atual; zera quando o sentido inverte. */
  readonly acumulado: number;
}

export const FAIXA_INICIAL: EstadoFaixa = {
  recolhida: false,
  ultimoY: 0,
  acumulado: 0
};

/**
 * Um passo por quadro de rolagem. Com folha aberta nada muda, nem o último y:
 * no iOS o vaul fixa o body e o scrollY cai a 0 até a folha fechar e a
 * rolagem voltar ao mesmo ponto, que então dá delta zero.
 */
export function passoDaFaixa(
  estado: EstadoFaixa,
  y: number,
  fase: EstadoFolha['fase']
) {
  if (fase === 'aberta') return estado;

  if (y < TOPO_FAIXA_PX) {
    return estado.recolhida || estado.acumulado !== 0 || estado.ultimoY !== y
      ? { recolhida: false, ultimoY: y, acumulado: 0 }
      : estado;
  }

  const delta = y - estado.ultimoY;

  if (delta === 0) return estado;

  const acumulado =
    (Math.sign(delta) === Math.sign(estado.acumulado) ? estado.acumulado : 0) +
    delta;

  let { recolhida } = estado;

  if (acumulado > LIMIAR_FAIXA_PX) recolhida = true;
  else if (acumulado < -LIMIAR_FAIXA_PX) recolhida = false;

  return { recolhida, ultimoY: y, acumulado };
}

export interface NavCelular {
  readonly folha: EstadoFolha;
  readonly faixaRecolhida: boolean;
  readonly tocarAba: (folha: IdFolha) => void;
  /** Para o onOpenChange do Drawer, que só chama com false aqui. */
  readonly dispensar: () => void;
  /** Toque num link da barra: fecha sem devolver o foco, mesmo sem mudar de página. */
  readonly navegar: () => void;
  readonly refAba: (folha: IdFolha) => RefCallback<HTMLButtonElement>;
  /** onCloseAutoFocus do painel: o foco volta à aba só quando focoNaAba. */
  readonly aoDevolverFoco: (evento: Event) => void;
}

export function useNavCelular() {
  const [folha, despachar] = useReducer(transicaoFolha, FOLHA_INICIAL);
  const [faixaRecolhida, setFaixaRecolhida] = useState(false);
  const atual = useRef(folha);
  const abas = useRef(new Map<IdFolha, HTMLButtonElement>());
  const refs = useRef(new Map<IdFolha, RefCallback<HTMLButtonElement>>());
  const pathname = usePathname();
  const pathnameAnterior = useRef(pathname);

  useEffect(() => {
    atual.current = folha;
  }, [folha]);

  useEffect(() => {
    if (pathnameAnterior.current === pathname) return;

    pathnameAnterior.current = pathname;
    despachar({ tipo: 'navegou' });
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia('(width >= 64rem)');

    const aoMudar = (evento: MediaQueryListEvent) => {
      if (evento.matches) despachar({ tipo: 'saiu-do-celular' });
    };

    desktop.addEventListener('change', aoMudar);

    return () => desktop.removeEventListener('change', aoMudar);
  }, []);

  useEffect(() => {
    let faixa: EstadoFaixa = { ...FAIXA_INICIAL, ultimoY: window.scrollY };
    let quadro = 0;

    const aoRolar = () => {
      if (quadro) return;

      quadro = requestAnimationFrame(() => {
        quadro = 0;
        faixa = passoDaFaixa(faixa, window.scrollY, atual.current.fase);
        setFaixaRecolhida(faixa.recolhida);
      });
    };

    window.addEventListener('scroll', aoRolar, { passive: true });

    return () => {
      window.removeEventListener('scroll', aoRolar);
      cancelAnimationFrame(quadro);
    };
  }, []);

  const tocarAba = useCallback(
    (id: IdFolha) => despachar({ tipo: 'tocou-aba', folha: id }),
    []
  );

  const dispensar = useCallback(() => despachar({ tipo: 'dispensou' }), []);
  const navegar = useCallback(() => despachar({ tipo: 'navegou' }), []);

  const refAba = useCallback((id: IdFolha) => {
    let ref = refs.current.get(id);

    if (!ref) {
      ref = (el) => {
        if (el) abas.current.set(id, el);
        else abas.current.delete(id);
      };

      refs.current.set(id, ref);
    }

    return ref;
  }, []);

  const aoDevolverFoco = useCallback((evento: Event) => {
    evento.preventDefault();

    const estado = atual.current;

    if (estado.fase === 'fechada' && estado.focoNaAba && estado.folha) {
      abas.current.get(estado.folha)?.focus({ preventScroll: true });
    }
  }, []);

  const nav: NavCelular = {
    folha,
    faixaRecolhida,
    tocarAba,
    dispensar,
    navegar,
    refAba,
    aoDevolverFoco
  };

  return nav;
}
