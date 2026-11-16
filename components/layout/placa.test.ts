// @vitest-environment node
import {
  CLIQUE_IGNORA_MS,
  type EstadoPlaca,
  type EventoPlaca,
  PLACA_INICIAL,
  menuVisivel,
  reduzirPlaca,
  sentidoDaTroca
} from '@/components/layout/placa';

import { describe, expect, it } from 'vitest';

const ORDEM = ['maquinas', 'projetos', 'servicos'] as const;

const rodar = (...eventos: EventoPlaca[]): EstadoPlaca =>
  eventos.reduce(reduzirPlaca, PLACA_INICIAL);

const hoverAbre = (menu: (typeof ORDEM)[number], agora = 80): EventoPlaca[] => [
  { tipo: 'ponteiro-entrou', menu },
  { tipo: 'venceu-abre', agora }
];

describe('placa: intenção de hover', () => {
  it('passar pelo gatilho sem parar não abre', () => {
    const e = rodar(
      { tipo: 'ponteiro-entrou', menu: 'maquinas' },
      { tipo: 'ponteiro-saiu' },
      { tipo: 'venceu-abre', agora: 80 }
    );

    expect(menuVisivel(e)).toBeNull();
  });

  it('parar no gatilho até o timer vencer abre', () => {
    expect(menuVisivel(rodar(...hoverAbre('maquinas')))).toBe('maquinas');
  });

  it('com a gaveta aberta a troca é imediata e o sentido segue a ordem', () => {
    const e = rodar(...hoverAbre('servicos'), {
      tipo: 'ponteiro-entrou',
      menu: 'projetos'
    });

    expect(menuVisivel(e)).toBe('projetos');
    expect(sentidoDaTroca(e, ORDEM)).toBe(-1);
    expect(
      sentidoDaTroca(
        reduzirPlaca(e, { tipo: 'ponteiro-entrou', menu: 'servicos' }),
        ORDEM
      )
    ).toBe(1);
  });

  it('a primeira abertura não tem sentido', () => {
    expect(sentidoDaTroca(rodar(...hoverAbre('projetos')), ORDEM)).toBe(0);
  });

  it('sair da placa fecha só quando o timer de fechar vence', () => {
    const saindo = rodar(...hoverAbre('maquinas'), { tipo: 'ponteiro-saiu' });

    expect(menuVisivel(saindo)).toBe('maquinas');
    expect(
      menuVisivel(reduzirPlaca(saindo, { tipo: 'venceu-fecha' }))
    ).toBeNull();
  });

  it('entrar na gaveta antes de o timer vencer mantém aberto', () => {
    const e = rodar(
      ...hoverAbre('maquinas'),
      { tipo: 'ponteiro-saiu' },
      { tipo: 'ponteiro-entrou-gaveta' },
      { tipo: 'venceu-fecha' }
    );

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('timer atrasado ou repetido não muda nada', () => {
    const aberto = rodar({ tipo: 'clique', menu: 'maquinas', agora: 0 });

    expect(reduzirPlaca(aberto, { tipo: 'venceu-abre', agora: 500 })).toBe(
      aberto
    );
    expect(reduzirPlaca(aberto, { tipo: 'venceu-fecha' })).toBe(aberto);
  });
});

describe('placa: clique, teclado e fora', () => {
  it('clique logo depois de o hover abrir não fecha', () => {
    const e = rodar(...hoverAbre('maquinas', 100), {
      tipo: 'clique',
      menu: 'maquinas',
      agora: 100 + CLIQUE_IGNORA_MS - 1
    });

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('segundo clique no mesmo gatilho fecha', () => {
    const e = rodar(
      { tipo: 'clique', menu: 'maquinas', agora: 0 },
      { tipo: 'clique', menu: 'maquinas', agora: 1000 }
    );

    expect(menuVisivel(e)).toBeNull();
  });

  it('clique em outro gatilho troca de menu', () => {
    const e = rodar(
      { tipo: 'clique', menu: 'maquinas', agora: 0 },
      { tipo: 'clique', menu: 'servicos', agora: 1000 }
    );

    expect(menuVisivel(e)).toBe('servicos');
    expect(sentidoDaTroca(e, ORDEM)).toBe(1);
  });

  it('Esc fecha e pede o foco de volta no gatilho', () => {
    expect(
      rodar(
        { tipo: 'teclado-abriu', menu: 'projetos', agora: 0 },
        { tipo: 'esc' }
      )
    ).toEqual({ fase: 'fechada', devolverFocoA: 'projetos' });
  });

  it('clique fora e navegação fecham sem roubar o foco', () => {
    for (const fim of [{ tipo: 'fora' }, { tipo: 'navegou' }] as const) {
      expect(
        rodar({ tipo: 'clique', menu: 'maquinas', agora: 0 }, fim)
      ).toEqual(PLACA_INICIAL);
    }
  });

  it('Esc, fora e navegação com tudo fechado não mudam o estado', () => {
    for (const evento of [
      { tipo: 'esc' },
      { tipo: 'fora' },
      { tipo: 'navegou' }
    ] as const) {
      expect(reduzirPlaca(PLACA_INICIAL, evento)).toBe(PLACA_INICIAL);
    }
  });
});
