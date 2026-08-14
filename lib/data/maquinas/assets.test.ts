import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Tabela mestra: .superpowers/sdd/2026-08-13-pagina-maquina-fases1-2-assets-dados/tabelas.md
// Slugs #34 e #35 (linha de produção completa / automação) não têm foto — fora desta lista.
const SLUGS_COM_FOTO = [
  'envasadora-stand-up-pouch-speed',
  'envasadora-stand-up-pouch-pre-formado-com-tampa',
  'envasadora-pouch-compacta-pre-formado',
  'envasadora-mini-stand-up-pouch',
  'envasadora-seladora-bisnagas',
  'envasadora-gable-top-gt',
  'envasadora-caixas-assepticas-leite-sucos',
  'envasadora-rotativa-potes-copos',
  'envasadora-stand-up-pouch-cartonado',
  'envasadora-saches-liquidos-linha-tp',
  'envasadora-saches-liquidos-tp-4-vias',
  'envasadora-saches-4-soldas-tc4s-1-via',
  'envasadora-saches-4-soldas-tc4s-2-vias',
  'envasadora-saches-4-soldas-tc4s-3-vias',
  'envasadora-saches-formatados-tc4s-3-vias',
  'envasadora-saches-3-soldas-pos-solidos-tc3sc',
  'envasadora-saches-3-soldas-liquidos-tc3sc',
  'envasadora-stick-tc3sc-1-a-4-vias',
  'envasadora-saches-3-soldas-tc3sl',
  'envasadora-saches-pos-solidos-tcv',
  'enfardadeira-produtos-acabados-tc4u',
  'empacotadeira-vertical-ptc-speed',
  'envasadora-bags-liquidos-tc3sc',
  'embaladora-horizontal-flowpack',
  'envasadora-horizontal-linear-frascos',
  'envasadora-horizontal-tribloc-frascos',
  'envasadora-horizontal-rotativa-frascos',
  'envasadora-frascos-tubulares',
  'envasadora-horizontal-galoes-25-litros',
  'envasadora-linear-frascos-fechamento-automatico',
  'envasadora-semiautomatica-baldes',
  'maquina-lavagem-galoes',
  'envolvedora-overlap-embalagens-pet'
];

const CATALOGO_DIR = path.join(process.cwd(), 'lib/images/catalogo2026');
const PRODUTOS = ['graos', 'liquidos', 'pastosos', 'pos', 'solidos'];

describe('assets do catálogo 2026', () => {
  it('tem 33 slugs com foto na tabela mestra', () => {
    expect(SLUGS_COM_FOTO.length).toBe(33);
    expect(new Set(SLUGS_COM_FOTO).size).toBe(33);
  });

  it.each(SLUGS_COM_FOTO)('imagem de máquina existe para %s', (slug) => {
    const arquivo = path.join(CATALOGO_DIR, 'maquinas', `${slug}.webp`);
    expect(fs.existsSync(arquivo)).toBe(true);
  });

  it.each(SLUGS_COM_FOTO)('imagem de embalagem existe para %s', (slug) => {
    const arquivo = path.join(CATALOGO_DIR, 'embalagens', `${slug}.webp`);
    expect(fs.existsSync(arquivo)).toBe(true);
  });

  it.each(PRODUTOS)('imagem de produto %s.webp existe', (nome) => {
    const arquivo = path.join(CATALOGO_DIR, 'produtos', `${nome}.webp`);
    expect(fs.existsSync(arquivo)).toBe(true);
  });

  it('nenhum .png restou em produtos/', () => {
    const arquivos = fs.readdirSync(path.join(CATALOGO_DIR, 'produtos'));
    expect(arquivos.filter((f) => f.endsWith('.png'))).toEqual([]);
  });
});
