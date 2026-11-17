import { useNavCelular } from '@/components/layout/estadoCelular';
import { act, renderHook } from '@testing-library/react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const rota = vi.hoisted(() => ({ atual: '/' }));
const quadros: FrameRequestCallback[] = [];
let largura = 390;

function avaliar(media: string, largura: number) {
  const [, sinal, rem] = /^\(width (>=|<) (\d+)rem\)$/.exec(media) ?? [];

  if (!sinal) throw new Error(`consulta sem fake: ${media}`);

  return sinal === '>='
    ? largura >= Number(rem) * 16
    : largura < Number(rem) * 16;
}

class ListaFalsa extends EventTarget implements MediaQueryList {
  onchange = null;
  addListener = () => undefined;
  removeListener = () => undefined;

  constructor(readonly media: string) {
    super();
  }

  get matches() {
    return avaliar(this.media, largura);
  }
}

const listas: ListaFalsa[] = [];

function girarPara(nova: number) {
  largura = nova;
  act(() => {
    for (const lista of listas) {
      const evento = Object.assign(new Event('change'), {
        matches: lista.matches,
        media: lista.media
      });

      lista.dispatchEvent(evento);
    }
  });
}

vi.mock('next/navigation', () => ({ usePathname: () => rota.atual }));

function rolarPara(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
    quadros.splice(0).forEach((passo) => passo(0));
  });
}

describe('useNavCelular', () => {
  beforeEach(() => {
    rota.atual = '/';
    vi.stubGlobal('requestAnimationFrame', (passo: FrameRequestCallback) =>
      quadros.push(passo)
    );
    vi.stubGlobal('cancelAnimationFrame', () => undefined);
    largura = 390;
    listas.length = 0;
    vi.stubGlobal('matchMedia', (media: string) => {
      const lista = new ListaFalsa(media);

      listas.push(lista);

      return lista;
    });
    rolarPara(0);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rolar 200 px para baixo recolhe a faixa e 40 px para cima mostra', () => {
    const { result } = renderHook(() => useNavCelular());

    rolarPara(100);
    rolarPara(300);
    expect(result.current.faixaRecolhida).toBe(true);

    rolarPara(260);
    expect(result.current.faixaRecolhida).toBe(false);
  });

  it('com folha aberta a rolagem não mexe na faixa', () => {
    const { result } = renderHook(() => useNavCelular());

    act(() => result.current.tocarAba('menu'));
    rolarPara(100);
    rolarPara(600);
    expect(result.current.faixaRecolhida).toBe(false);
  });

  it('pathname novo fecha a folha sem devolver o foco à aba', () => {
    const { result, rerender } = renderHook(() => useNavCelular());

    act(() => result.current.tocarAba('maquinas'));
    expect(result.current.folha.fase).toBe('aberta');

    rota.atual = '/sobre';
    rerender();

    expect(result.current.folha).toEqual({
      fase: 'fechada',
      folha: 'maquinas',
      focoNaAba: false
    });
  });

  it('girar para 1280 px com a folha aberta fecha a folha', () => {
    largura = 900;
    const { result } = renderHook(() => useNavCelular());

    act(() => result.current.tocarAba('menu'));
    girarPara(1280);

    expect(result.current.folha).toEqual({
      fase: 'fechada',
      folha: 'menu',
      focoNaAba: false
    });
  });

  it('girar dentro da largura do celular não fecha a folha', () => {
    const { result } = renderHook(() => useNavCelular());

    act(() => result.current.tocarAba('menu'));
    girarPara(844);

    expect(result.current.folha.fase).toBe('aberta');
  });

  it('dispensar devolve o foco à aba que abriu', () => {
    const { result } = renderHook(() => useNavCelular());
    const aba = document.createElement('button');

    document.body.append(aba);
    act(() => {
      result.current.refAba('montar')(aba);
      result.current.tocarAba('montar');
    });
    act(() => result.current.dispensar());

    const evento = new Event('focus-out', { cancelable: true });

    result.current.aoDevolverFoco(evento);

    expect(evento.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(aba);
    aba.remove();
  });
});
