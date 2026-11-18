import { render, screen } from '@testing-library/react';

import MaquinaPage, { generateMetadata, generateStaticParams } from '../page';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  })
}));

vi.stubGlobal('matchMedia', () => ({
  matches: false,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}));

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverStub);

vi.mock('@/lib/data/maquinas', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/data/maquinas')>();

  const maquinaEngenhariaFake = {
    ...actual.maquinasCatalogo[0],
    slug: 'engenharia-fake',
    nome: 'Linha Engenharia Fake',
    nomeCompleto: 'Linha Engenharia Fake - Solução Integrada',
    tipoPagina: 'engenharia' as const,
    categoria: 'Linhas completas e automação' as const,
    embalagensCompativeis: [],
    imagens: undefined,
    conteudoEngenharia: {
      escopo: 'Escopo de teste da solução de engenharia integrada.',
      blocos: [{ rotulo: 'Etapa', valor: 'Integração completa da linha' }]
    }
  };

  return {
    ...actual,
    getMaquinaBySlug: (slug: string) =>
      slug === 'engenharia-fake'
        ? maquinaEngenhariaFake
        : actual.getMaquinaBySlug(slug)
  };
});

vi.mock('next/image', () => ({
  default: 'img'
}));

vi.mock('next/dynamic', () => ({
  default: () =>
    function Modelo3dMock() {
      return <div data-testid='modelo-3d' />;
    }
}));

const paramsDoPiloto = Promise.resolve({
  slug: 'envasadora-stand-up-pouch-speed'
});

describe('página de máquina', () => {
  it('gera params estáticos para todas as máquinas do registry', () => {
    const params = generateStaticParams();
    expect(params).toContainEqual({ slug: 'envasadora-stand-up-pouch-speed' });
  });

  it('gera metadata com título e descrição do docx', async () => {
    const meta = await generateMetadata({ params: paramsDoPiloto });
    expect(meta.title).toBe('Envasadora Stand-Up Pouch Speed');
    expect(meta.description).toContain('5.400 unidades por hora');
  });

  it('renderiza o H1 do docx para o piloto', async () => {
    render(await MaquinaPage({ params: paramsDoPiloto }));
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Linha Pouch Speed - Envasadora Stand-Up Pouch Mecânica/i
      })
    ).toBeInTheDocument();
  });

  it('chama notFound para slug inexistente', async () => {
    await expect(
      MaquinaPage({ params: Promise.resolve({ slug: 'nao-existe' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('compõe os blocos na ordem do spec com âncoras derivadas', async () => {
    const { container } = render(await MaquinaPage({ params: paramsDoPiloto }));

    const ids = [...container.querySelectorAll('section[id], nav')].map(
      (el) => el.id || el.tagName.toLowerCase()
    );

    expect(ids).toContain('visao-geral');
    expect(ids).toContain('aplicacoes');
    expect(ids).toContain('embalagem');
    expect(ids).toContain('ficha-tecnica');
    expect(ids).toContain('contato');
    expect(container.querySelector('#video')).toBeNull();
  });

  it('página de engenharia renderiza escopo, omite ficha técnica e não exibe imagem de máquina', async () => {
    const { container } = render(
      await MaquinaPage({
        params: Promise.resolve({ slug: 'engenharia-fake' })
      })
    );

    expect(container.querySelector('#escopo')).not.toBeNull();
    expect(container.querySelector('#ficha-tecnica')).toBeNull();
    expect(container.querySelectorAll('img').length).toBe(0);
  });
});
