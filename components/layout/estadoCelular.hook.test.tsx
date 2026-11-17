import { useNavCelular } from '@/components/layout/estadoCelular';
import { act, renderHook } from '@testing-library/react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const rota = vi.hoisted(() => ({ atual: '/' }));
const quadros: FrameRequestCallback[] = [];

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
