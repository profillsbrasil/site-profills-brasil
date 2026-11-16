// @vitest-environment node
import {
  CLIQUE_IGNORA_MS,
  type EstadoPlaca,
  type EventoPlaca,
  PLACA_INICIAL,
  REPOUSO_MS,
  REPOUSO_PX,
  menuVisivel,
  reduzirPlaca,
  sentidoDaTroca
} from '@/components/layout/placa';

import { describe, expect, it } from 'vitest';

const ORDEM = ['maquinas', 'projetos', 'servicos'] as const;

const rodar = (...eventos: EventoPlaca[]): EstadoPlaca =>
  eventos.reduce(reduzirPlaca, PLACA_INICIAL);

type Menu = (typeof ORDEM)[number];

const moveu = (menu: Menu, x: number, agora: number): EventoPlaca => ({
  tipo: 'ponteiro-moveu',
  menu,
  x,
  y: 44,
  agora
});

const hoverAbre = (menu: Menu, agora = REPOUSO_MS): EventoPlaca[] => [
  moveu(menu, 100, agora - REPOUSO_MS),
  { tipo: 'venceu-abre', agora }
];

/** Ponteiro a 300 px/s, uma amostra a cada 16 ms, com o timer vencendo no meio. */
function varrer(menus: readonly Menu[], inicio: number): EventoPlaca[] {
  const eventos: EventoPlaca[] = [];
  let agora = inicio;

  for (const [i, menu] of menus.entries()) {
    for (let x = 0; x < 100; x += 5) {
      eventos.push(moveu(menu, i * 104 + x, agora), {
        tipo: 'venceu-abre',
        agora
      });
      agora += 16;
    }

    eventos.push({ tipo: 'ponteiro-saiu' });
  }

  return eventos;
}

