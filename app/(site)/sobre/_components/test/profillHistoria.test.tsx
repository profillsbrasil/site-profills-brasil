import { act, render, screen } from '@testing-library/react';

import ProfillHistoria from '../profillHistoria';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const globoMontou = vi.fn();

vi.mock('@/components/magicui/globe', () => ({
  Globe: () => {
    globoMontou();

    return <div data-testid='globo' />;
  }
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} />
  )
}));

let entrarNaTela: () => void = () => {};

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(
        private cb: (e: { isIntersecting: boolean; target: Element }[]) => void
      ) {}
      observe(target: Element) {
        if (target.querySelector('h1')) {
          entrarNaTela = () => this.cb([{ isIntersecting: true, target }]);
        }
      }
      unobserve() {}
      disconnect() {}
    }
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  globoMontou.mockClear();
});

describe('ProfillHistoria', () => {
  it('não monta o globo fora da tela e monta quando o bloco entra', async () => {
    render(<ProfillHistoria />);
    await act(() => vi.dynamicImportSettled());
    expect(globoMontou).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Embalando o Mundo!'
    );

    act(() => entrarNaTela());
    expect(await screen.findByTestId('globo')).toBeInTheDocument();
  });
});
