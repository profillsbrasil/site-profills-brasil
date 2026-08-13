import { render, screen } from '@testing-library/react';

import { EscopoEngenharia } from '../escopoEngenharia';
import { describe, expect, it } from 'vitest';

const conteudo = {
  escopo:
    'Solução completa de linha de envase, integrando alimentação, dosagem, selagem e paletização em um único fluxo automatizado, dimensionado conforme o layout da planta.',
  blocos: [
    { rotulo: 'Alimentação', valor: 'Dosadora gravimétrica multicabeças' },
    { rotulo: 'Envase', valor: 'Envasadora rotativa servo-controlada' },
    { rotulo: 'Paletização', valor: 'Robô antropomórfico 6 eixos' }
  ]
};

describe('EscopoEngenharia', () => {
  it('renderiza o título, o parágrafo de escopo e todos os blocos', () => {
    render(<EscopoEngenharia conteudo={conteudo} />);
    expect(
      screen.getByRole('heading', { name: 'Escopo da solução' })
    ).toBeInTheDocument();
    expect(screen.getByText(conteudo.escopo)).toBeInTheDocument();
    for (const bloco of conteudo.blocos) {
      expect(screen.getByText(bloco.rotulo)).toBeInTheDocument();
      expect(screen.getByText(bloco.valor)).toBeInTheDocument();
    }
  });

  it('renderiza a seção com a âncora #escopo', () => {
    const { container } = render(<EscopoEngenharia conteudo={conteudo} />);
    expect(container.querySelector('section#escopo')).not.toBeNull();
  });
});
