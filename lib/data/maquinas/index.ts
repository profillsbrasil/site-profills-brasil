import { envasadoraStandUpPouchSpeed } from './envasadora-stand-up-pouch-speed';
import type { MaquinaCatalogo } from './types';

export * from './types';
export { maquinaRedirects } from './redirects';

export const maquinasCatalogo: MaquinaCatalogo[] = [
  envasadoraStandUpPouchSpeed
];

export function getMaquinaBySlug(slug: string): MaquinaCatalogo | undefined {
  return maquinasCatalogo.find((m) => m.slug === slug);
}
