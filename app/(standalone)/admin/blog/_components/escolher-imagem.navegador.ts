import { motivosImagem } from '../../../../../lib/blog/erro';
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type Alvo = 'capa' | 'bloco';

type Esperado = { envia: true } | { envia: false; motivo: string };

type Caso = { alvo: Alvo; arquivo: string; esperado: Esperado };

const casos: Caso[] = [
  { alvo: 'capa', arquivo: 'capa.png', esperado: { envia: true } },
  { alvo: 'capa', arquivo: 'foto.jpg', esperado: { envia: true } },
  { alvo: 'bloco', arquivo: 'foto.webp', esperado: { envia: true } },
  {
    alvo: 'capa',
    arquivo: 'grande.png',
    esperado: { envia: false, motivo: motivosImagem.tamanho }
  },
  { alvo: 'bloco', arquivo: 'foto.avif', esperado: { envia: true } },
  {
    alvo: 'bloco',
    arquivo: 'anima.gif',
    esperado: { envia: false, motivo: motivosImagem.tipo }
  },
  { alvo: 'capa', arquivo: 'limite.png', esperado: { envia: true } },
  {
    alvo: 'capa',
    arquivo: 'nota.txt',
    esperado: { envia: false, motivo: motivosImagem.tipo }
  }
];

const seletor: Record<Alvo, string> = {
  capa: 'button[aria-label$="capa do post"]',
  bloco: 'button[aria-label$="imagem do bloco"]'
};

const [urlCdp, pastaImagens, pastaSaida] = process.argv.slice(2);

if (!urlCdp || !pastaImagens || !pastaSaida) {
  throw new Error(
    `Uso, com o editor de um post aberto no Chrome: bun escolher-imagem.navegador.ts <cdp> <imagens> <saida>. A pasta de imagens traz ${casos.map((caso) => caso.arquivo).join(', ')}.`
  );
}

mkdirSync(pastaSaida, { recursive: true });

const socket = new WebSocket(urlCdp);

await new Promise((pronto) => {
  socket.addEventListener('open', pronto);
});

let proximoId = 0;

const pendentes = new Map<
  number,
  (resposta: { result?: unknown; error?: unknown }) => void
>();

socket.addEventListener('message', (evento) => {
  const mensagem = JSON.parse(String(evento.data));
  pendentes.get(mensagem.id)?.(mensagem);
  pendentes.delete(mensagem.id);
});

type Json =
  string | number | boolean | null | Json[] | { [chave: string]: Json };

type ParametrosCdp = { [chave: string]: Json };

async function cdp<T>(
  method: string,
  params: ParametrosCdp = {},
  sessionId?: string
) {
  const id = ++proximoId;

  const resposta = await new Promise<{ result?: unknown; error?: unknown }>(
    (resolver) => {
      pendentes.set(id, resolver);
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    }
  );

  if (resposta.error)
    throw new Error(`${method}: ${JSON.stringify(resposta.error)}`);

  return resposta.result as T;
}

const { targetInfos } = await cdp<{
  targetInfos: { targetId: string; type: string; url: string }[];
}>('Target.getTargets');

const aba = targetInfos.find(
  (t) => t.type === 'page' && t.url.includes('/admin/blog/')
);

if (!aba)
  throw new Error('Nenhuma aba com o editor de um post em /admin/blog/.');

const { sessionId } = await cdp<{ sessionId: string }>(
  'Target.attachToTarget',
  {
    targetId: aba.targetId,
    flatten: true
  }
);

async function naPagina<T>(expressao: string) {
  const { result, exceptionDetails } = await cdp<{
    result: { value: T };
    exceptionDetails?: unknown;
  }>(
    'Runtime.evaluate',
    { expression: expressao, returnByValue: true, awaitPromise: true },
    sessionId
  );

  if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails));

  return result.value;
}

type Estado = {
  fundo: string;
  alerta: string | null;
  status: string;
  previa: { src: string; carregada: boolean }[];
  anuncios: string[];
};

const lerEstado = (alvo: Alvo) =>
  naPagina<Estado>(`(() => {
    const zona = document.querySelector(${JSON.stringify(seletor[alvo])});
    return {
      fundo: zona?.style.backgroundImage ?? '',
      alerta: document.querySelector('[role="alert"]')?.textContent ?? null,
      status: document.querySelector('p[aria-live="polite"]')?.textContent ?? '',
      previa: [...document.querySelectorAll('[data-previa] img')].map((img) => ({
        src: decodeURIComponent(img.currentSrc || img.src),
        carregada: img.complete && img.naturalWidth > 0
      })),
      anuncios: [...document.querySelectorAll('[aria-live]')].map((e) => e.textContent ?? '')
    };
  })()`);

