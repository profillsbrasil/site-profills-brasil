import { enderecoDeEntrada, voltaSegura } from './volta';
import { describe, expect, it } from 'vitest';

describe('volta do login', () => {
  it.each(['/admin/blog', '/admin/blog/novo', '/admin/blog/catalogo-novo'])(
    'aceita %s',
    (caminho) => {
      expect(voltaSegura(caminho)).toBe(caminho);
    }
  );

  it.each([
    null,
    undefined,
    '',
    '/',
    '/blog',
    'https://golpe.exemplo/admin/blog',
    '//golpe.exemplo/admin/',
    '/admin/../api/x',
    '/admin\\golpe.exemplo',
    '/admin/blog?x=1',
    '/admin/blog#x',
    ['/admin/blog']
  ])('troca %j pela lista de posts', (valor) => {
    expect(voltaSegura(valor)).toBe('/admin/blog');
  });

  it('monta o endereço relativo do login', () => {
    expect(enderecoDeEntrada('/admin/blog/novo')).toBe(
      '/admin/entrar?volta=%2Fadmin%2Fblog%2Fnovo'
    );
  });
});
