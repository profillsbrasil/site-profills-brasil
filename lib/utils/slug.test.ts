import { LIMITE_SLUG, gerarSlug, slugValido } from './slug';
import { describe, expect, it } from 'vitest';

const nenhum = new Set<string>();

describe('gerarSlug', () => {
  it('tira acento, põe em minúsculas e troca espaço e pontuação por hífen', () => {
    expect(
      gerarSlug('Envasadora Gable Top: troca de formato em 15 min!', nenhum)
    ).toBe('envasadora-gable-top-troca-de-formato-em-15-min');
    expect(gerarSlug('Ção, ÁGUA e pêssego', nenhum)).toBe('cao-agua-e-pessego');
  });

  it('corta em 60 caracteres sem deixar hífen no fim', () => {
    const slug = gerarSlug(`${'a'.repeat(59)} b c d`, nenhum);

    expect(slug).toBe('a'.repeat(59));
    expect(slug.length).toBeLessThanOrEqual(LIMITE_SLUG);
  });

  it('dá sufixo -2, -3 quando o slug já existe', () => {
    expect(gerarSlug('Feira Fispal', new Set(['feira-fispal']))).toBe(
      'feira-fispal-2'
    );
    expect(
      gerarSlug('Feira Fispal', new Set(['feira-fispal', 'feira-fispal-2']))
    ).toBe('feira-fispal-3');
  });

  it('mantém o slug com sufixo dentro do limite', () => {
    const longo = 'x'.repeat(LIMITE_SLUG);
    const slug = gerarSlug(longo, new Set([longo]));

    expect(slug).toBe(`${'x'.repeat(LIMITE_SLUG - 2)}-2`);
  });

  it('usa sem-titulo quando o título não tem letra nem número', () => {
    expect(gerarSlug('   ?!  ', nenhum)).toBe('sem-titulo');
  });

  it('gera sempre um slug válido', () => {
    for (const titulo of ['../../etc/passwd', 'a/b\\c', 'Nº 1 — "teste"']) {
      expect(slugValido(gerarSlug(titulo, nenhum))).toBe(true);
    }
  });
});

describe('slugValido', () => {
  it('recusa caminho, barra, maiúscula e hífen solto', () => {
    for (const slug of [
      '..',
      '../x',
      'a/b',
      'a\\b',
      'Post',
      '-a',
      'a-',
      'a--b',
      '',
      'a.json'
    ]) {
      expect(slugValido(slug)).toBe(false);
    }
  });

  it('recusa slug acima do limite', () => {
    expect(slugValido('a'.repeat(LIMITE_SLUG))).toBe(true);
    expect(slugValido('a'.repeat(LIMITE_SLUG + 1))).toBe(false);
  });
});
