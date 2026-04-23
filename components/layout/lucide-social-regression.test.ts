import { fireEvent, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Footer from './footer';
import NavbarMobile from './navbarMobile';
import {
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from './socialLinks';

vi.mock('next/image', () => ({
  default: 'img',
}));

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
vi.stubGlobal('matchMedia', () => ({
  matches: false,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

const writeTextMock = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
  clipboard: {
    writeText: writeTextMock,
  },
});

beforeEach(() => {
  writeTextMock.mockClear();
});

describe('lucide social icon regression', () => {
  it('loads footer and mobile navbar modules without missing brand icon exports', async () => {
    await expect(import('./footer')).resolves.toMatchObject({
      default: expect.any(Function),
    });
    await expect(import('./navbarMobile')).resolves.toMatchObject({
      default: expect.any(Function),
    });
  });

  it('renders lighter social SVGs instead of the previous thick outlines', () => {
    const { container: instagram } = render(createElement(InstagramIcon));
    const { container: linkedIn } = render(createElement(LinkedInIcon));
    const { container: youTube } = render(createElement(YouTubeIcon));

    expect(instagram.querySelector('svg')).not.toHaveAttribute('stroke-width');
    expect(linkedIn.querySelector('svg')).not.toHaveAttribute('stroke-width');
    expect(youTube.querySelector('svg')).not.toHaveAttribute('stroke-width');
  });

  it('renders larger social icons in footer and mobile navbar', () => {
    const { unmount } = render(createElement(Footer));

    expect(
      screen
        .getByLabelText('Instagram')
        .querySelector('svg')
    ).toHaveClass('size-8', 'md:size-10');

    unmount();

    render(createElement(NavbarMobile));
    fireEvent.click(screen.getByLabelText('Abrir menu de navegação'));

    expect(
      screen
        .getByLabelText('Instagram')
        .querySelector('svg')
    ).toHaveClass('h-6', 'w-6');
  });

  it('highlights the copyright symbol and copies the cnpj on click', async () => {
    render(createElement(Footer));

    expect(screen.getByText('©')).toHaveClass('text-accent');

    const cnpjButton = screen.getByRole('button', { name: /copiar cnpj/i });
    fireEvent.click(cnpjButton);

    expect(writeTextMock).toHaveBeenCalledWith('02.202.294/0001-60');
    expect(await screen.findByText('CNPJ copiado')).toBeInTheDocument();
  });
});
