import { maquinasCatalogo } from '@/lib/data/maquinas';

import MaquinasPage from '../page';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// Reproduz o comportamento do Next no prerender estático: useSearchParams
// lança um bailout para CSR, e a subárvore dentro do Suspense mais próximo
// é substituída pelo fallback no HTML. Se algum componente da grade voltar a
// chamar o hook, este teste fica vermelho de novo (issue #30).
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/maquinas',
  useSearchParams: () => {
    throw new Error('BAILOUT_TO_CLIENT_SIDE_RENDERING');
  }
}));

describe('/maquinas (HTML servido)', () => {
  const html = renderToStaticMarkup(<MaquinasPage />);

  it('serve os 35 cards do catálogo no HTML, sem depender de hidratação', () => {
    expect(maquinasCatalogo.length).toBe(35);
    for (const maquina of maquinasCatalogo) {
      expect(html).toContain(`>${maquina.nome}<`);
    }
  });

  it('não serve o fallback "Carregando..." no lugar da grade', () => {
    expect(html).not.toContain('Carregando');
  });
});
