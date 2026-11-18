import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';

const PASTA_DE_IMAGENS = 'lib/images';
const PASTAS_DE_CODIGO = ['app', 'components', 'lib', 'public'];

const EXTENSOES_DE_CODIGO = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.css',
  '.json',
  '.md',
  '.mdx',
  '.svg',
  '.html',
  '.webmanifest'
]);

const CITACAO = /'([^'\n]+)'|"([^"\n]+)"|`([^`]+)`|url\(\s*([^)'"\s]+)\s*\)/g;

async function listarArquivos(pasta: string) {
  const entradas = await readdir(pasta, {
    withFileTypes: true,
    recursive: true
  });

  return entradas
    .filter((e) => e.isFile())
    .map((e) => join(e.parentPath, e.name).normalize('NFC'));
}

function resolver(citacao: string, origem: string) {
  if (citacao.startsWith('@/')) return normalize(citacao.slice(2));

  if (citacao.startsWith('./') || citacao.startsWith('../')) {
    return normalize(join(dirname(origem), citacao));
  }

  const indice = citacao.indexOf(`${PASTA_DE_IMAGENS}/`);

  return indice === -1 ? undefined : normalize(citacao.slice(indice));
}

function padraoDoTemplate(caminho: string) {
  const partes = caminho.split(/\$\{[^}]*\}/);

  if (partes.length === 1) return undefined;

  const escapar = (s: string) => s.replace(/[.*+?^()|[\]\\]/g, '\\$&');

  return new RegExp(`^${partes.map(escapar).join('[^/]+')}$`);
}

/** Imagens de `lib/images` que nenhum arquivo de `app/`, `components/`, `lib/` ou `public/` cita; um template com `${}` cobre todas as imagens que casam com ele. */
export async function listarOrfas() {
  const imagens = await listarArquivos(PASTA_DE_IMAGENS);

  const fontes = (await Promise.all(PASTAS_DE_CODIGO.map(listarArquivos)))
    .flat()
    .filter(
      (f) =>
        !f.startsWith(`${PASTA_DE_IMAGENS}/`) &&
        EXTENSOES_DE_CODIGO.has(extname(f).toLowerCase())
    );

  const textos = await Promise.all(
    fontes.map(async (fonte) => ({
      fonte,
      texto: (await readFile(fonte, 'utf8')).normalize('NFC')
    }))
  );

  const citadas = new Set<string>();
  const padroes: RegExp[] = [];

  for (const { fonte, texto } of textos) {
    for (const m of texto.matchAll(CITACAO)) {
      const caminho = resolver(m[1] ?? m[2] ?? m[3] ?? m[4], fonte);

      if (!caminho?.startsWith(`${PASTA_DE_IMAGENS}/`)) continue;

      const padrao = padraoDoTemplate(caminho);

      if (padrao) padroes.push(padrao);
      else citadas.add(caminho);
    }
  }

  return imagens
    .filter((i) => !citadas.has(i) && !padroes.some((p) => p.test(i)))
    .sort();
}

if (import.meta.main) {
  const orfas = await listarOrfas();

  for (const o of orfas) process.stdout.write(`${o}\n`);
  process.stderr.write(`${orfas.length} órfãs em ${PASTA_DE_IMAGENS}\n`);
}
