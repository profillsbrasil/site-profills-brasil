import { readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

/** Maior largura de `deviceSizes` no Next 16 (`node_modules/next/dist/shared/lib/image-config.js`); o `next.config.ts` não muda a lista. */
export const LARGURA_MAXIMA = 3840;

/** Teto por imagem: `pouch-render-maximo.png` (4,35 MiB depois de recomprimido) é o maior original que o site usa, e a folga até 5 MiB não cabe outro igual. */
export const TETO_BYTES = 5 * 1024 * 1024;

export const EXCECOES = {
  'lib/images/logoClientes/petruz.png':
    'reduzir para 3840 px deixa o derivado de 1920 com SSIM 0,9894',
  'lib/images/logoClientes/verduranet.png':
    'reduzir para 3840 px dá 532 KiB contra 202 KiB na largura original',
  'lib/images/novasImagens/maquinasEmbalagens/maquinas/TP85.png':
    'PNG com paleta: reduzido vira truecolor de 4.111 KiB contra 1.159 KiB'
} satisfies Record<string, string>;

const PASTAS_DE_IMAGENS = ['lib/images', 'public/images'];
const EXTENSOES = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

export async function listarImagens() {
  const entradas = await Promise.all(
    PASTAS_DE_IMAGENS.map((pasta) =>
      readdir(pasta, { withFileTypes: true, recursive: true })
    )
  );

  return entradas
    .flat()
    .filter((e) => e.isFile() && EXTENSOES.has(extname(e.name).toLowerCase()))
    .map((e) => join(e.parentPath, e.name))
    .sort();
}
