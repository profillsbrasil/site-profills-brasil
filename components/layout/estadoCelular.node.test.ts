import {
  type EstadoFaixa,
  type EstadoFolha,
  FAIXA_INICIAL,
  FOLHA_INICIAL,
  passoDaFaixa,
  transicaoFolha
} from '@/components/layout/estadoCelular';

import { describe, expect, it } from 'vitest';

const aberta = (folha: 'maquinas' | 'montar' | 'menu'): EstadoFolha => ({
  fase: 'aberta',
  folha
});

describe('transição da folha', () => {
  it('tocar uma aba com tudo fechado abre a folha dela', () => {
    expect(
      transicaoFolha(FOLHA_INICIAL, { tipo: 'tocou-aba', folha: 'montar' })
    ).toEqual(aberta('montar'));
  });

  it('tocar a aba da folha aberta fecha e devolve o foco à aba', () => {
    expect(
      transicaoFolha(aberta('menu'), { tipo: 'tocou-aba', folha: 'menu' })
    ).toEqual({ fase: 'fechada', folha: 'menu', focoNaAba: true });
  });

  it('tocar outra aba troca a folha direto, sem passar por fechada', () => {
    expect(
      transicaoFolha(aberta('maquinas'), { tipo: 'tocou-aba', folha: 'menu' })
    ).toEqual(aberta('menu'));
  });

  it('dispensar fecha com foco na aba, e dispensar de novo não muda nada', () => {
    const uma = transicaoFolha(aberta('maquinas'), { tipo: 'dispensou' });
    const duas = transicaoFolha(uma, { tipo: 'dispensou' });

    expect(uma).toEqual({
      fase: 'fechada',
      folha: 'maquinas',
      focoNaAba: true
    });
    expect(duas).toBe(uma);
  });

  it('navegar fecha sem foco na aba, e navegar de novo não muda nada', () => {
    const uma = transicaoFolha(aberta('montar'), { tipo: 'navegou' });
    const duas = transicaoFolha(uma, { tipo: 'navegou' });

    expect(uma).toEqual({ fase: 'fechada', folha: 'montar', focoNaAba: false });
    expect(duas).toBe(uma);
  });

  it('sair da largura do celular fecha sem foco na aba', () => {
    expect(transicaoFolha(aberta('menu'), { tipo: 'saiu-do-celular' })).toEqual(
      { fase: 'fechada', folha: 'menu', focoNaAba: false }
    );
  });

  it('navegar depois de dispensar tira o foco da aba', () => {
    const dispensada = transicaoFolha(aberta('menu'), { tipo: 'dispensou' });

    expect(transicaoFolha(dispensada, { tipo: 'navegou' })).toEqual({
      fase: 'fechada',
      folha: 'menu',
      focoNaAba: false
    });
  });
});

function rolar(ys: readonly number[], inicio: EstadoFaixa = FAIXA_INICIAL) {
  return ys.reduce((e, y) => passoDaFaixa(e, y, 'fechada'), inicio);
}

describe('passo da faixa do logo', () => {
  const emCem: EstadoFaixa = { recolhida: false, ultimoY: 100, acumulado: 0 };

  it('perto do topo nunca recolhe', () => {
    expect(rolar([10, 20, 30, 40]).recolhida).toBe(false);
  });

  it('11 px para baixo não recolhe, 13 px recolhe', () => {
    expect(passoDaFaixa(emCem, 111, 'fechada').recolhida).toBe(false);
    expect(passoDaFaixa(emCem, 113, 'fechada').recolhida).toBe(true);
  });

  it('13 px para cima mostra de novo', () => {
    const recolhida = rolar([300], emCem);

    expect(recolhida.recolhida).toBe(true);
    expect(passoDaFaixa(recolhida, 287, 'fechada').recolhida).toBe(false);
  });

  it('a inversão de sentido zera o acumulado', () => {
    const recolhida = rolar([300], emCem);

    expect(rolar([290, 295, 290], recolhida).recolhida).toBe(true);
  });

  it('oscilar 5 px por 20 quadros não troca a faixa', () => {
    const vaiVem = (base: number) =>
      Array.from({ length: 20 }, (_, i) => base + (i % 2 ? 0 : 5));

    const recolhida = rolar([200], emCem);
    const mostrada = rolar([150], recolhida);

    expect(recolhida.recolhida).toBe(true);
    expect(mostrada.recolhida).toBe(false);
    expect(rolar(vaiVem(200), recolhida).recolhida).toBe(true);
    expect(rolar(vaiVem(150), mostrada).recolhida).toBe(false);
  });

  it('sem mudança devolve o mesmo objeto', () => {
    expect(passoDaFaixa(emCem, 100, 'fechada')).toBe(emCem);
    expect(passoDaFaixa(FAIXA_INICIAL, 0, 'fechada')).toBe(FAIXA_INICIAL);
  });

  it('com folha aberta a rolagem não mexe na faixa', () => {
    const recolhida = rolar([300], emCem);

    expect(passoDaFaixa(emCem, 400, 'aberta')).toBe(emCem);
    expect(passoDaFaixa(recolhida, 0, 'aberta')).toBe(recolhida);
  });
});
