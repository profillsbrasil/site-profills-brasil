import { useSearchParams } from 'next/navigation';

import { render, screen } from '@testing-library/react';

import { ExpiredBannerDaUrl } from './ExpiredBannerDaUrl';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ useSearchParams: vi.fn() }));

function comUrl(query: string) {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(query) as unknown as ReturnType<typeof useSearchParams>
  );

  return render(<ExpiredBannerDaUrl />);
}

describe('ExpiredBannerDaUrl', () => {
  it('mostra o aviso de link expirado com ?error=expired', () => {
    comUrl('error=expired');
    expect(screen.getByText('Seu link expirou')).toBeInTheDocument();
  });

  it('mostra o aviso de link inválido com ?error=invalid', () => {
    comUrl('error=invalid');
    expect(screen.getByText('Link inválido')).toBeInTheDocument();
  });

  it('não mostra nada sem erro ou com valor desconhecido', () => {
    const { container } = comUrl('error=outro');
    expect(container).toBeEmptyDOMElement();
  });
});
