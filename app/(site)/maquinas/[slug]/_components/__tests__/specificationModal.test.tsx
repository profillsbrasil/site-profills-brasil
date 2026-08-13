import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SpecificationModal from '../specificationModal';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('SpecificationModal', () => {
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
});
