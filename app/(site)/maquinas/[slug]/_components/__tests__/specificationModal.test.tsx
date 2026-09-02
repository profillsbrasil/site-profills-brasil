import { registrarLeadIndicacao } from '@/lib/analytics/indicacao';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SpecificationModal from '../specificationModal';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/analytics/indicacao', () => ({
  registrarLeadIndicacao: vi.fn()
}));

/** Preenche e envia o formulário do modal. */
async function enviarFormulario() {
  const user = userEvent.setup();
  render(
    <SpecificationModal
      maquinaSlug='linha-producao-completa-envase'
      maquinaNome='Linha de Produção Ponta a Ponta'
    />
  );

  await user.click(
    screen.getByRole('button', {
      name: /Solicitar proposta técnica e comercial/i
    })
  );

  await user.type(screen.getByLabelText(/Nome Completo/i), 'Fulano Teste');
  await user.type(screen.getByLabelText(/E-mail/i), 'fulano@example.com');
  await user.type(screen.getByLabelText(/Telefone/i), '11999998888');

  await user.click(screen.getByRole('button', { name: /Enviar solicitação/i }));
}

describe('SpecificationModal', () => {
  beforeEach(() => {
    vi.mocked(registrarLeadIndicacao).mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('envia o payload com maquinaSlug para máquina sem legacyId', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    render(
      <SpecificationModal
        maquinaSlug='linha-producao-completa-envase'
        maquinaNome='Linha de Produção Ponta a Ponta'
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: /Solicitar proposta técnica e comercial/i
      })
    );

    await user.type(screen.getByLabelText(/Nome Completo/i), 'Fulano Teste');
    await user.type(screen.getByLabelText(/E-mail/i), 'fulano@example.com');
    await user.type(screen.getByLabelText(/Telefone/i), '11999998888');

    await user.click(
      screen.getByRole('button', { name: /Enviar solicitação/i })
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body as string);
    expect(body).toMatchObject({
      maquinaSlug: 'linha-producao-completa-envase',
      maquinaNome: 'Linha de Produção Ponta a Ponta'
    });
  });

  it('registra o lead com o código devolvido pela rota', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          indicacao: { codigo: 'MARIA-10' }
        })
      })
    );

    await enviarFormulario();

    await waitFor(() => {
      expect(registrarLeadIndicacao).toHaveBeenCalledWith(
        'especificacoes',
        'MARIA-10'
      );
    });
  });

  it('não registra lead quando a rota responde 500', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ success: false })
    });
    vi.stubGlobal('fetch', fetchMock);

    await enviarFormulario();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    expect(registrarLeadIndicacao).not.toHaveBeenCalled();
  });
});
