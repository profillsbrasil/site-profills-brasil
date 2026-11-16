import { maquinasCatalogo } from './index';
import { montarVitrinesDoMenu } from './menu';
import { categoriasCatalogo } from './types';
import { describe, expect, it } from 'vitest';

describe('montarVitrinesDoMenu', () => {
  const vitrines = montarVitrinesDoMenu();
  const porSlug = new Map(maquinasCatalogo.map((m) => [m.slug, m]));

  it('tem uma entrada para "todas" e para cada categoria', () => {
    expect(Object.keys(vitrines).sort()).toEqual(
      ['todas', ...categoriasCatalogo].sort()
    );
  });

  it('"todas" mostra a primeira máquina com foto do registry', () => {
    const primeira = maquinasCatalogo.find((m) => m.imagens);
    expect(vitrines.todas.vitrine?.slug).toBe(primeira?.slug);
  });

  it('cada categoria mostra a primeira máquina com foto dela, ou null', () => {
    for (const categoria of categoriasCatalogo) {
      const esperada = maquinasCatalogo.find(
        (m) => m.categoria === categoria && m.imagens
      );

      expect(vitrines[categoria].vitrine?.slug ?? null).toBe(
        esperada?.slug ?? null
      );
      expect(vitrines[categoria].vitrine?.imagem ?? null).toBe(
        esperada?.imagens?.maquina ?? null
      );
    }
  });

  it('o subtítulo é a parte após " - " do nome completo', () => {
    const { vitrine } = vitrines.todas;
    const maquina = vitrine && porSlug.get(vitrine.slug);
    expect(maquina?.nomeCompleto).toContain(` - ${vitrine?.subtitulo}`);
  });

  it('"todas" conta o catálogo inteiro e as categorias somam esse total', () => {
    const soma = categoriasCatalogo.reduce(
      (acc, categoria) => acc + vitrines[categoria].total,
      0
    );

    expect(vitrines.todas.total).toBe(maquinasCatalogo.length);
    expect(soma).toBe(vitrines.todas.total);
  });
});
