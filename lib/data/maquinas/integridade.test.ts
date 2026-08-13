import { getMaquinaBySlug, maquinasCatalogo } from './index';
import { maquinaRedirects } from './redirects';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('integridade do registry de máquinas', () => {
  it('tem slugs únicos', () => {
    const slugs = maquinasCatalogo.map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('tem SEO completo em todas as máquinas', () => {
    for (const m of maquinasCatalogo) {
      expect(m.seo.titulo.length, m.slug).toBeGreaterThan(0);
      expect(m.seo.descricao.length, m.slug).toBeGreaterThan(0);
    }
  });

  it('máquinas padrão têm specs e imagens; engenharia tem conteudoEngenharia', () => {
    for (const m of maquinasCatalogo) {
      if (m.tipoPagina === 'padrao') {
        expect(m.specsMaquina.length, m.slug).toBeGreaterThan(0);
        expect(m.specsEmbalagem.length, m.slug).toBeGreaterThan(0);
        expect(m.imagens, m.slug).toBeDefined();
      } else {
        expect(m.conteudoEngenharia, m.slug).toBeDefined();
      }
    }
  });

  it('todo glb declarado existe em public/', () => {
    for (const m of maquinasCatalogo) {
      if (!m.embalagem3d) continue;
      const arquivo = path.join(process.cwd(), 'public', m.embalagem3d.glb);
      expect(fs.existsSync(arquivo), m.embalagem3d.glb).toBe(true);
    }
  });

  it('toda máquina com legacyId tem redirect no mapa', () => {
    // Nesta fase o mapa de redirects (32 entradas) já cobre todos os ids
    // 1–33 (exceto 18), mas o registry ainda só tem o piloto (id 16) — a
    // checagem redirect→registry (destino existe no registry) só faz
    // sentido a partir da Task 4 e vive no it.todo abaixo.
    for (const m of maquinasCatalogo) {
      if (m.legacyId === undefined) continue;
      expect(
        maquinaRedirects.some((r) => r.legacyId === m.legacyId),
        m.slug
      ).toBe(true);
    }
  });

  it('cobertura total: ids 1-17 e 19-33 redirecionam para slugs existentes no registry', () => {
    const idsEsperados = [
      ...Array.from({ length: 17 }, (_, i) => i + 1),
      ...Array.from({ length: 15 }, (_, i) => i + 19)
    ];
    for (const id of idsEsperados) {
      const redirect = maquinaRedirects.find((r) => r.legacyId === id);
      expect(redirect, `id ${id} sem redirect`).toBeDefined();
      expect(
        getMaquinaBySlug(redirect!.slug),
        `destino do id ${id} (${redirect!.slug}) não existe no registry`
      ).toBeDefined();
    }
    // id 18 (Doypack removida) não tem entrada — vai direto para /maquinas no next.config
    expect(maquinaRedirects.some((r) => r.legacyId === 18)).toBe(false);
  });

  it('getMaquinaBySlug resolve o piloto e rejeita slug inválido', () => {
    expect(getMaquinaBySlug('envasadora-stand-up-pouch-speed')?.nome).toBe(
      'Linha Pouch Speed'
    );
    expect(getMaquinaBySlug('nao-existe')).toBeUndefined();
  });
});
