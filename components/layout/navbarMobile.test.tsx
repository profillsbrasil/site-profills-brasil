import type { StaticImageData } from 'next/image';

import NavbarMobile from '@/components/layout/navbarMobile';
import type { VitrinesDoMenu } from '@/lib/data/maquinas/menu';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const rota = vi.hoisted(() => ({ atual: '/' }));

// O jsdom não implementa a captura de ponteiro que o vaul pede no toque dentro da folha.
Element.prototype.setPointerCapture = () => undefined;

Element.prototype.releasePointerCapture = () => undefined;

vi.mock('next/navigation', () => ({ usePathname: () => rota.atual }));

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: StaticImageData | string }) => (
    <span role='img' aria-label={alt} data-imagem={JSON.stringify(src)} />
  )
}));

const foto = (nome: string): StaticImageData => ({
  src: `/vitrine-${nome}.webp`,
  width: 10,
  height: 10
});

const vazia = { vitrine: null, total: 0 };

const vitrines: VitrinesDoMenu = {
  todas: {
    vitrine: {
      slug: 'a',
      nome: 'Envasadora A',
      subtitulo: 'Linha A',
      imagem: foto('a')
    },
    total: 42
  },
  'Stand-up pouch': vazia,
  'Embalagens cartonadas e especiais': vazia,
  'Embalagens flexíveis': vazia,
  'Fim de linha e embalagens flexíveis': vazia,
  'Embalagens rígidas': {
    vitrine: {
      slug: 'r',
      nome: 'Rígida R',
      subtitulo: 'Linha R',
      imagem: foto('r')
    },
    total: 5
  },
  'Embalagens rígidas e higienização': vazia,
  'Fim de linha': { vitrine: null, total: 1 },
  'Linhas completas e automação': vazia
};

const usuario = () => userEvent.setup({ pointerEventsCheck: 0 });

// Com a folha aberta o Radix esconde a barra do leitor de tela (hideOthers), mas ela segue tocável.
const barra = () =>
  screen.getByRole('navigation', { name: 'Principal', hidden: true });

const aba = (rotulo: string) =>
  within(barra()).getByRole('button', { name: rotulo, hidden: true });

const fotosDeConteudo = () =>
  [...document.body.querySelectorAll<HTMLElement>('[data-imagem]')].filter(
    (img) => !img.getAttribute('aria-label')?.startsWith('Profills')
  );

describe('navbar do celular', () => {
  beforeEach(() => {
    rota.atual = '/';
  });

  it.each([
    ['/sobre', 'Menu'],
    ['/maquinas/envasadora-a', 'Máquinas'],
    ['/montar-fabrica', 'Montar']
  ])('em %s a aba %s fica acesa', (pathname, rotulo) => {
    rota.atual = pathname;
    render(<NavbarMobile vitrines={vitrines} />);

    expect(aba(rotulo)).toHaveAttribute('data-atual');
    expect(
      within(barra())
        .getAllByRole('button')
        .filter((b) => b.dataset.atual)
    ).toHaveLength(1);
  });

  it('na home a aba Início é a página atual', () => {
    render(<NavbarMobile vitrines={vitrines} />);

    expect(
      within(barra()).getByRole('link', { name: 'Início' })
    ).toHaveAttribute('aria-current', 'page');
  });

  it('com as folhas fechadas nenhuma vitrine nem foto de serviço está no DOM', () => {
    render(<NavbarMobile vitrines={vitrines} />);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(fotosDeConteudo()).toEqual([]);
  });

  it('Montar mostra os dois "Monte a sua" com um toque', async () => {
    render(<NavbarMobile vitrines={vitrines} />);
    await usuario().click(aba('Montar'));

    const folha = screen.getByRole('dialog', { name: 'Monte a sua' });

    expect(
      within(folha).getByRole('link', { name: 'Monte a sua fábrica' })
    ).toHaveAttribute('href', '/montar-fabrica');
    expect(
      within(folha).getByRole('link', { name: 'Monte a sua máquina' })
    ).toHaveAttribute('href', '/montar-maquina');
    expect(aba('Montar')).toHaveAttribute('aria-expanded', 'true');
  });

  it('tocar outra aba com a folha aberta troca a folha', async () => {
    const u = usuario();

    render(<NavbarMobile vitrines={vitrines} />);
    await u.click(aba('Montar'));
    await u.click(aba('Máquinas'));

    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(
      screen.getByRole('dialog', { name: 'Máquinas' })
    ).toBeInTheDocument();
    expect(aba('Máquinas')).toHaveAttribute('aria-expanded', 'true');
    expect(aba('Montar')).toHaveAttribute('aria-expanded', 'false');
  });

  it('tocar a aba da folha aberta fecha a folha', async () => {
    const u = usuario();

    render(<NavbarMobile vitrines={vitrines} />);
    await u.click(aba('Menu'));
    await u.click(aba('Menu'));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(aba('Menu')).toHaveAttribute('aria-expanded', 'false');
  });

  it('Esc fecha e devolve o foco à aba', async () => {
    const u = usuario();

    render(<NavbarMobile vitrines={vitrines} />);
    await u.click(aba('Menu'));
    await u.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(aba('Menu')).toHaveFocus();
  });

  it('tocar uma categoria troca a vitrine e o "Ver N máquinas"', async () => {
    const u = usuario();

    render(<NavbarMobile vitrines={vitrines} />);
    await u.click(aba('Máquinas'));

    const folha = screen.getByRole('dialog', { name: 'Máquinas' });
    const ver = () => within(folha).getByRole('link', { name: /^Ver / });

    expect(ver()).toHaveTextContent('Ver as 42 máquinas');
    expect(ver()).toHaveAttribute('href', '/maquinas');

    await u.click(
      within(folha).getByRole('button', {
        name: /^Embalagens rígidas, 5 máquinas$/
      })
    );

    expect(ver()).toHaveTextContent('Ver 5 máquinas');
    expect(ver()).toHaveAttribute('data-nav', 'maquinas-Embalagens rígidas');
    expect(ver()).toHaveAttribute(
      'href',
      '/maquinas?categoria=Embalagens%20r%C3%ADgidas'
    );
    expect(within(folha).getByText('Rígida R')).toBeInTheDocument();
    expect(fotosDeConteudo().map((img) => img.dataset.imagem)).toEqual([
      JSON.stringify(foto('r'))
    ]);
  });

  it('categoria sem vitrine mostra o nome e a contagem, sem foto', async () => {
    const u = usuario();

    render(<NavbarMobile vitrines={vitrines} />);
    await u.click(aba('Máquinas'));

    const folha = screen.getByRole('dialog', { name: 'Máquinas' });

    await u.click(
      within(folha).getByRole('button', { name: /^Fim de linha, 1 máquina$/ })
    );

    expect(within(folha).getByText('1 máquina')).toBeInTheDocument();
    expect(fotosDeConteudo()).toEqual([]);
  });

  it('Menu mostra Projetos, as 4 fotos de serviço e Clientes e Sobre no pé', async () => {
    render(<NavbarMobile vitrines={vitrines} />);
    await usuario().click(aba('Menu'));

    const folha = screen.getByRole('dialog', { name: 'Menu' });

    expect(
      within(folha).getByRole('region', { name: 'Projetos' })
    ).toBeInTheDocument();
    expect(fotosDeConteudo()).toHaveLength(4);
    expect(
      within(folha).getByRole('link', { name: 'Clientes' })
    ).toHaveAttribute('href', '/clientes');
    expect(within(folha).getByRole('link', { name: 'Sobre' })).toHaveAttribute(
      'href',
      '/sobre'
    );
  });
});
