import { render } from '@testing-library/react';

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

// next/font precisa do compilador do Next; no jsdom vira stub
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'font-geist-sans' }),
  Geist_Mono: () => ({ variable: 'font-geist-mono' })
}));

vi.mock('next/script', () => ({
  default: ({ id }: { id: string }) => <script id={id} />
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}));

// Toaster (sonner) lê matchMedia, ausente no jsdom
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

beforeAll(() => {
  process.env.NEXT_PUBLIC_META_PIXEL_ID = '123';
  process.env.NEXT_PUBLIC_GA_ID = 'G-TEST';
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('RootLayout', () => {
  // O servidor sempre emite o <noscript> dentro do <body> (React move filhos
  // de <html> para lá), mas a árvore React no cliente diz html > noscript e
  // o React avisa "cannot be a child of <html>" e sinaliza hydration error.
  // O aviso de aninhamento também sai num render de cliente puro.
  it('não gera aviso de aninhamento inválido para os scripts de tracking', async () => {
    const erros: string[] = [];
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      erros.push(args.map(String).join(' '));
    });

    const { default: RootLayout } = await import('../layout');
    render(
      <RootLayout>
        <main>conteúdo</main>
      </RootLayout>
    );

    // O único aviso aceitável é o do próprio container do RTL (<div> não
    // pode conter <html>); qualquer outro é um elemento do layout no lugar
    // errado.
    const aninhamento = erros
      .filter((e) => e.includes('cannot be a child'))
      .filter((e) => !e.includes('<html> div'));
    expect(aninhamento).toEqual([]);
  });
});
