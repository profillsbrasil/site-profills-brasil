// @vitest-environment node
import {
  ABAS_DO_CELULAR,
  abaAtual,
  abasDoCelular,
  destinosDaAba,
  rotuloVer
} from '@/components/layout/abasCelular';
import {
  NAVEGACAO,
  type Navegacao,
  destinos
} from '@/components/layout/navegacao';

import { Mail } from 'lucide-react';
import { describe, expect, it } from 'vitest';

const ids = (abas: ReturnType<typeof abasDoCelular>) =>
  abas.flatMap((aba) => destinosDaAba(aba).map((d) => d.id));

describe('abas do celular', () => {
  it('são Início, Máquinas, Montar, Blog e Menu, nessa ordem', () => {
    expect(ABAS_DO_CELULAR.map((a) => a.rotulo)).toEqual([
      'Início',
      'Máquinas',
      'Montar',
      'Blog',
      'Menu'
    ]);
  });

  it('juntas alcançam todo destino da árvore, cada um em uma aba só', () => {
    const alcancados = ids(ABAS_DO_CELULAR);

    expect(new Set(alcancados).size).toBe(alcancados.length);
    expect(new Set(alcancados)).toEqual(new Set(destinos().keys()));
  });

  it('cada destino da aba leva o href da árvore', () => {
    const gabarito = destinos();

    for (const aba of ABAS_DO_CELULAR) {
      for (const d of destinosDaAba(aba)) {
        expect(d.href, d.id).toBe(gabarito.get(d.id));
      }
    }
  });

  it('Montar leva os dois "Monte a sua"', () => {
    expect(destinosDaAba(ABAS_DO_CELULAR[2]).map((d) => d.id)).toEqual([
      'monte-fabrica',
      'monte-maquina'
    ]);
  });

  it('Menu tem Projetos e Outros Serviços, com Clientes e Sobre no pé', () => {
    const { conteudo } = ABAS_DO_CELULAR[4];

    expect(conteudo.menus.map((m) => m.id)).toEqual(['projetos', 'servicos']);
    expect(conteudo.pe.map((l) => l.id)).toEqual(['clientes', 'sobre']);
  });

  it('link novo na árvore cai no pé do Menu', () => {
    const arvore: Navegacao = {
      ...NAVEGACAO,
      links: [
        ...NAVEGACAO.links,
        { id: 'contato', rotulo: 'Contato', href: '/contato', icone: Mail }
      ]
    };

    expect(abasDoCelular(arvore)[4].conteudo.pe.map((l) => l.id)).toEqual([
      'clientes',
      'sobre',
      'contato'
    ]);
  });

  it('árvore sem o link do blog não monta a barra', () => {
    const arvore: Navegacao = {
      ...NAVEGACAO,
      links: NAVEGACAO.links.filter((l) => l.id !== 'blog')
    };

    expect(() => abasDoCelular(arvore)).toThrow(/blog/);
  });

  it('árvore com dois menus de vitrine não monta a barra', () => {
    const [maquinas] = NAVEGACAO.menus;

    const arvore: Navegacao = {
      ...NAVEGACAO,
      menus: [...NAVEGACAO.menus, { ...maquinas, id: 'projetos' }]
    };

    expect(() => abasDoCelular(arvore)).toThrow(/vitrine/);
  });

  it.each([
    ['/', 'inicio'],
    ['/maquinas', 'maquinas'],
    ['/maquinas/dosadora-x', 'maquinas'],
    ['/montar-fabrica', 'montar'],
    ['/montar-maquina', 'montar'],
    ['/blog', 'blog'],
    ['/blog/um-post', 'blog'],
    ['/projetos/profills-erp', 'menu'],
    ['/servicos-personalizados', 'menu'],
    ['/sobre', 'menu'],
    ['/clientes', 'menu'],
    ['/download', null]
  ])('a aba de %s é %s', (pathname, aba) => {
    expect(abaAtual(ABAS_DO_CELULAR, pathname)).toBe(aba);
  });

  it.each([
    ['todas', 42, 'Ver as 42 máquinas'],
    ['Fim de linha', 1, 'Ver 1 máquina'],
    ['Fim de linha', 5, 'Ver 5 máquinas']
  ] as const)('rotuloVer(%s, %i) é "%s"', (chave, total, texto) => {
    expect(rotuloVer(chave, total)).toBe(texto);
  });
});
