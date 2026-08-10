import { AUTOPLAY_MS, SLIDES } from '../slideData';
import { describe, expect, it } from 'vitest';

describe('SLIDES do hero-carrossel', () => {
  it('tem exatamente os 4 slides aprovados, na ordem TP → TC4s → Stick → Pouch', () => {
    expect(SLIDES).toHaveLength(4);
    expect(SLIDES[0].nome).toBe('Linha TP');
    expect(SLIDES[1].nome).toBe('Linha TC4s');
    expect(SLIDES[2].nome).toBe('Linha Stick');
    expect(SLIDES[3].nome).toBe('Linha Pouch');
  });

  it('produção sempre leva prefixo "até" (capacidade varia por embalagem)', () => {
    for (const slide of SLIDES) {
      const producao = slide.specs.find((s) => s.label === 'Produção');
      expect(producao?.prefixo).toBe('até');
    }
  });

  it('cada slide aponta para a rota da sua máquina', () => {
    expect(SLIDES[0].rota).toBe('/maquinas/1');
    expect(SLIDES[1].rota).toBe('/maquinas/2');
    expect(SLIDES[2].rota).toBe('/maquinas/9');
    expect(SLIDES[3].rota).toBe('/maquinas/16');
  });

  it('títulos têm exatamente 2 linhas (quebra controlada)', () => {
    for (const slide of SLIDES) {
      expect(slide.titulo).toHaveLength(2);
    }
  });

  it('autoplay é 7s', () => {
    expect(AUTOPLAY_MS).toBe(7000);
  });
});
