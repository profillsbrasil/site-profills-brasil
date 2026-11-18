import {
  CLIQUE_IGNORA_MS,
  type EstadoPlaca,
  type EventoPlaca,
  PARADO_MS,
  PLACA_INICIAL,
  ehMovimentoReal,
  estenderRastro,
  menuVisivel,
  proximaCompacta,
  reduzirPlaca,
  rumoAGaveta,
  sentidoDaTroca
} from '@/components/layout/placa';

import { describe, expect, it } from 'vitest';

const ORDEM = ['maquinas', 'projetos', 'servicos'] as const;

const rodar = (...eventos: EventoPlaca[]): EstadoPlaca =>
  eventos.reduce(reduzirPlaca, PLACA_INICIAL);

type Menu = (typeof ORDEM)[number];

const moveu = (
  menu: Menu,
  agora: number,
  { real = true, rumo = false } = {}
): EventoPlaca => ({
  tipo: 'ponteiro-moveu',
  menu,
  agora,
  real,
  rumoAGaveta: rumo
});

const entrou = (menu: Menu, agora: number): EventoPlaca => ({
  tipo: 'ponteiro-entrou',
  menu,
  agora,
  real: true,
  rumoAGaveta: false
});

const FORA: EventoPlaca = {
  tipo: 'ponteiro-fora-de-gatilho',
  onde: 'fundo',
  real: true
};

const NA_GAVETA: EventoPlaca = {
  tipo: 'ponteiro-fora-de-gatilho',
  onde: 'gaveta',
  real: true
};

const SAIU: EventoPlaca = { tipo: 'ponteiro-saiu-da-zona' };
const VOLTOU: EventoPlaca = { tipo: 'ponteiro-entrou-na-zona' };

const venceu = (agora: number): EventoPlaca => ({
  tipo: 'venceu-retida',
  agora
});

const retidaEmProjetos = (agora = 100): EventoPlaca[] => [
  entrou('maquinas', 0),
  moveu('projetos', agora, { rumo: true })
];

describe('placa: abrir na hora', () => {
  it('o primeiro movimento real sobre o gatilho abre, sem timer', () => {
    expect(menuVisivel(rodar(entrou('maquinas', 0)))).toBe('maquinas');
  });

  it('varrer a barra abre cada menu que cruza, na ordem', () => {
    const vistos: (string | null)[] = [];

    [entrou('maquinas', 0), FORA, entrou('projetos', 40), FORA]
      .concat(entrou('servicos', 80), FORA)
      .reduce((estado, evento) => {
        const proximo = reduzirPlaca(estado, evento);

        vistos.push(menuVisivel(proximo));

        return proximo;
      }, PLACA_INICIAL);

    expect([...new Set(vistos)]).toEqual(['maquinas', 'projetos', 'servicos']);
  });

  it('a primeira abertura não tem sentido', () => {
    expect(sentidoDaTroca(rodar(entrou('projetos', 0)), ORDEM)).toBe(0);
  });

  it('evento de layout sobre um gatilho com tudo fechado não abre', () => {
    for (const tipo of ['ponteiro-entrou', 'ponteiro-moveu'] as const) {
      const e = reduzirPlaca(PLACA_INICIAL, {
        tipo,
        menu: 'maquinas',
        agora: 0,
        real: false,
        rumoAGaveta: false
      });

      expect(e).toBe(PLACA_INICIAL);
    }
  });
});

