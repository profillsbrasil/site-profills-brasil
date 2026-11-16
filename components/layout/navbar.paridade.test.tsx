import NavbarDesktop from '@/components/layout/navbarDesktop';
import NavbarMobile from '@/components/layout/navbarMobile';
import { destinos } from '@/components/layout/navegacao';
import type { VitrinesDoMenu } from '@/lib/data/maquinas/menu';
import { render } from '@testing-library/react';

import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

vi.mock('next/image', () => ({ default: 'img' }));

vi.mock('@/components/ui/blur-fade', () => ({
  BlurFade: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// O vaul e o Radix só montam o conteúdo aberto: viram passagem para o teste
// ler o que a navbar renderiza.
vi.mock('@/components/ui/drawer', () => {
  const P = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

  return {
    Drawer: P,
    DrawerClose: P,
    DrawerContent: P,
    DrawerDescription: P,
    DrawerFooter: (props: React.ComponentProps<'div'>) => <div {...props} />,
    DrawerHeader: P,
    DrawerTitle: P,
    DrawerTrigger: P
  };
});

vi.mock('@/components/ui/accordion', () => {
  const P = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

  return {
    Accordion: P,
    AccordionContent: P,
    AccordionItem: P,
    AccordionTrigger: P
  };
});

const vitrinesVazias: VitrinesDoMenu = {
  todas: { vitrine: null, total: 0 },
  'Stand-up pouch': { vitrine: null, total: 0 },
  'Embalagens cartonadas e especiais': { vitrine: null, total: 0 },
  'Embalagens flexíveis': { vitrine: null, total: 0 },
  'Fim de linha e embalagens flexíveis': { vitrine: null, total: 0 },
  'Embalagens rígidas': { vitrine: null, total: 0 },
  'Embalagens rígidas e higienização': { vitrine: null, total: 0 },
  'Fim de linha': { vitrine: null, total: 0 },
  'Linhas completas e automação': { vitrine: null, total: 0 }
};

function destinosRenderizados(raiz: HTMLElement): Map<string, string> {
  const mapa = new Map<string, string>();

  for (const a of raiz.querySelectorAll<HTMLAnchorElement>('a[data-nav]')) {
    const id = a.dataset.nav ?? '';
    const href = a.getAttribute('href') ?? '';
    expect(mapa.get(id) ?? href, `id ${id} com dois hrefs`).toBe(href);
    mapa.set(id, href);
  }

  return mapa;
}

describe('navbar: paridade desktop e mobile', () => {
  const gabarito = destinos();

  it('o desktop renderiza todo destino da árvore, com o href da árvore', () => {
    const { container } = render(<NavbarDesktop vitrines={vitrinesVazias} />);
    expect(destinosRenderizados(container)).toEqual(gabarito);
  });

  it('o mobile renderiza todo destino da árvore, com o href da árvore', () => {
    const { container } = render(<NavbarMobile />);
    expect(destinosRenderizados(container)).toEqual(gabarito);
  });

  it('nenhum link da navbar fica fora da árvore, salvo as redes sociais', () => {
    const { container } = render(
      <>
        <NavbarDesktop vitrines={vitrinesVazias} />
        <NavbarMobile />
      </>
    );

    const soltos = [...container.querySelectorAll('a:not([data-nav])')].flatMap(
      (a) => (a.closest('[data-redes]') ? [] : [a.getAttribute('href')])
    );

    expect(soltos).toEqual([]);
  });

  it('os dois "Monte a sua" ficam na placa do desktop, fora da gaveta', () => {
    const { container } = render(<NavbarDesktop vitrines={vitrinesVazias} />);

    for (const id of ['monte-fabrica', 'monte-maquina']) {
      const a = container.querySelector(`a[data-nav="${id}"]`);
      expect(a, id).not.toBeNull();
      expect(a?.closest('[inert]'), id).toBeNull();
    }
  });
});
