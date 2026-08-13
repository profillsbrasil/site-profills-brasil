/**
 * Mapa id antigo → slug novo. Fonte única dos redirects 301.
 * SEM imports de imagem/registry: este módulo é consumido pelo next.config.ts.
 * Fase 2 completa os 32 ids restantes (id18 → /maquinas é caso especial no config).
 */
export const maquinaRedirects: { legacyId: number; slug: string }[] = [
  { legacyId: 16, slug: 'envasadora-stand-up-pouch-speed' }
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
