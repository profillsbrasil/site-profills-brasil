// Uso: node tools/imagens/recomprimir.ts [--aplicar] [arquivo...]. Sem arquivo, revisa lib/images e public/images.
import { LARGURA_MAXIMA, listarImagens } from './limites.ts';
import { ssimPorCanal } from './ssim.ts';
import { execFile } from 'node:child_process';
import { readFile, stat, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SSIM_MINIMO = 0.99;
const LARGURAS_COMPARADAS = [1920, LARGURA_MAXIMA];

// Ganho abaixo de 10% não paga um blob novo no histórico do Git.
const GANHO_MINIMO = 0.1;
const REVISAR_ACIMA_DE_BYTES = 400 * 1024;

// O mesmo pipeline do optimizeImage do Next 16 (node_modules/next/dist/server/image-optimizer.js) na qualidade padrão 75.
const DERIVADOS = [
  { formato: 'webp', codificar: (i: sharp.Sharp) => i.webp({ quality: 75 }) },
  {
    formato: 'avif',
    codificar: (i: sharp.Sharp) => i.avif({ quality: 55, effort: 3 })
  }
];

type Candidato = {
  nome: string;
  codificar: (original: Buffer) => Promise<Buffer>;
};

// Sem -progressive: o JPEG progressivo ganha 3% a mais e deixa a decodificação do sharp 10% mais lenta (cortador.jpg, 1.401 contra 1.274 ms).
function jpegtran(original: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    const processo = execFile(
      'jpegtran',
      ['-copy', 'icc', '-optimize'],
      { encoding: 'buffer', maxBuffer: 256 * 1024 * 1024 },
      (erro, saida) =>
        erro
          ? reject(new Error('jpegtran falhou', { cause: erro }))
          : resolve(saida)
    );

    processo.stdin?.end(original);
  });
}

// Só entram candidatos que deixam os derivados do Next com SSIM >= 0,99. Medido e reprovado:
// WebP lossless e PNG com paleta mudam o RGB dos pixels com alpha 0, que o AVIF e o WebP do Next levam para a borda visível;
// JPEG recodificado, até q97 com 4:4:4, fica em SSIM 0,98 entre derivados.
function candidatos(meta: sharp.Metadata): Candidato[] {
  if (meta.format === 'png') {
    const png = (largura?: number): Candidato => ({
      nome: largura ? 'png' : 'png-largura-original',
      codificar: (original) =>
        sharp(original)
          .rotate()
          .resize(largura, undefined, { withoutEnlargement: true })
          .png({ compressionLevel: 9, adaptiveFiltering: true })
          .toBuffer()
    });

    // O recuo sem resize existe porque reduzir para 3840 muda o derivado de 1920 (resize duplo) e às vezes reprova o SSIM.
    return meta.width > LARGURA_MAXIMA
      ? [png(LARGURA_MAXIMA), png()]
      : [png(LARGURA_MAXIMA)];
  }

  if (meta.format === 'jpeg' && meta.width <= LARGURA_MAXIMA) {
    return [{ nome: 'jpegtran', codificar: jpegtran }];
  }

  return [];
}

async function derivados(original: Buffer) {
  const saida = [];

  for (const largura of LARGURAS_COMPARADAS) {
    for (const { formato, codificar } of DERIVADOS) {
      const imagem = sharp(original)
        .rotate()
        .resize(largura, undefined, { withoutEnlargement: true });

      // oxlint-disable-next-line eslint/no-await-in-loop -- um derivado por vez segura a memória do sharp em imagens de 6640 px
      const codificado = await codificar(imagem).toBuffer();

      // oxlint-disable-next-line eslint/no-await-in-loop
      const { data, info } = await sharp(codificado)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      saida.push({
        chave: `${largura}-${formato}`,
        data,
        width: info.width,
        height: info.height
      });
    }
  }

  return saida;
}

