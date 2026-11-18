import { render } from '@testing-library/react';

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

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

    const avisoDoContainerDoRtl = '<html> div';

    const aninhamento = erros
      .filter((e) => e.includes('cannot be a child'))
      .filter((e) => !e.includes(avisoDoContainerDoRtl));

    expect(aninhamento).toEqual([]);
  });
});
