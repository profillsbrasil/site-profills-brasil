import { render, screen } from '@testing-library/react';

import { BotaoEspecialista } from './botaoEspecialista';
import { IndicacaoProvider } from './indicacaoProvider';
import { afterEach, describe, expect, it } from 'vitest';

function jwtFalso(payload: unknown) {
  const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
  return `${b64('{"alg":"HS256"}')}.${b64(JSON.stringify(payload))}.x`;
}

afterEach(() => {
  document.cookie = 'profills_indicacao=; max-age=0; path=/';
});

describe('BotaoEspecialista', () => {
  it('sem Indicação aponta para o número padrão com a mensagem', () => {
    render(
      <IndicacaoProvider>
        <BotaoEspecialista
          mensagem='Olá! Tenho interesse na X.'
          className='btn'
        />
      </IndicacaoProvider>
    );
    const link = screen.getByRole('link', {
      name: 'Falar com um especialista'
    });
    expect(link).toHaveAttribute(
      'href',
      'https://wa.me/5541997851998?text=Ol%C3%A1!%20Tenho%20interesse%20na%20X.'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveClass('btn');
  });

  it('com Indicação aponta para o vendedor', () => {
    document.cookie = `profills_indicacao=${jwtFalso({
      codigo: 'MARIA-10',
      nome: 'Maria',
      email: 'maria@profills.com.br',
      contato: '11987654321',
      consultadoEm: '2026-09-02T12:00:00.000Z'
    })}; path=/`;
    render(
      <IndicacaoProvider>
        <BotaoEspecialista mensagem='Oi' className='btn' />
      </IndicacaoProvider>
    );
    expect(
      screen.getByRole('link', { name: 'Falar com um especialista' })
    ).toHaveAttribute('href', 'https://wa.me/5511987654321?text=Oi');
  });
});
