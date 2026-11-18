import {
  NAVEGACAO,
  type Navegacao,
  destinos,
  ehAtual
} from '@/components/layout/navegacao';
import { categoriasCatalogo } from '@/lib/data/maquinas/types';

import { Layers, Users } from 'lucide-react';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const fotos = NAVEGACAO.menus[2].painel.folhas;

describe('árvore de navegação', () => {
  it('id único entre nós e folhas', () => {
    const ids = [
      NAVEGACAO.marca.id,
      ...NAVEGACAO.menus.flatMap((m) => [
        m.id,
        ...m.painel.folhas.map((f) => f.id)
      ]),
      ...NAVEGACAO.links.map((l) => l.id),
      ...NAVEGACAO.monte.map((m) => m.id)
    ];

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('Máquinas tem "todas" e uma folha por categoria do catálogo, nessa ordem', () => {
    const maquinas = NAVEGACAO.menus.find((m) => m.id === 'maquinas');
    expect(
      maquinas?.painel.folhas.map((f) => ('vitrine' in f ? f.vitrine : null))
    ).toEqual(['todas', ...categoriasCatalogo]);
  });

  it('todo destino é uma página de app/(site)', () => {
    for (const href of destinos().values()) {
      const pathname = href.split('?')[0] ?? href;
      const pasta = pathname === '/' ? '(home)' : pathname;
      expect(
        existsSync(path.join(process.cwd(), 'app/(site)', pasta, 'page.tsx')),
        href
      ).toBe(true);
    }
  });

  it.each([
    ['/maquinas', 'maquinas', true],
    ['/maquinas/linha-flowpack', 'maquinas', true],
    ['/projetos/profills-erp', 'projetos', true],
    ['/servicos-personalizados', 'servicos', true],
    ['/', 'maquinas', false]
  ] as const)('ehAtual(%s) acende o menu %s: %s', (pathname, id, esperado) => {
    const menu = NAVEGACAO.menus.find((m) => m.id === id);
    expect(menu && ehAtual(menu, pathname)).toBe(esperado);
  });

  it.each([
    ['/blog/um-post', NAVEGACAO.links[1], true],
    ['/blogueiro', NAVEGACAO.links[1], false],
    ['/', NAVEGACAO.marca, true],
    ['/sobre', NAVEGACAO.marca, false]
  ] as const)('ehAtual(%s) acende %o: %s', (pathname, alvo, esperado) => {
    expect(ehAtual(alvo, pathname)).toBe(esperado);
  });
});

describe('tipo da árvore', () => {
  it('recusa a árvore errada (o tsc confere cada @ts-expect-error)', () => {
    const recusadas: Navegacao[] = [
      {
        ...NAVEGACAO,
        // @ts-expect-error os dois "Monte a sua" são obrigatórios
        monte: [NAVEGACAO.monte[0]]
      },
      {
        ...NAVEGACAO,
        // @ts-expect-error a marca só leva a /
        marca: { ...NAVEGACAO.marca, href: '/sobre' }
      },
      {
        ...NAVEGACAO,
        links: [
          {
            id: 'loja',
            rotulo: 'Loja',
            // @ts-expect-error href externo não é Rota
            href: 'https://loja.example',
            icone: Users
          }
        ]
      },
      {
        ...NAVEGACAO,
        menus: [
          {
            // @ts-expect-error menu fora de IdMenu
            id: 'pecas',
            rotulo: 'Peças',
            icone: Layers,
            painel: { forma: 'fotos', folhas: fotos }
          }
        ]
      },
      {
        ...NAVEGACAO,
        menus: [
          {
            id: 'servicos',
            rotulo: 'Outros Serviços',
            icone: Layers,
            painel: {
              forma: 'fotos',
              folhas: [
                // @ts-expect-error folha de painel de fotos sem foto
                {
                  id: 's',
                  rotulo: 'Soldagem',
                  href: '/servicos-personalizados'
                }
              ]
            }
          }
        ]
      }
    ];

    expect(recusadas).toHaveLength(5);
  });
});
