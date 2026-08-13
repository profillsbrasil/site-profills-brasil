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

  it('redirects e registry são consistentes nos dois sentidos', () => {
    // todo destino de redirect existe no registry
    for (const r of maquinaRedirects) {
      expect(getMaquinaBySlug(r.slug), `redirect ${r.legacyId}`).toBeDefined();
    }
    // toda máquina com legacyId tem redirect
    for (const m of maquinasCatalogo) {
      if (m.legacyId === undefined) continue;
      expect(
        maquinaRedirects.some((r) => r.legacyId === m.legacyId),
        m.slug
      ).toBe(true);
    }
    // NOTA fase 2: quando as 35 fichas existirem, adicionar asserção de
    // cobertura completa dos ids 1–33 (18 → /maquinas é caso especial no next.config).
  });

  it('getMaquinaBySlug resolve o piloto e rejeita slug inválido', () => {
    expect(getMaquinaBySlug('envasadora-stand-up-pouch-speed')?.nome).toBe(
      'Linha Pouch Speed'
    );
    expect(getMaquinaBySlug('nao-existe')).toBeUndefined();
  });
});
