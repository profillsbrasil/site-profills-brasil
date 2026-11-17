import NavbarDesktop from '@/components/layout/navbarDesktop';
import NavbarMobile from '@/components/layout/navbarMobile';
import { destinos } from '@/components/layout/navegacao';
import type { VitrinesDoMenu } from '@/lib/data/maquinas/menu';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

vi.mock('next/image', () => ({ default: 'img' }));

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

function destinosRenderizados(
  raiz: HTMLElement,
  mapa = new Map<string, string>()
): Map<string, string> {
  for (const a of raiz.querySelectorAll<HTMLAnchorElement>('a[data-nav]')) {
    const id = a.dataset.nav ?? '';
    const href = a.getAttribute('href') ?? '';
    expect(mapa.get(id) ?? href, `id ${id} com dois hrefs`).toBe(href);
    mapa.set(id, href);
  }

  return mapa;
}

function barraDoCelular(): HTMLElement {
  const barra = document.querySelector<HTMLElement>('[data-barra-abas]');

  expect(barra, 'barra de abas do celular').not.toBeNull();

  return barra ?? document.body;
}

/** O mobile só monta a folha aberta: abre cada uma e toca cada categoria de Máquinas. */
async function percorrerMobile(): Promise<Map<string, string>> {
  const u = userEvent.setup({ pointerEventsCheck: 0 });
  const mapa = destinosRenderizados(document.body);
  const barra = barraDoCelular();

  for (const rotulo of ['Montar', 'Máquinas', 'Menu']) {
    await u.click(
      within(barra).getByRole('button', { name: rotulo, hidden: true })
    );
    destinosRenderizados(document.body, mapa);

    for (const categoria of screen
      .getByRole('dialog')
      .querySelectorAll<HTMLButtonElement>('button[aria-pressed]')) {
      await u.click(categoria);
      destinosRenderizados(document.body, mapa);
    }
  }

  return mapa;
}

describe('navbar: paridade desktop e mobile', () => {
  const gabarito = destinos();

  it('o desktop renderiza todo destino da árvore, com o href da árvore', () => {
    const { container } = render(<NavbarDesktop vitrines={vitrinesVazias} />);
    expect(destinosRenderizados(container)).toEqual(gabarito);
  });

  it('o mobile alcança todo destino da árvore pelas abas, com o href da árvore', async () => {
    render(<NavbarMobile vitrines={vitrinesVazias} />);
    expect(await percorrerMobile()).toEqual(gabarito);
  });

  it('nenhum link da navbar fica fora da árvore, nem dentro das folhas', async () => {
    const soltos: (string | null)[] = [];

    const juntarSoltos = () =>
      soltos.push(
        ...[...document.body.querySelectorAll('a:not([data-nav])')].map((a) =>
          a.getAttribute('href')
        )
      );

    render(
      <>
        <NavbarDesktop vitrines={vitrinesVazias} />
        <NavbarMobile vitrines={vitrinesVazias} />
      </>
    );
    juntarSoltos();

    const u = userEvent.setup({ pointerEventsCheck: 0 });

    for (const rotulo of ['Montar', 'Máquinas', 'Menu']) {
      await u.click(
        within(barraDoCelular()).getByRole('button', {
          name: rotulo,
          hidden: true
        })
      );
      juntarSoltos();
    }

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
