import { render, screen } from '@testing-library/react';

import MaquinaPage, { generateMetadata, generateStaticParams } from '../page';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  })
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
});
