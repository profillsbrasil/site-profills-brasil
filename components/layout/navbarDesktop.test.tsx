import NavbarDesktop from '@/components/layout/navbarDesktop';
import { montarVitrinesDoMenu } from '@/lib/data/maquinas/menu';
import { render, screen } from '@testing-library/react';

import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/sobre' }));

vi.mock('next/image', () => ({ default: 'img' }));

describe('logo da navbar desktop', () => {
  it('não arrasta nem entra na seleção de texto', () => {
    render(<NavbarDesktop vitrines={montarVitrinesDoMenu()} />);

    const logo = screen.getByAltText('Profills, página inicial');
    const link = logo.closest('a');

    expect(logo).toHaveAttribute('draggable', 'false');
    expect(link).toHaveAttribute('draggable', 'false');
    expect(link).toHaveClass('select-none');
  });
});
