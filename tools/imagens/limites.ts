import { readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

// Maior largura de deviceSizes no Next 16 (node_modules/next/dist/shared/lib/image-config.js); o next.config.ts não muda a lista.
export const LARGURA_MAXIMA = 3840;

// Check Weigher.png (9,5 MiB, 3381 px) é o maior original que a recompressão lossless não reduziu em 10%.
export const TETO_BYTES = 10 * 1024 * 1024;

// Medido com tools/imagens/recomprimir.ts em 16/11/2026. A entrada sai quando o arquivo for reduzido ou apagado.
export const EXCECOES = {
  'lib/images/novasImagens/Nimco.png':
    'reduzir para 3840 px deixa o derivado de 1920 com SSIM 0,984',
  'lib/images/novasImagens/Linha para fabricação de gelo em gel.png':
    'reduzir para 3840 px deixa o derivado de 1920 com SSIM 0,978',
  'lib/images/novasImagens/rotativa de pouch com formadora.png':
    'reduzir para 3840 px deixa o derivado de 1920 com SSIM 0,9899',
  'lib/images/extras/FabricaLinhaCompleta.png':
    'reduzir para 3840 px deixa o derivado de 1920 com SSIM 0,9875',
  'lib/images/logoClientes/petruz.png':
    'reduzir para 3840 px deixa o derivado de 1920 com SSIM 0,9889',
  'lib/images/logoClientes/verduranet.png':
    'PNG com paleta: reduzido vira truecolor de 532 KiB contra 227 KiB',
  'lib/images/novasImagens/maquinasEmbalagens/maquinas/TP85.png':
    'PNG com paleta: reduzido vira truecolor de 4.111 KiB contra 1.159 KiB',
  'lib/images/novasImagens/maquinasEmbalagens/maquinas/tc-4s-204-360-3.png':
    'PNG com paleta: reduzido vira truecolor de 3.985 KiB contra 1.044 KiB'
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
