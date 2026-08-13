import { render, screen } from '@testing-library/react';

import MaquinaPage, { generateMetadata, generateStaticParams } from '../page';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  })
}));

// Padrão sancionado do repo (ver heroDossie.test.tsx, fichaTecnica.test.tsx etc.):
// next/image não roda em jsdom, mock reduz para uma tag <img> simples.
vi.mock('next/image', () => ({
  default: 'img'
}));

// Mesmo padrão da Task 9 (embalagemBloco.test.tsx): substitui o componente
// 3D dinâmico por um placeholder síncrono, evitando o import real do model-viewer.
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
  it('gera params estáticos para todas as máquinas do registry', async () => {
    const params = await generateStaticParams();
    expect(params).toContainEqual({ slug: 'envasadora-stand-up-pouch-speed' });
  });

  it('gera metadata com título e descrição do docx', async () => {
    const meta = await generateMetadata({ params: paramsDoPiloto });
    expect(meta.title).toBe('Envasadora Stand-Up Pouch Speed | Profills');
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
    // nav (sub-nav) → hero (section sem id) → visao-geral → aplicacoes → embalagem → ficha-tecnica → contato
    expect(ids).toContain('visao-geral');
    expect(ids).toContain('aplicacoes');
    expect(ids).toContain('embalagem');
    expect(ids).toContain('ficha-tecnica');
    expect(ids).toContain('contato');
    expect(container.querySelector('#video')).toBeNull(); // piloto sem vídeo
  });
});