describe('placa: intenção de hover', () => {
  it('passar pelo gatilho sem parar não abre', () => {
    const e = rodar(
      moveu('maquinas', 100, 0),
      { tipo: 'ponteiro-saiu' },
      {
        tipo: 'venceu-abre',
        agora: REPOUSO_MS
      }
    );

    expect(menuVisivel(e)).toBeNull();
  });

  it('parar no gatilho até o timer vencer abre', () => {
    expect(menuVisivel(rodar(...hoverAbre('maquinas')))).toBe('maquinas');
  });

  it('varrer a barra sem parar não abre nenhum menu', () => {
    const e = rodar(...varrer(['maquinas', 'projetos', 'servicos'], 0));

    expect(menuVisivel(e)).toBeNull();
  });

  it('tremer dentro do limiar conta como repouso e abre', () => {
    const e = rodar(
      moveu('maquinas', 100, 0),
      moveu('maquinas', 100 + REPOUSO_PX - 1, REPOUSO_MS / 2),
      { tipo: 'venceu-abre', agora: REPOUSO_MS }
    );

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('andar além do limiar recomeça a espera', () => {
    const e = rodar(
      moveu('maquinas', 100, 0),
      moveu('maquinas', 100 + REPOUSO_PX + 1, REPOUSO_MS / 2),
      { tipo: 'venceu-abre', agora: REPOUSO_MS }
    );

    expect(menuVisivel(e)).toBeNull();
    expect(
      menuVisivel(
        reduzirPlaca(e, { tipo: 'venceu-abre', agora: REPOUSO_MS * 1.5 })
      )
    ).toBe('maquinas');
  });

  it('com a gaveta aberta, cruzar outro gatilho a caminho do painel não troca', () => {
    const e = rodar(
      ...hoverAbre('maquinas'),
      { tipo: 'ponteiro-saiu' },
      ...varrer(['projetos'], 200),
      { tipo: 'ponteiro-entrou-gaveta' },
      { tipo: 'venceu-abre', agora: 2000 },
      { tipo: 'venceu-fecha' }
    );

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('com a gaveta aberta, repousar em outro gatilho troca e o sentido segue a ordem', () => {
    const e = rodar(
      ...hoverAbre('servicos'),
      { tipo: 'ponteiro-saiu' },
      moveu('projetos', 480, 200)
    );

    expect(menuVisivel(e)).toBe('servicos');

    const trocou = reduzirPlaca(e, {
      tipo: 'venceu-abre',
      agora: 200 + REPOUSO_MS
    });

    expect(menuVisivel(trocou)).toBe('projetos');
    expect(sentidoDaTroca(trocou, ORDEM)).toBe(-1);
  });

  it('voltar ao gatilho do menu aberto descarta a troca pendente', () => {
    const e = rodar(
      ...hoverAbre('maquinas'),
      { tipo: 'ponteiro-saiu' },
      moveu('projetos', 480, 200),
      { tipo: 'ponteiro-saiu' },
      moveu('maquinas', 420, 220),
      { tipo: 'venceu-abre', agora: 1000 }
    );

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('candidato que segue para a gaveta não troca com o timer atrasado', () => {
    const e = rodar(
      ...hoverAbre('maquinas'),
      { tipo: 'ponteiro-saiu' },
      moveu('projetos', 480, 200),
      { tipo: 'ponteiro-saiu' },
      { tipo: 'ponteiro-entrou-gaveta' },
      { tipo: 'venceu-abre', agora: 200 + REPOUSO_MS }
    );

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('fechando, chegar a outro gatilho segura a gaveta e troca no repouso', () => {
    const e = rodar(
      ...hoverAbre('maquinas'),
      { tipo: 'ponteiro-saiu' },
      moveu('projetos', 480, 200),
      { tipo: 'venceu-fecha' }
    );

    expect(menuVisivel(e)).toBe('maquinas');
    expect(
      menuVisivel(
        reduzirPlaca(e, { tipo: 'venceu-abre', agora: 200 + REPOUSO_MS })
      )
    ).toBe('projetos');
  });

  it('timer de um repouso antigo não abre o repouso novo antes do prazo', () => {
    const e = rodar(
      moveu('maquinas', 100, 0),
      moveu('maquinas', 100 + REPOUSO_PX + 1, 50),
      { tipo: 'venceu-abre', agora: REPOUSO_MS }
    );

    expect(menuVisivel(e)).toBeNull();
    expect(
      menuVisivel(
        reduzirPlaca(e, { tipo: 'venceu-abre', agora: 50 + REPOUSO_MS })
      )
    ).toBe('maquinas');
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

  it('clique logo depois de o hover trocar de menu não fecha', () => {
    const e = rodar(
      ...hoverAbre('maquinas', 1000),
      { tipo: 'ponteiro-saiu' },
      moveu('projetos', 480, 2900 - REPOUSO_MS),
      { tipo: 'venceu-abre', agora: 2900 },
      { tipo: 'clique', menu: 'projetos', agora: 3000 }
    );

    expect(menuVisivel(e)).toBe('projetos');
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
    ).toEqual({
      fase: 'fechada',
      devolverFocoA: 'projetos',
      dispensado: 'projetos'
    });
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

describe('placa: dispensar com o ponteiro em cima', () => {
  const abertoNoGatilho = (): EventoPlaca[] => [
    ...hoverAbre('maquinas', 100),
    moveu('maquinas', 100, 100 + CLIQUE_IGNORA_MS + 50)
  ];

  const fecharPorClique: EventoPlaca = {
    tipo: 'clique',
    menu: 'maquinas',
    agora: 100 + CLIQUE_IGNORA_MS + 100
  };

  const tremerEVencer = (agora: number): EventoPlaca[] => [
    moveu('maquinas', 101, agora),
    { tipo: 'venceu-abre', agora: agora + REPOUSO_MS },
    moveu('maquinas', 100, agora + REPOUSO_MS + 10),
    { tipo: 'venceu-abre', agora: agora + 2 * REPOUSO_MS + 10 }
  ];

  it('fechar por clique e tremer 1 px não reabre', () => {
    const e = rodar(
      ...abertoNoGatilho(),
      fecharPorClique,
      ...tremerEVencer(1000)
    );

    expect(menuVisivel(e)).toBeNull();
  });

  it('fechar por Esc e tremer 1 px não reabre', () => {
    const e = rodar(
      ...abertoNoGatilho(),
      { tipo: 'esc' },
      ...tremerEVencer(1000)
    );

    expect(menuVisivel(e)).toBeNull();
  });

  it('sair do gatilho e voltar depois da dispensa abre ao repousar', () => {
    for (const fechar of [fecharPorClique, { tipo: 'esc' } as const]) {
      const e = rodar(
        ...abertoNoGatilho(),
        fechar,
        { tipo: 'ponteiro-saiu' },
        moveu('maquinas', 100, 2000),
        { tipo: 'venceu-abre', agora: 2000 + REPOUSO_MS }
      );

      expect(menuVisivel(e)).toBe('maquinas');
    }
  });

  it('fechar pelo teclado com o ponteiro longe não trava o hover', () => {
    const e = rodar(
      { tipo: 'clique', menu: 'maquinas', agora: 0 },
      { tipo: 'clique', menu: 'maquinas', agora: 1000 },
      { tipo: 'ponteiro-entrou', menu: 'maquinas', x: 100, y: 44, agora: 2000 },
      { tipo: 'venceu-abre', agora: 2000 + REPOUSO_MS }
    );

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('clique fora e navegação depois da dispensa não deixam dispensa', () => {
    for (const fim of [{ tipo: 'fora' }, { tipo: 'navegou' }] as const) {
      const e = rodar(...abertoNoGatilho(), fecharPorClique, fim);

      expect(e).toEqual(PLACA_INICIAL);
      expect(
        menuVisivel(
          rodar(
            ...abertoNoGatilho(),
            fecharPorClique,
            fim,
            ...hoverAbre('maquinas', 3000)
          )
        )
      ).toBe('maquinas');
    }
  });

  it('clique e teclado reabrem o menu dispensado', () => {
    for (const reabrir of [
      { tipo: 'clique', menu: 'maquinas', agora: 2000 },
      { tipo: 'teclado-abriu', menu: 'maquinas', agora: 2000 }
    ] as const) {
      expect(
        menuVisivel(rodar(...abertoNoGatilho(), fecharPorClique, reabrir))
      ).toBe('maquinas');
    }
  });

  it('repousar em outro gatilho depois da dispensa abre o outro', () => {
    for (const fechar of [fecharPorClique, { tipo: 'esc' } as const]) {
      const e = rodar(
        ...abertoNoGatilho(),
        fechar,
        moveu('projetos', 480, 2000),
        { tipo: 'venceu-abre', agora: 2000 + REPOUSO_MS }
      );

      expect(menuVisivel(e)).toBe('projetos');
    }
  });
});
