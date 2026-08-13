import { buildMaquinaRedirects } from './redirects';
import { describe, expect, it } from 'vitest';

describe('buildMaquinaRedirects', () => {
  it('gera 301 de id antigo para slug', () => {
    const redirects = buildMaquinaRedirects();
    expect(redirects).toContainEqual({
      source: '/maquinas/16',
      destination: '/maquinas/envasadora-stand-up-pouch-speed',
      permanent: true
    });
  });

  it('redireciona a Doypack removida (id 18) para a listagem', () => {
    expect(buildMaquinaRedirects()).toContainEqual({
      source: '/maquinas/18',
      destination: '/maquinas',
      permanent: true
    });
  });
});
