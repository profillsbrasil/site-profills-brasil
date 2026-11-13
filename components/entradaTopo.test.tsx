import type { ReactElement } from 'react';

import HeroCarrossel from '@/app/(site)/(home)/_components/heroCarrossel/heroCarrossel';
import ClientesGrid from '@/app/(site)/clientes/_components/clientesGrid';
import HeroClientes from '@/app/(site)/clientes/_components/heroClientes';
import { CatalogForm } from '@/app/(site)/download/_components/catalog-form/CatalogForm';
import { HeroDossie } from '@/app/(site)/maquinas/[slug]/_components/heroDossie';
import MaquinaCard from '@/app/(site)/maquinas/_components/cardMaquinas/maquinaCard';
import FormularioMontarFabrica from '@/app/(site)/montar-fabrica/_components/formularioMontarFabrica';
import ConfiguradorMaquina from '@/app/(site)/montar-maquina/_components/configuradorMaquina';
import HeroBank from '@/app/(site)/projetos/profills-bank/_components/hero';
import HeroErp from '@/app/(site)/projetos/profills-erp/_components/hero';
import HeroHub from '@/app/(site)/projetos/profills-hub/_components/hero';
import HeroLocacao from '@/app/(site)/projetos/profills-locacao/_components/hero';
import HeroMarketplace from '@/app/(site)/projetos/profills-marketplace/_components/hero';
import HeroPd from '@/app/(site)/projetos/profills-pd/_components/hero';
import HeroSchool from '@/app/(site)/projetos/profills-school/_components/hero';
import HeroSustentabilidade from '@/app/(site)/projetos/profills-sustentabilidade/_components/hero';
import CardsPerfil from '@/app/(site)/sobre/_components/cardsPerfil';
import SorteioFispal2026 from '@/app/(standalone)/sorteio-fispal-2026/page';
import { getMaquinaBySlug } from '@/lib/data/maquinas';

import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: ({ alt, className }: { alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className={className} />
  )
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/'
}));

const ESCONDE = /opacity:\s*0(?![.\d])|blur\(|translateY\(112%\)/i;

/** Estilos inline do HTML do servidor que deixam o conteúdo invisível até o JS hidratar */
function estilosQueEscondem(ui: ReactElement, escopo?: string) {
  const raiz = document.createElement('div');
  raiz.innerHTML = renderToString(ui);
  const alvo = escopo ? [...raiz.querySelectorAll(escopo)] : [raiz];

  return alvo.flatMap((el) =>
    [el, ...el.querySelectorAll('[style]')]
      .map((n) => n.getAttribute('style') ?? '')
      .filter((s) => ESCONDE.test(s))
  );
}

const maquina = getMaquinaBySlug('envasadora-stand-up-pouch-speed')!;

const TOPOS: [string, ReactElement, string?][] = [
  ['/ HeroCarrossel', <HeroCarrossel key='h' />],
  ['/clientes HeroClientes', <HeroClientes key='h' />],
  [
    '/clientes ClientesGrid, 9 primeiros logos',
    <ClientesGrid key='h' />,
    '.grid > :nth-child(-n + 9)'
  ],
  ['/download CatalogForm', <CatalogForm key='h' />],
  [
    '/maquinas MaquinaCard do topo',
    <MaquinaCard key='h' maquina={maquina} index={0} />
  ],
  ['/maquinas/[slug] HeroDossie', <HeroDossie key='h' maquina={maquina} />],
  [
    '/montar-fabrica FormularioMontarFabrica',
    <FormularioMontarFabrica key='h' />
  ],
  ['/montar-maquina ConfiguradorMaquina', <ConfiguradorMaquina key='h' />],
  ['/projetos/profills-bank Hero', <HeroBank key='h' />],
  ['/projetos/profills-erp Hero', <HeroErp key='h' />],
  ['/projetos/profills-hub Hero', <HeroHub key='h' />],
  ['/projetos/profills-locacao Hero', <HeroLocacao key='h' />],
  ['/projetos/profills-marketplace Hero', <HeroMarketplace key='h' />],
  ['/projetos/profills-pd Hero', <HeroPd key='h' />],
  ['/projetos/profills-school Hero', <HeroSchool key='h' />],
  [
    '/projetos/profills-sustentabilidade Hero',
    <HeroSustentabilidade key='h' />
  ],
  ['/sobre CardsPerfil', <CardsPerfil key='h' />],
  [
    '/sorteio-fispal-2026 hero',
    <SorteioFispal2026 key='h' />,
    ':scope > div > section:first-child'
  ]
];

describe('topo de página nasce visível no HTML do servidor', () => {
  it.each(TOPOS)('%s', (_nome, ui, escopo) => {
    expect(estilosQueEscondem(ui, escopo)).toEqual([]);
  });

  it('MaquinaCard do topo mostra as fotos sem esperar o onLoad', () => {
    const html = renderToString(<MaquinaCard maquina={maquina} index={0} />);
    expect(html).not.toMatch(/class="[^"]*\bopacity-0\b/);
  });

  it('MaquinaCard abaixo da dobra continua com a entrada ao rolar', () => {
    expect(
      estilosQueEscondem(<MaquinaCard maquina={maquina} index={8} />)
    ).not.toEqual([]);
  });
});
