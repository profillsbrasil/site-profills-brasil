/**
 * Mapa id antigo → slug novo. Fonte única dos redirects 301.
 * SEM imports de imagem/registry: este módulo é consumido pelo next.config.ts.
 * Cobre os 32 legacyIds 1–17 e 19–33 (id18 → /maquinas é caso especial via
 * REDIRECT_REMOVIDAS, abaixo). Fonte: tabela mestra do spec (tabelas.md).
 */
export const maquinaRedirects: { legacyId: number; slug: string }[] = [
  { legacyId: 1, slug: 'envasadora-saches-liquidos-linha-tp' },
  { legacyId: 2, slug: 'envasadora-saches-4-soldas-tc4s-1-via' },
  { legacyId: 3, slug: 'envasadora-saches-4-soldas-tc4s-2-vias' },
  { legacyId: 4, slug: 'envasadora-saches-4-soldas-tc4s-3-vias' },
  { legacyId: 5, slug: 'envasadora-saches-liquidos-tp-4-vias' },
  { legacyId: 6, slug: 'envasadora-saches-formatados-tc4s-3-vias' },
  { legacyId: 7, slug: 'envasadora-saches-3-soldas-pos-solidos-tc3sc' },
  { legacyId: 8, slug: 'envasadora-saches-3-soldas-liquidos-tc3sc' },
  { legacyId: 9, slug: 'envasadora-stick-tc3sc-1-a-4-vias' },
  { legacyId: 10, slug: 'envasadora-saches-3-soldas-tc3sl' },
  { legacyId: 11, slug: 'envasadora-saches-pos-solidos-tcv' },
  { legacyId: 12, slug: 'envasadora-horizontal-linear-frascos' },
  { legacyId: 13, slug: 'envasadora-horizontal-tribloc-frascos' },
  { legacyId: 14, slug: 'envasadora-horizontal-rotativa-frascos' },
  { legacyId: 15, slug: 'envasadora-horizontal-galoes-25-litros' },
  { legacyId: 16, slug: 'envasadora-stand-up-pouch-speed' },
  { legacyId: 17, slug: 'envasadora-linear-frascos-fechamento-automatico' },
  { legacyId: 19, slug: 'envasadora-semiautomatica-baldes' },
  { legacyId: 20, slug: 'envasadora-stand-up-pouch-pre-formado-com-tampa' },
  { legacyId: 21, slug: 'envasadora-mini-stand-up-pouch' },
  { legacyId: 22, slug: 'enfardadeira-produtos-acabados-tc4u' },
  { legacyId: 23, slug: 'empacotadeira-vertical-ptc-speed' },
  { legacyId: 24, slug: 'envasadora-bags-liquidos-tc3sc' },
  { legacyId: 25, slug: 'embaladora-horizontal-flowpack' },
  { legacyId: 26, slug: 'envasadora-seladora-bisnagas' },
  { legacyId: 27, slug: 'envasadora-gable-top-gt' },
  { legacyId: 28, slug: 'envasadora-caixas-assepticas-leite-sucos' },
  { legacyId: 29, slug: 'maquina-lavagem-galoes' },
  { legacyId: 30, slug: 'envolvedora-overlap-embalagens-pet' },
  { legacyId: 31, slug: 'envasadora-stand-up-pouch-cartonado' },
  { legacyId: 32, slug: 'envasadora-rotativa-potes-copos' },
  { legacyId: 33, slug: 'envasadora-frascos-tubulares' }
];

/** id 18 (Doypack) saiu do catálogo 2026 — decisão 4 do spec. */
const REDIRECT_REMOVIDAS = [
  { source: '/maquinas/18', destination: '/maquinas' }
];

export function buildMaquinaRedirects() {
  return [
    ...maquinaRedirects.map((r) => ({
      source: `/maquinas/${r.legacyId}`,
      destination: `/maquinas/${r.slug}`,
      permanent: true
    })),
    ...REDIRECT_REMOVIDAS.map((r) => ({ ...r, permanent: true }))
  ];
}