async function avaliar(caminho: string) {
  const original = await readFile(caminho);
  const meta = await sharp(original).metadata();

  const antes = {
    bytes: original.length,
    largura: meta.width,
    altura: meta.height,
    formato: meta.format
  };

  const testados = [];
  const derivadosAntigos = await derivados(original);

  for (const candidato of candidatos(meta)) {
    // oxlint-disable-next-line eslint/no-await-in-loop
    const buffer = await candidato.codificar(original);

    // oxlint-disable-next-line eslint/no-await-in-loop
    const [novosDerivados, metaNova] = await Promise.all([
      derivados(buffer),
      sharp(buffer).metadata()
    ]);

    const comparacoes = derivadosAntigos.map((a, indice) => {
      const b = novosDerivados[indice];
      const mesmasDimensoes = a.width === b.width && a.height === b.height;

      return {
        chave: a.chave,
        mesmasDimensoes,
        ssim: Math.min(...ssimPorCanal(a, b))
      };
    });

    const qualidade = comparacoes.every(
      (c) => c.ssim >= SSIM_MINIMO && c.mesmasDimensoes
    );

    const ganho = buffer.length <= original.length * (1 - GANHO_MINIMO);
    testados.push({
      candidato,
      buffer,
      largura: metaNova.width,
      altura: metaNova.height,
      comparacoes,
      qualidade,
      ganho
    });
  }

  const escolhido = testados
    .filter((t) => t.qualidade && t.ganho)
    .sort((a, b) => a.buffer.length - b.buffer.length)[0];

  return { caminho, antes, testados, escolhido };
}

function linhas({
  caminho,
  antes,
  testados,
  escolhido
}: Awaited<ReturnType<typeof avaliar>>) {
  const kib = (bytes: number) => Math.round(bytes / 1024);
  const inicio = `| ${caminho} | ${antes.formato} ${antes.largura}x${antes.altura} | ${kib(antes.bytes)} |`;

  if (!testados.length) return [`${inicio} sem candidato | | | sem mudança |`];

  return testados.map((t) => {
    const ssim = t.comparacoes
      .map(
        (c) =>
          `${c.chave} ${c.ssim.toFixed(4)}${c.mesmasDimensoes ? '' : ' (dimensão diferente)'}`
      )
      .join(', ');

    const decisao =
      t === escolhido
        ? 'aprovado'
        : !t.qualidade
          ? 'sem mudança: SSIM'
          : 'sem mudança: ganho < 10%';

    return `${inicio} ${t.candidato.nome} ${t.largura}x${t.altura} | ${kib(t.buffer.length)} | ${ssim} | ${decisao} |`;
  });
}

async function foraDoTeto(caminho: string) {
  const [{ size }, { width }] = await Promise.all([
    stat(caminho),
    sharp(caminho).metadata()
  ]);

  return size > REVISAR_ACIMA_DE_BYTES || width > LARGURA_MAXIMA;
}

const argumentos = process.argv.slice(2);
const aplicar = argumentos.includes('--aplicar');
const explicitos = argumentos.filter((a) => !a.startsWith('--'));
const todos = await listarImagens();
const marcados = await Promise.all(todos.map(foraDoTeto));

const arquivos = explicitos.length
  ? explicitos
  : todos.filter((_, i) => marcados[i]);

const imprimir = (linha: string) => process.stdout.write(`${linha}\n`);

imprimir(
  '| arquivo | antes | KiB antes | candidato | KiB depois | SSIM mínimo (RGB pré-multiplicado e alpha) por derivado | decisão |'
);

imprimir('| --- | --- | --- | --- | --- | --- | --- |');

for (const caminho of arquivos) {
  // oxlint-disable-next-line eslint/no-await-in-loop -- uma imagem por vez: Nimco.png decodificado ocupa 141 MB
  const resultado = await avaliar(caminho);

  linhas(resultado).forEach(imprimir);

  if (aplicar && resultado.escolhido) {
    // oxlint-disable-next-line eslint/no-await-in-loop
    await writeFile(caminho, resultado.escolhido.buffer);
  }
}
