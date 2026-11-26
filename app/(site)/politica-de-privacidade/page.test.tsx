import { render, screen, within } from '@testing-library/react';

import PoliticaDePrivacidade from './page';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({ default: 'img' }));

describe('Política de Privacidade', () => {
  it('mostra as dez seções numeradas, na ordem do texto', () => {
    render(<PoliticaDePrivacidade />);

    const titulos = screen
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent);

    expect(titulos).toEqual([
      'Quais dados coletamos',
      'Para que usamos os dados',
      'Com quem compartilhamos',
      'Aplicativo interno de métricas das redes sociais',
      'Por quanto tempo guardamos',
      'Segurança',
      'Seus direitos',
      'Cookies',
      'Contato',
      'Alterações',
      'Quer falar sobre os seus dados?'
    ]);
  });

  it('o índice da capa leva a cada seção', () => {
    render(<PoliticaDePrivacidade />);

    const indice = screen.getByRole('navigation', {
      name: 'Seções da política'
    });

    const destinos = within(indice)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'));

    expect(destinos).toHaveLength(10);

    for (const destino of destinos) {
      expect(document.querySelector(String(destino))).not.toBeNull();
    }
  });

  it('as referências a outra seção são links para ela', () => {
    render(<PoliticaDePrivacidade />);

    expect(screen.getByRole('link', { name: 'seção 4' })).toHaveAttribute(
      'href',
      '#aplicativo-de-metricas'
    );
    expect(screen.getByRole('link', { name: 'seção 9' })).toHaveAttribute(
      'href',
      '#contato'
    );
  });

  it('o contato abre o e-mail e o WhatsApp de privacidade', () => {
    render(<PoliticaDePrivacidade />);

    expect(
      screen.getByRole('link', { name: /dev@profills\.com/ })
    ).toHaveAttribute('href', 'mailto:dev@profills.com');
    expect(
      screen.getByRole('link', { name: /\+55 41 99785-1998/ })
    ).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/5541997851998')
    );
  });

  it('a revogação do Google é um link para a página de permissões', () => {
    render(<PoliticaDePrivacidade />);

    expect(
      screen.getByRole('link', { name: 'myaccount.google.com/permissions' })
    ).toHaveAttribute('href', 'https://myaccount.google.com/permissions');
  });
});
