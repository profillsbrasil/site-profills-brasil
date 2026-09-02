import { IndicacaoProvider } from '@/components/indicacao/indicacaoProvider';
import { render, screen } from '@testing-library/react';

import Footer from './footer';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/ui/blur-fade', () => ({
  BlurFade: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));
vi.mock('./gridPatternBg', () => ({ GridPattern: () => null }));
// next/image exige width/height quando o import estático vira string no jsdom;
// mesmo mock usado nos testes de listagem/relacionadas.
vi.mock('next/image', () => ({ default: 'img' }));

function jwtFalso(payload: unknown) {
  const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
  return `${b64('{"alg":"HS256"}')}.${b64(JSON.stringify(payload))}.x`;
}

afterEach(() => {
  document.cookie = 'profills_indicacao=; max-age=0; path=/';
});

function renderFooter() {
  return render(
    <IndicacaoProvider>
      <Footer />
    </IndicacaoProvider>
  );
}

describe('Footer', () => {
  it('sem Indicação mostra os contatos padrão nos três cards', () => {
    renderFooter();
    expect(
      screen.getByText('comercial@profillsdobrasil.com.br')
    ).toBeInTheDocument();
    expect(
      screen.getByText('suporte@profillsdobrasil.com.br')
    ).toBeInTheDocument();
    const vendas = screen.getByLabelText(
      'Conversar no WhatsApp com Vendas/Peças'
    );
    expect(vendas).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5541997851998')
    );
  });

  it('com Indicação troca só o card Vendas/Peças', () => {
    document.cookie = `profills_indicacao=${jwtFalso({
      codigo: 'MARIA-10',
      nome: 'Maria Silva',
      email: 'maria@profills.com.br',
      contato: '11987654321',
      consultadoEm: '2026-09-02T12:00:00.000Z'
    })}; path=/`;
    renderFooter();

    // O label vive num <span> dentro do <a>: o href está no ancestral.
    expect(
      screen.getByText('maria@profills.com.br').closest('a')
    ).toHaveAttribute('href', 'mailto:maria@profills.com.br');
    expect(screen.queryByText('comercial@profillsdobrasil.com.br')).toBeNull();
    expect(
      screen.getByLabelText('Conversar no WhatsApp com Vendas/Peças')
    ).toHaveAttribute('href', expect.stringContaining('wa.me/5511987654321'));
    expect(
      screen.getByLabelText(
        'Conversar no WhatsApp com Suporte e Assistência Técnica'
      )
    ).toHaveAttribute('href', expect.stringContaining('wa.me/5541997851998'));
    expect(
      screen.getByText('suporte@profillsdobrasil.com.br')
    ).toBeInTheDocument();
  });
});
