/**
 * Mapa id antigo → slug novo. Fonte única dos redirects 301.
 * SEM imports de imagem/registry: este módulo é consumido pelo next.config.ts.
 * Fase 2 completa os 32 ids restantes (id18 → /maquinas é caso especial no config).
 */
export const maquinaRedirects: { legacyId: number; slug: string }[] = [
  { legacyId: 16, slug: 'envasadora-stand-up-pouch-speed' }
];
