import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AnimatedContainer } from './AnimatedContainer';

const matchMediaOriginal = window.matchMedia;

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: query.includes('prefers-reduced-motion') && reducedMotion,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null
  })) as unknown as typeof window.matchMedia;
}

function renderEPegarWrapper(
  reducedMotion: boolean,
  trigger: 'mount' | 'inView'
) {
  mockMatchMedia(reducedMotion);
  render(
    <AnimatedContainer trigger={trigger}>
      <p>conteúdo</p>
    </AnimatedContainer>
  );
  const wrapper = screen.getByText('conteúdo').parentElement!;
  const resultado = {
    tag: wrapper.tagName,
    style: wrapper.getAttribute('style')
  };
  cleanup();
  return resultado;
}

/* Regressão do bug de página invisível: com "reduzir animações" ativo, o
   componente trocava motion.div por div estática — árvore diferente da do
   SSR, hydration mismatch, e o opacity:0 inline do servidor nunca era
   corrigido. A invariante: o primeiro render tem que ser IDÊNTICO com e sem
   reduced motion (só a transition, que não vai ao HTML, pode divergir). */
describe('AnimatedContainer com prefers-reduced-motion', () => {
  afterEach(() => {
    cleanup();
    window.matchMedia = matchMediaOriginal;
  });

  it.each(['mount', 'inView'] as const)(
    'primeiro render é idêntico com e sem reduced motion (%s)',
    (trigger) => {
      const sem = renderEPegarWrapper(false, trigger);
      const com = renderEPegarWrapper(true, trigger);
      expect(com.tag).toBe(sem.tag);
      expect(com.style).toBe(sem.style);
    }
  );

  it('renderiza os filhos sob reduced motion', () => {
    mockMatchMedia(true);
    render(
      <AnimatedContainer>
        <p>visível</p>
      </AnimatedContainer>
    );
    expect(screen.getByText('visível')).toBeInTheDocument();
  });
});
