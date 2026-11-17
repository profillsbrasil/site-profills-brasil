import NavbarDesktop from '@/components/layout/navbarDesktop';
import { type IdMenu, NAVEGACAO } from '@/components/layout/navegacao';
import { idGatilho, idPainel } from '@/components/layout/placa';
import { montarVitrinesDoMenu } from '@/lib/data/maquinas/menu';
import { act, fireEvent, render, screen, within } from '@testing-library/react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/sobre' }));

vi.mock('next/image', () => ({ default: 'img' }));

const VITRINES = montarVitrinesDoMenu();

const gatilho = (menu: IdMenu) => {
  const el = document.getElementById(idGatilho(menu));

  if (!el) throw new Error('sem gatilho ' + menu);

  return el;
};

const painel = (menu: IdMenu) => {
  const el = document.getElementById(idPainel(menu));

  if (!el) throw new Error('sem painel ' + menu);

  return el;
};

const montar = () => render(<NavbarDesktop vitrines={VITRINES} />);

describe('logo da navbar desktop', () => {
  it('não arrasta nem entra na seleção de texto', () => {
    montar();

    const logo = screen.getByAltText('Profills, página inicial');
    const link = logo.closest('a');

    expect(logo).toHaveAttribute('draggable', 'false');
    expect(link).toHaveAttribute('draggable', 'false');
    expect(link).toHaveClass('select-none');
  });
});

describe('gatilhos da navbar desktop', () => {
  it('cada gatilho tem a área de hit no próprio item, sem sobra no vão', () => {
    montar();

    for (const { id } of NAVEGACAO.menus) {
      const botao = gatilho(id);
      const item = botao.closest('[data-menu]');

      expect(item).toBe(botao.parentElement);
      expect(item).toHaveAttribute('data-menu', id);
      expect(botao.className).not.toMatch(/after:/);
      expect(item?.parentElement).not.toHaveClass('gap-1');
    }
  });

  it('o traço azul pertence ao gatilho aberto', () => {
    montar();
    fireEvent.click(gatilho('maquinas'));

    const tracos = [
      ...document.querySelectorAll('.placa-navbar nav [data-traco]')
    ];

    expect(gatilho('maquinas').querySelector('[data-traco]')).not.toBeNull();
    expect(tracos.length).toBe(NAVEGACAO.menus.length);
    expect(tracos.every((t) => t.closest('button[aria-expanded]'))).toBe(true);
  });
});

describe('painéis da gaveta', () => {
  it('a troca de menu é corte seco, sem rampa de opacidade', () => {
    montar();
    fireEvent.click(gatilho('maquinas'));
    fireEvent.click(gatilho('servicos'));

    expect(painel('maquinas')).toHaveClass('invisible');
    expect(painel('servicos')).not.toHaveClass('invisible');

    for (const { id } of NAVEGACAO.menus) {
      expect(painel(id).className).not.toMatch(/opacity/);
    }
  });

  it('ao fechar, o último painel continua no lugar enquanto o recorte fecha', () => {
    montar();
    fireEvent.click(gatilho('maquinas'));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(gatilho('maquinas')).toHaveAttribute('aria-expanded', 'false');
    expect(painel('maquinas')).not.toHaveClass('invisible');
    expect(painel('maquinas')).toHaveAttribute('inert');
  });
});

describe('vitrine de Máquinas', () => {
  // O jsdom não decodifica imagem: o stub resolve como o navegador depois do load.
  beforeEach(() => {
    HTMLImageElement.prototype.decode = () => Promise.resolve();
  });

  afterEach(() => {
    Reflect.deleteProperty(HTMLImageElement.prototype, 'decode');
  });

  const { painel: arvore } = NAVEGACAO.menus[0] ?? {};
  const folhas = arvore?.forma === 'vitrine' ? arvore.folhas : [];
  const todas = VITRINES.todas.vitrine;

  const outra = folhas.find((f) => {
    const v = VITRINES[f.vitrine].vitrine;

    return v !== null && v.slug !== todas?.slug;
  });

  const semFoto = folhas.find((f) => VITRINES[f.vitrine].vitrine === null);

  const camada = (alt: string) => within(painel('maquinas')).getByAltText(alt);

  const focar = (rotulo: string) =>
    act(() =>
      within(painel('maquinas')).getByText(rotulo).closest('a')?.focus()
    );

  const carregar = async (alt: string) => {
    fireEvent.load(within(painel('maquinas')).getByAltText(alt));
    await act(async () => {});
  };

  it('troca a imagem só depois de a nova carregar, sem remontar nem fade', async () => {
    if (!todas || !outra) {
      throw new Error('o catálogo precisa de duas vitrines com foto');
    }

    const nomeOutra = VITRINES[outra.vitrine].vitrine?.nome ?? '';

    montar();
    fireEvent.click(gatilho('maquinas'));

    const imgTodas = within(painel('maquinas')).getByAltText(todas.nome);

    expect(camada(todas.nome)).toHaveClass('invisible');
    await carregar(todas.nome);
    expect(camada(todas.nome)).not.toHaveClass('invisible');

    focar(outra.rotulo);
    expect(camada(todas.nome)).not.toHaveClass('invisible');
    expect(camada(nomeOutra)).toHaveClass('invisible');

    await carregar(nomeOutra);
    expect(camada(nomeOutra)).not.toHaveClass('invisible');
    expect(camada(todas.nome)).toHaveClass('invisible');

    focar(folhas[0]?.rotulo ?? '');
    expect(camada(todas.nome)).not.toHaveClass('invisible');
    expect(within(painel('maquinas')).getByAltText(todas.nome)).toBe(imgTodas);

    const figura = painel('maquinas').querySelector('figure');

    expect(figura?.innerHTML).not.toMatch(/animate-in|fade-in/);
  });

  it('o placeholder sob projeto entra sem esperar e sem fade', async () => {
    if (!todas || !semFoto) {
      throw new Error('o catálogo precisa de uma categoria sem foto');
    }

    montar();
    fireEvent.click(gatilho('maquinas'));
    await carregar(todas.nome);
    focar(semFoto.rotulo);

    const placeholder = within(painel('maquinas'))
      .getByText(/sob projeto/i)
      .closest('div');

    expect(placeholder).not.toHaveClass('invisible');
    expect(placeholder?.className).not.toMatch(/animate-in|fade-in/);
    expect(camada(todas.nome)).toHaveClass('invisible');
  });
});