const caminhoDoFundo = (fundo: string) =>
  /url\("?([^")]+)"?\)/.exec(fundo)?.[1] ?? null;

async function soltar(alvo: Alvo, arquivo: string) {
  const centro = await naPagina<{ x: number; y: number } | null>(`(() => {
    const zona = document.querySelector(${JSON.stringify(seletor[alvo])});
    if (!zona) return null;
    zona.scrollIntoView({ block: 'center' });
    const caixa = zona.getBoundingClientRect();
    return { x: caixa.x + caixa.width / 2, y: caixa.y + caixa.height / 2 };
  })()`);

  if (!centro) throw new Error(`A zona da ${alvo} não está na página.`);

  const data = { items: [], files: [arquivo], dragOperationsMask: 1 };

  await ['dragEnter', 'dragOver', 'drop'].reduce(
    (anterior, type) =>
      anterior.then(() =>
        cdp('Input.dispatchDragEvent', { type, ...centro, data }, sessionId)
      ),
    Promise.resolve<unknown>(null)
  );
}

async function esperar(
  condicao: () => Promise<boolean>,
  limite = Date.now() + 30_000
): Promise<boolean> {
  if (await condicao()) return true;

  if (Date.now() >= limite) return false;

  await new Promise((r) => {
    setTimeout(r, 200);
  });

  return esperar(condicao, limite);
}

await naPagina(`document.querySelector('[data-paleta="imagem"]').click()`);

await esperar(async () =>
  naPagina<boolean>(
    `!!document.querySelector(${JSON.stringify(seletor.bloco)})`
  )
);

type Resultado = Caso & {
  bytes: number;
  passou: boolean;
  visto: Estado;
  caminho: string | null;
};

async function rodar(caso: Caso): Promise<Resultado> {
  const arquivo = join(pastaImagens, caso.arquivo);
  const antes = await lerEstado(caso.alvo);

  if (!caso.esperado.envia && antes.alerta !== null) {
    throw new Error(
      `Há um alerta antigo antes de ${caso.arquivo}: ${antes.alerta}`
    );
  }

  await soltar(caso.alvo, arquivo);

  let visto = antes;

  const passou = await esperar(async () => {
    visto = await lerEstado(caso.alvo);
    const caminho = caminhoDoFundo(visto.fundo);

    if (visto.anuncios.some((texto) => /file|accepted|rejected/i.test(texto)))
      return false;

    if (!caso.esperado.envia) {
      return (
        visto.alerta?.includes(caso.esperado.motivo) === true &&
        visto.fundo === antes.fundo
      );
    }

    return (
      caminho !== null &&
      caminho !== caminhoDoFundo(antes.fundo) &&
      visto.status.includes('Imagem enviada') &&
      visto.previa.some((img) => img.carregada && img.src.includes(caminho))
    );
  });

  const nome = `issue54-${caso.alvo}-${caso.arquivo.replace('.', '-')}.png`;

  const { data } = await cdp<{ data: string }>(
    'Page.captureScreenshot',
    { format: 'png' },
    sessionId
  );

  writeFileSync(join(pastaSaida, nome), Buffer.from(data, 'base64'));

  const resultado = {
    ...caso,
    bytes: statSync(arquivo).size,
    passou,
    caminho: caminhoDoFundo(visto.fundo),
    visto
  };

  process.stdout.write(
    `${passou ? 'ok  ' : 'FALHA'} ${caso.alvo} ${caso.arquivo} (${resultado.bytes} bytes): ${
      caso.esperado.envia
        ? `prévia com ${resultado.caminho}`
        : `alerta "${visto.alerta}"`
    }\n`
  );

  return resultado;
}

async function rodarEmOrdem(
  pendentes: Caso[],
  feitos: Resultado[] = []
): Promise<Resultado[]> {
  const [caso, ...resto] = pendentes;

  if (!caso) return feitos;

  return rodarEmOrdem(resto, [...feitos, await rodar(caso)]);
}

const resultados = await rodarEmOrdem(casos);

writeFileSync(
  join(pastaSaida, 'issue54-navegador.json'),
  JSON.stringify(resultados, null, 2)
);

socket.close();

const falhas = resultados.filter((r) => !r.passou).length;

process.stdout.write(
  `${resultados.length - falhas} de ${resultados.length} casos passaram\n`
);

process.exit(falhas ? 1 : 0);
