import { render, screen } from '@testing-library/react';

import { HeroRings } from '../heroRings';
import { describe, expect, it } from 'vitest';

describe('HeroRings', () => {
  it('renderiza o sistema de anéis com pulso, ping e satélite quando animado', () => {
    render(<HeroRings pingKey={0} />);
    expect(screen.getByTestId('hero-rings')).toBeInTheDocument();
    expect(screen.getAllByTestId('hero-ring-pulso')).toHaveLength(2);
    expect(screen.getByTestId('hero-ring-ping')).toBeInTheDocument();
    expect(screen.getByTestId('hero-ring-satelite')).toBeInTheDocument();
  });

  it('modo estático não renderiza pulso, ping nem satélite', () => {
    render(<HeroRings estatico />);
    expect(screen.getByTestId('hero-rings')).toBeInTheDocument();
    expect(screen.queryAllByTestId('hero-ring-pulso')).toHaveLength(0);
    expect(screen.queryByTestId('hero-ring-ping')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hero-ring-satelite')).not.toBeInTheDocument();
  });

  it('é decorativo: escondido de leitores de tela', () => {
    render(<HeroRings />);
    expect(screen.getByTestId('hero-rings')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
