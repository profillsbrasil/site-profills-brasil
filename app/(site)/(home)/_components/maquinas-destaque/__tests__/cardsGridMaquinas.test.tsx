import { getMaquinaBySlug } from '@/lib/data/maquinas';
import { render } from '@testing-library/react';

import CardGridSket from '../cardsGridMaquinas';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: 'img'
}));

// embla-carousel lê matchMedia e ResizeObserver (ausentes no jsdom) para
// configurar breakpoints e medir slides; mesmo stub de matchMedia usado em
// lucide-social-regression.test.ts.
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

const featuredSlugs = [
  'envasadora-saches-liquidos-linha-tp',
  'envasadora-saches-4-soldas-tc4s-1-via',
  'envasadora-stand-up-pouch-speed',
  'enfardadeira-produtos-acabados-tc4u',
  'envasadora-gable-top-gt'
];

describe('destaques da home por slug', () => {
  it('os 5 slugs resolvem no registry e têm imagens', () => {
    for (const slug of featuredSlugs) {
      const maquina = getMaquinaBySlug(slug);
      expect(maquina).toBeDefined();
      expect(maquina?.imagens).toBeDefined();
    }
  });

  it('renderiza os 5 cards, cada um linkando para /maquinas/<slug>', () => {
    const { container } = render(<CardGridSket />);

    for (const slug of featuredSlugs) {
      expect(
        container.querySelector(`a[href="/maquinas/${slug}"]`)
      ).not.toBeNull();
    }
  });
});
