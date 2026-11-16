import { lerPublicado, listarPublicados } from '@/lib/blog/leitura';
import type { PostPublicado, ResumoPublicado } from '@/lib/blog/tipos';
import { render, screen } from '@testing-library/react';

import PostPage, { generateMetadata } from '../[slug]/page';
import BlogPage from '../page';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/blog/leitura', () => ({
  listarPublicados: vi.fn(),
  lerPublicado: vi.fn()
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  })
}));

// Padrão do repo: next/image não roda no jsdom.
vi.mock('next/image', () => ({ default: 'img' }));

vi.mock('../_components/fundo-blog', () => ({ FundoBlog: () => null }));

const gt: PostPublicado = {
  slug: 'gt-ganha-troca-de-formato',
  versao: 3,
  estado: 'publicado',
  criadoEm: '2026-11-03T13:00:00.000Z',
  atualizadoEm: '2026-11-11T13:00:00.000Z',
  publicadoEm: '2026-11-10T13:00:00.000Z',
  post: {
    assunto: 'maquina',
    titulo: 'GT ganha troca de formato sem ferramenta',
    resumo: 'A troca de 500 ml para 1 litro passa a ser feita no painel.',
    capa: '/blog/gt-ganha-troca-de-formato/capa-0123456789.webp',
    linhas: [
      {
        id: 'l1',
        proporcao: 50,
        colunas: [{ id: 'b1', tipo: 'titulo', texto: 'O que mudou' }]
      },
      {
        id: 'l2',
        proporcao: 50,
        colunas: [
          { id: 'b2', tipo: 'maquina', slug: 'envasadora-gable-top-gt' }
        ]
      }
    ]
  }
};

const resumoDe = (p: PostPublicado): ResumoPublicado => ({
  slug: p.slug,
  publicadoEm: p.publicadoEm,
  titulo: p.post.titulo,
  resumo: p.post.resumo,
  assunto: p.post.assunto,
  capa: p.post.capa
});

const feira: ResumoPublicado = {
  slug: 'profills-na-feira',
  publicadoEm: '2026-10-22T13:00:00.000Z',
  titulo: 'Profills na feira com a linha montada',
  resumo: 'O estande leva uma linha funcionando.',
  assunto: 'evento',
  capa: null
};

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

const searchParams = (assunto?: string) => ({
  searchParams: Promise.resolve({ assunto })
});

beforeEach(() => {
  vi.mocked(listarPublicados).mockResolvedValue([resumoDe(gt), feira]);
  vi.mocked(lerPublicado).mockImplementation(async (slug) =>
    slug === gt.slug ? gt : null
  );
});

describe('listagem do blog', () => {
  it('separa os destaques com capa das notas sem capa', async () => {
    render(await BlogPage(searchParams()));

    const destaques = screen.getByRole('region', { name: 'Destaques' });
    const notas = screen.getByRole('region', { name: 'Notas rápidas' });

    expect(destaques).toHaveTextContent(gt.post.titulo);
    expect(notas).toHaveTextContent(feira.titulo);
    expect(
      screen.getByRole('link', { name: /GT ganha troca/ })
    ).toHaveAttribute('href', '/blog/gt-ganha-troca-de-formato');
  });

  it('filtra pelo assunto da URL', async () => {
    render(await BlogPage(searchParams('evento')));

    expect(screen.queryByText(gt.post.titulo)).toBeNull();
    expect(screen.getByRole('link', { name: /Eventos/ })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('sem post publicado mostra o estado vazio', async () => {
    vi.mocked(listarPublicados).mockResolvedValue([]);
    render(await BlogPage(searchParams()));

    expect(
      screen.getByRole('heading', {
        name: 'Os primeiros posts estão a caminho'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Ver as máquinas' })
    ).toHaveAttribute('href', '/maquinas');
  });
});

describe('leitura do post', () => {
  it('mostra o post publicado com a máquina e outros posts no fim', async () => {
    const { container } = render(await PostPage(params(gt.slug)));

    expect(
      screen.getByRole('heading', { level: 1, name: gt.post.titulo })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'O que mudou' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Falar com um especialista' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Leia também' })
    ).toHaveTextContent(feira.titulo);

    const jsonLd = [
      ...container.querySelectorAll('script[type="application/ld+json"]')
    ].map((s) => JSON.parse(s.textContent ?? '{}'));

    expect(jsonLd).toContainEqual(
      expect.objectContaining({
        '@type': 'BlogPosting',
        headline: gt.post.titulo,
        datePublished: gt.publicadoEm
      })
    );
  });

  it('rascunho ou slug inexistente dá notFound', async () => {
    await expect(PostPage(params('rascunho-qualquer'))).rejects.toThrow(
      'NEXT_NOT_FOUND'
    );
  });

  it('metadata traz canonical, resumo e a capa como og:image', async () => {
    const meta = await generateMetadata(params(gt.slug));

    expect(meta.title).toBe(gt.post.titulo);
    expect(meta.description).toBe(gt.post.resumo);
    expect(meta.alternates?.canonical).toBe('/blog/gt-ganha-troca-de-formato');
    expect(meta.openGraph?.images).toEqual([
      { url: gt.post.capa, alt: gt.post.titulo }
    ]);
  });
});
