import { envasadoraStandUpPouchSpeed as piloto } from '@/lib/data/maquinas/envasadora-stand-up-pouch-speed';
import { render, screen } from '@testing-library/react';

import { Conversao } from '../conversao';
import { describe, expect, it } from 'vitest';

describe('Conversao', () => {
  it('tem o CTA de proposta e o link de especialista no WhatsApp', () => {
    render(<Conversao maquina={piloto} />);
    expect(
      screen.getByRole('button', {
        name: /Solicitar proposta técnica e comercial/i
      })
    ).toBeInTheDocument();
    const wa = screen.getByRole('link', { name: /Falar com um especialista/i });
    expect(wa).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5541997851998')
    );
    expect(wa.getAttribute('href')).toContain(
      encodeURIComponent('Linha Pouch Speed')
    );
  });

  it('não renderiza nenhum link para montar-maquina (CTA proibido)', () => {
    const { container } = render(<Conversao maquina={piloto} />);
    expect(container.querySelector('a[href*="montar-maquina"]')).toBeNull();
  });
});