describe('placa: trocar com a gaveta aberta', () => {
  it('outro gatilho fora do rumo da gaveta troca na hora, com sentido', () => {
    const e = rodar(entrou('servicos', 0), FORA, entrou('projetos', 200));

    expect(menuVisivel(e)).toBe('projetos');
    expect(sentidoDaTroca(e, ORDEM)).toBe(-1);
  });

  it('rumo à gaveta retém a troca enquanto o ponteiro anda', () => {
    const e = rodar(
      ...retidaEmProjetos(100),
      moveu('projetos', 120, { rumo: true }),
      moveu('projetos', 140, { rumo: true })
    );

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('parado PARADO_MS sobre o gatilho, a troca retida acontece', () => {
    const e = rodar(...retidaEmProjetos(100), venceu(100 + PARADO_MS));

    expect(menuVisivel(e)).toBe('projetos');
    expect(sentidoDaTroca(e, ORDEM)).toBe(1);
  });

  it('o prazo conta do último movimento: timer antigo não troca', () => {
    const e = rodar(
      ...retidaEmProjetos(100),
      moveu('projetos', 130, { rumo: true }),
      venceu(100 + PARADO_MS)
    );

    expect(menuVisivel(e)).toBe('maquinas');
    expect(menuVisivel(reduzirPlaca(e, venceu(130 + PARADO_MS)))).toBe(
      'projetos'
    );
  });

  it('retida, um movimento fora do rumo troca na hora', () => {
    const e = rodar(...retidaEmProjetos(100), moveu('projetos', 116));

    expect(menuVisivel(e)).toBe('projetos');
  });

  it('retida, seguir para a gaveta descarta a troca', () => {
    const e = rodar(
      ...retidaEmProjetos(100),
      NA_GAVETA,
      venceu(100 + PARADO_MS),
      { tipo: 'venceu-fecha' }
    );

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('retida, voltar ao gatilho do menu aberto descarta a troca', () => {
    const e = rodar(
      ...retidaEmProjetos(100),
      entrou('maquinas', 120),
      venceu(100 + PARADO_MS)
    );

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('fechando, voltar à zona por outro gatilho troca na hora', () => {
    const e = rodar(
      entrou('maquinas', 0),
      SAIU,
      VOLTOU,
      entrou('projetos', 200),
      { tipo: 'venceu-fecha' }
    );

    expect(menuVisivel(e)).toBe('projetos');
  });

  it('evento de layout não troca, não retém e não desfaz a retida', () => {
    const aberta = rodar(entrou('maquinas', 0));

    expect(reduzirPlaca(aberta, moveu('servicos', 200, { real: false }))).toBe(
      aberta
    );

    const retida = rodar(...retidaEmProjetos(100));

    expect(reduzirPlaca(retida, moveu('projetos', 140, { real: false }))).toBe(
      retida
    );
    expect(
      reduzirPlaca(retida, {
        tipo: 'ponteiro-fora-de-gatilho',
        onde: 'fundo',
        real: false
      })
    ).toBe(retida);
  });

  it('timer atrasado ou repetido não muda nada', () => {
    const aberto = rodar({ tipo: 'clique', menu: 'maquinas', agora: 0 });

    expect(reduzirPlaca(aberto, venceu(500))).toBe(aberto);
    expect(reduzirPlaca(aberto, { tipo: 'venceu-fecha' })).toBe(aberto);
    expect(reduzirPlaca(PLACA_INICIAL, venceu(500))).toBe(PLACA_INICIAL);
  });
});

describe('placa: fechar', () => {
  it('sair da zona fecha só quando o timer de fechar vence', () => {
    const saindo = rodar(entrou('maquinas', 0), SAIU);

    expect(menuVisivel(saindo)).toBe('maquinas');
    expect(
      menuVisivel(reduzirPlaca(saindo, { tipo: 'venceu-fecha' }))
    ).toBeNull();
  });

  it('voltar à zona antes de o timer vencer mantém aberto', () => {
    const e = rodar(entrou('maquinas', 0), SAIU, VOLTOU, {
      tipo: 'venceu-fecha'
    });

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('sair da zona com a troca retida fecha sem trocar', () => {
    const e = rodar(...retidaEmProjetos(100), SAIU, venceu(100 + PARADO_MS), {
      tipo: 'venceu-fecha'
    });

    expect(menuVisivel(e)).toBeNull();
  });
});

describe('placa: clique, teclado e fora', () => {
  it('clique logo depois de o hover abrir não fecha', () => {
    const e = rodar(entrou('maquinas', 100), {
      tipo: 'clique',
      menu: 'maquinas',
      agora: 100 + CLIQUE_IGNORA_MS - 1
    });

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('clique logo depois de o hover trocar de menu não fecha', () => {
    const e = rodar(entrou('maquinas', 1000), FORA, entrou('projetos', 2900), {
      tipo: 'clique',
      menu: 'projetos',
      agora: 3000
    });

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
    entrou('maquinas', 100),
    moveu('maquinas', 100 + CLIQUE_IGNORA_MS + 50)
  ];

  const fecharPorClique: EventoPlaca = {
    tipo: 'clique',
    menu: 'maquinas',
    agora: 100 + CLIQUE_IGNORA_MS + 100
  };

  const tremer = (agora: number): EventoPlaca[] => [
    moveu('maquinas', agora),
    moveu('maquinas', agora + 16, { rumo: true }),
    venceu(agora + 16 + PARADO_MS)
  ];

  it('fechar por clique e tremer não reabre', () => {
    const e = rodar(...abertoNoGatilho(), fecharPorClique, ...tremer(1000));

    expect(menuVisivel(e)).toBeNull();
  });

  it('fechar por Esc e tremer não reabre', () => {
    const e = rodar(...abertoNoGatilho(), { tipo: 'esc' }, ...tremer(1000));

    expect(menuVisivel(e)).toBeNull();
  });

  it('sair do gatilho e voltar depois da dispensa abre na hora', () => {
    for (const fechar of [fecharPorClique, { tipo: 'esc' } as const]) {
      const e = rodar(
        ...abertoNoGatilho(),
        fechar,
        FORA,
        entrou('maquinas', 2000)
      );

      expect(menuVisivel(e)).toBe('maquinas');
    }
  });

  it('fechar pelo teclado com o ponteiro longe não trava o hover', () => {
    const e = rodar(
      { tipo: 'clique', menu: 'maquinas', agora: 0 },
      { tipo: 'clique', menu: 'maquinas', agora: 1000 },
      entrou('maquinas', 2000)
    );

    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('clique fora e navegação depois da dispensa não deixam dispensa', () => {
    for (const fim of [{ tipo: 'fora' }, { tipo: 'navegou' }] as const) {
      const e = rodar(...abertoNoGatilho(), fecharPorClique, fim);

      expect(e).toEqual(PLACA_INICIAL);
      expect(menuVisivel(reduzirPlaca(e, moveu('maquinas', 3000)))).toBe(
        'maquinas'
      );
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

  it('entrar em outro gatilho depois da dispensa abre o outro', () => {
    for (const fechar of [fecharPorClique, { tipo: 'esc' } as const]) {
      const e = rodar(...abertoNoGatilho(), fechar, entrou('projetos', 2000));

      expect(menuVisivel(e)).toBe('projetos');
    }
  });

  it('evento de layout fora do gatilho não desfaz a dispensa', () => {
    const dispensado = rodar(...abertoNoGatilho(), { tipo: 'esc' });

    expect(
      reduzirPlaca(dispensado, {
        tipo: 'ponteiro-fora-de-gatilho',
        onde: 'fundo',
        real: false
      })
    ).toBe(dispensado);
  });
});

describe('placa: zona', () => {
  it('dentro da zona, sair do gatilho para a gaveta não fecha', () => {
    const e = rodar(entrou('maquinas', 0), NA_GAVETA, { tipo: 'venceu-fecha' });

    expect(e.fase).toBe('aberta');
    expect(menuVisivel(e)).toBe('maquinas');
  });

  it('sair da zona e voltar sobre o mesmo gatilho deixa aberto', () => {
    const e = rodar(
      entrou('maquinas', 0),
      SAIU,
      VOLTOU,
      moveu('maquinas', 300),
      { tipo: 'venceu-fecha' }
    );

    expect(e.fase).toBe('aberta');
  });

  it('voltar à zona com tudo fechado não muda nada', () => {
    expect(reduzirPlaca(PLACA_INICIAL, VOLTOU)).toBe(PLACA_INICIAL);
  });
});

describe('placa: rumo à gaveta', () => {
  interface Passo {
    readonly x: number;
    readonly y: number;
  }

  const rumos = (pontos: readonly Passo[]): boolean[] => {
    let rastro: ReturnType<typeof estenderRastro> = [];

    return pontos.map((ponto, i) => {
      rastro = estenderRastro(rastro, { ...ponto, t: i * 16 });

      return rumoAGaveta(rastro);
    });
  };

  const pelaBarra = (de: Passo, ateX: number, deriva: number, passo = 3) => {
    const n = Math.ceil(Math.abs(ateX - de.x) / passo);
    const pontos: Passo[] = [de];

    for (let i = 1; i <= n; i++) {
      const x = de.x + Math.sign(ateX - de.x) * passo * i;
      const y = de.y + (deriva * i) / n;

      pontos.push({ x, y });

      if (i % 3 === 0) pontos.push({ x: x + 1, y });
    }

    return pontos;
  };

  const aoConteudo = (de: Passo, ate: Passo, passos = 48) => {
    const pontos: Passo[] = [de];

    for (let i = 1; i <= passos; i++) {
      const u = i / passos;
      const k = u * u * (3 - 2 * u);
      const x = de.x + (ate.x - de.x) * k;
      const y = de.y + (ate.y - de.y) * k;

      pontos.push({ x, y });
      pontos.push({ x: x + (i % 2 ? 2 : -2), y: y + (i % 2 ? 1 : -1) });
    }

    return pontos;
  };

  const SERVICOS_X = 539.1;

  it('andar pela barra não é rumo ao entrar no vizinho, com deriva de até 6 px', () => {
    for (const deriva of [-6, -3, 0, 3, 6]) {
      const pontos = pelaBarra({ x: 488, y: 44 }, 591, deriva);
      const entrada = pontos.findIndex((p) => p.x >= SERVICOS_X);

      expect([deriva, rumos(pontos)[entrada]]).toEqual([deriva, false]);
    }
  });

  it('andar pela barra por dois gatilhos não é rumo em nenhum ponto do segundo', () => {
    const pontos = pelaBarra({ x: 383, y: 40 }, 591, 6);
    const noSegundo = rumos(pontos).filter((_, i) => pontos[i].x >= SERVICOS_X);

    expect(noSegundo).not.toContain(true);
  });

  it('a reta tremida do gatilho a um alvo do painel é rumo em todo ponto da faixa dos gatilhos', () => {
    const casos = [
      { de: { x: 193.2, y: 44 }, ate: { x: 930.65, y: 150.2 }, base: 62 },
      { de: { x: 590.95, y: 44 }, ate: { x: 233, y: 127 }, base: 62 },
      { de: { x: 574.4, y: 32 }, ate: { x: 1404.75, y: 128.2 }, base: 50 },
      { de: { x: 435.7, y: 60 }, ate: { x: 1057, y: 229.5 }, base: 62 }
    ];

    for (const { de, ate, base } of casos) {
      const pontos = aoConteudo(de, ate);

      const fora = rumos(pontos).flatMap((rumo, i) =>
        !rumo && pontos[i].y <= base
          ? [`${pontos[i].x.toFixed(1)},${pontos[i].y.toFixed(1)}`]
          : []
      );

      expect([de, fora]).toEqual([de, []]);
    }
  });

  it('subir ao gatilho e virar para o conteúdo sem parar é rumo depois de descer 3 px', () => {
    const subida = Array.from({ length: 20 }, (_, i) => ({
      x: 400 + i,
      y: 120 - 4 * i
    }));

    const descida = Array.from({ length: 30 }, (_, i) => ({
      x: 419 + 4 * (i + 1),
      y: 44 + i + 1
    }));

    const r = rumos([...subida, ...descida]);

    expect(r[subida.length - 1]).toBe(false);
    expect(r.slice(subida.length + 2)).not.toContain(false);
  });

  it('subir da gaveta para outro gatilho não é rumo', () => {
    const pontos = Array.from({ length: 14 }, (_, i) => ({
      x: 300,
      y: 200 - 12 * i
    }));

    expect(rumos(pontos).at(-1)).toBe(false);
  });

  it('saindo do repouso, é rumo até haver caminho para medir', () => {
    const pontos = pelaBarra({ x: 536, y: 44 }, 591, 0);
    const r = rumos(pontos);

    expect(r[pontos.findIndex((p) => p.x >= 536 + 12)]).toBe(true);
    expect(r[pontos.findIndex((p) => p.x >= 536 + 30)]).toBe(false);
  });

  it('o rastro recomeça no ponto de repouso depois de PARADO_MS sem mover', () => {
    const andando = [
      { x: 100, y: 44, t: 0 },
      { x: 130, y: 44, t: 16 },
      { x: 160, y: 44, t: 32 }
    ].reduce<ReturnType<typeof estenderRastro>>(estenderRastro, []);

    const depois = estenderRastro(andando, {
      x: 161,
      y: 45,
      t: 32 + PARADO_MS
    });

    expect(depois.map((p) => p.x)).toEqual([160, 161]);
    expect(rumoAGaveta(depois)).toBe(true);
  });

  it('o rastro guarda só o caminho recente', () => {
    let rastro: ReturnType<typeof estenderRastro> = [];

    for (let i = 0; i <= 100; i++) {
      rastro = estenderRastro(rastro, { x: 100 + 4 * i, y: 44, t: i * 8 });
    }

    expect(rastro.length).toBeLessThan(20);
    expect(rastro.at(-1)?.x).toBe(500);
  });

  it('sem rastro não é rumo', () => {
    expect(rumoAGaveta([])).toBe(false);
  });
});

describe('placa: movimento real', () => {
  it('sem ponto anterior, conta como movimento', () => {
    expect(ehMovimentoReal(null, 10, 20)).toBe(true);
  });

  it('coordenadas iguais às do último pointermove não são movimento', () => {
    expect(ehMovimentoReal({ x: 10, y: 20 }, 10, 20)).toBe(false);
  });

  it('qualquer deslocamento é movimento', () => {
    expect(ehMovimentoReal({ x: 10, y: 20 }, 10.5, 20)).toBe(true);
    expect(ehMovimentoReal({ x: 10, y: 20 }, 10, 19)).toBe(true);
  });
});

describe('placa: histerese da compacta', () => {
  const seguir = (ys: readonly number[]) => {
    let atual = false;

    return ys.map((y) => (atual = proximaCompacta(atual, y)));
  };

  it('entra acima de 24 px e só sai em 4 px ou menos', () => {
    expect(seguir([0, 34, 10, 34, 10])).toEqual([
      false,
      true,
      true,
      true,
      true
    ]);
    expect(seguir([24, 25, 5, 4])).toEqual([false, true, true, false]);
  });

  it('3 px de rolagem não compacta', () => {
    expect(seguir([3])).toEqual([false]);
  });

  it('quem chega já rolado entra compacto', () => {
    expect(seguir([600])).toEqual([true]);
  });
});

describe('placa: outros itens da placa', () => {
  const em = (
    onde: 'gaveta' | 'fundo' | 'outro-item',
    real = true
  ): EventoPlaca => ({ tipo: 'ponteiro-fora-de-gatilho', onde, real });

  it('parar em outro item da placa fecha como sair da zona', () => {
    const saindo = rodar(entrou('maquinas', 0), em('outro-item'));

    expect(saindo.fase).toBe('fechando');
    expect(
      menuVisivel(reduzirPlaca(saindo, { tipo: 'venceu-fecha' }))
    ).toBeNull();
  });

  it('voltar à gaveta antes do prazo mantém aberto', () => {
    const e = rodar(entrou('maquinas', 0), em('outro-item'), em('gaveta'), {
      tipo: 'venceu-fecha'
    });

    expect(e.fase).toBe('aberta');
  });

  it('passar pelo fundo da placa não segura o fechamento', () => {
    const e = rodar(entrou('maquinas', 0), em('outro-item'), em('fundo'), {
      tipo: 'venceu-fecha'
    });

    expect(menuVisivel(e)).toBeNull();
  });

  it('outro item que chega por layout não fecha', () => {
    const aberta = rodar(entrou('maquinas', 0));

    expect(reduzirPlaca(aberta, em('outro-item', false))).toBe(aberta);
  });
});
