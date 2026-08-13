import { buildMaquinaRedirects, maquinaRedirects } from './redirects';
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

  it.each([
    [1, 'envasadora-saches-liquidos-linha-tp'],
    [17, 'envasadora-linear-frascos-fechamento-automatico'],
    [33, 'envasadora-frascos-tubulares']
  ])('redireciona id %i para %s', (legacyId, slug) => {
    expect(buildMaquinaRedirects()).toContainEqual({
      source: `/maquinas/${legacyId}`,
      destination: `/maquinas/${slug}`,
      permanent: true
    });
  });

  it('tem 32 entradas com legacyIds únicos e sem o id 18', () => {
    expect(maquinaRedirects).toHaveLength(32);
    const legacyIds = maquinaRedirects.map((r) => r.legacyId);
    expect(new Set(legacyIds).size).toBe(legacyIds.length);
    expect(legacyIds).not.toContain(18);
  });
});
