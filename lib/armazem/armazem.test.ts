// @vitest-environment node
import { ErroConfiguracao } from '@/lib/utils/erro-configuracao';
import {
  BucketAlreadyExists,
  BucketAlreadyOwnedByYou,
  CreateBucketCommand,
  S3Client
} from '@aws-sdk/client-s3';

import {
  type Armazem,
  criarArmazemDisco,
  criarArmazemS3,
  escolherArmazem,
  lerConfigS3
} from './armazem';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import {
  type IncomingMessage,
  type RequestListener,
  type ServerResponse,
  createServer
} from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';

const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4]);

const lerTudo = async (corpo: ReadableStream<Uint8Array>) =>
  new Uint8Array(await new Response(corpo).arrayBuffer());

const chaveNova = () => `blog/teste-${randomUUID()}/foto-0123456789.png`;

let raiz: string;

beforeAll(async () => {
  raiz = await mkdtemp(path.join(tmpdir(), 'armazem-'));
});

afterAll(async () => {
  await rm(raiz, { recursive: true, force: true });
});

function contrato(nome: string, abrir: () => Promise<Armazem>, pular = false) {
  describe.skipIf(pular)(`contrato do armazém: ${nome}`, () => {
    let armazem: Armazem;

    beforeAll(async () => {
      armazem = await abrir();
    });

    it('lê de volta, por stream, os bytes gravados e o tamanho', async () => {
      const chave = chaveNova();

      await armazem.gravar(chave, bytes, 'image/png');

      const lido = await armazem.ler(chave);

      expect(lido?.tamanho).toBe(bytes.length);
      expect(lido && (await lerTudo(lido.corpo))).toEqual(bytes);
    });

    it('devolve null para chave que não existe', async () => {
      expect(await armazem.ler(chaveNova())).toBeNull();
    });

    it('lista só as chaves do prefixo, com tamanho e data', async () => {
      const prefixo = `blog/teste-${randomUUID()}/`;
      const antes = Date.now() - 60_000;

      await armazem.gravar(`${prefixo}a-0123456789.png`, bytes, 'image/png');
      await armazem.gravar(
        `${prefixo}b-0123456789.png`,
        bytes.subarray(0, 4),
        'image/png'
      );
      await armazem.gravar(chaveNova(), bytes, 'image/png');

      const listados = await armazem.listar(prefixo);

      expect(
        listados
          .map(({ chave, tamanho }) => ({ chave, tamanho }))
          .sort((a, b) => a.chave.localeCompare(b.chave))
      ).toEqual([
        { chave: `${prefixo}a-0123456789.png`, tamanho: bytes.length },
        { chave: `${prefixo}b-0123456789.png`, tamanho: 4 }
      ]);

      for (const { modificadoEm } of listados) {
        expect(modificadoEm.getTime()).toBeGreaterThan(antes);
      }
    });

    it('lista vazio quando nada tem o prefixo', async () => {
      expect(await armazem.listar(`blog/vazio-${randomUUID()}/`)).toEqual([]);
    });

    it('gravar de novo a mesma chave com os mesmos bytes mantém o objeto', async () => {
      const chave = chaveNova();

      await armazem.gravar(chave, bytes, 'image/png');
      await armazem.gravar(chave, bytes, 'image/png');

      const lido = await armazem.ler(chave);

      expect(lido && (await lerTudo(lido.corpo))).toEqual(bytes);
    });
  });
}

contrato('disco', () => Promise.resolve(criarArmazemDisco(raiz)));

// TESTE_S3_* aponta para um MinIO descartável; sem elas, o contrato do S3 fica de fora.
const s3 = {
  AWS_ENDPOINT_URL: process.env.TESTE_S3_ENDPOINT,
  AWS_ACCESS_KEY_ID: process.env.TESTE_S3_CHAVE,
  AWS_SECRET_ACCESS_KEY: process.env.TESTE_S3_SEGREDO,
  AWS_S3_BUCKET_NAME: process.env.TESTE_S3_BUCKET,
  AWS_DEFAULT_REGION: 'us-east-1',
  AWS_S3_URL_STYLE: 'path'
};

contrato(
  'S3',
  async () => {
    const cliente = new S3Client({
      endpoint: s3.AWS_ENDPOINT_URL,
      region: s3.AWS_DEFAULT_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: s3.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: s3.AWS_SECRET_ACCESS_KEY ?? ''
      }
    });

    try {
      await cliente.send(
        new CreateBucketCommand({ Bucket: s3.AWS_S3_BUCKET_NAME })
      );
    } catch (erro) {
      const jaExiste =
        erro instanceof BucketAlreadyOwnedByYou ||
        erro instanceof BucketAlreadyExists;

      if (!jaExiste) throw erro;
    }

    return escolherArmazem(s3, raiz);
  },
  !s3.AWS_ENDPOINT_URL
);

describe('armazém em disco', () => {
  it('lista vazio quando a pasta ainda não existe', async () => {
    expect(
      await criarArmazemDisco(path.join(raiz, 'nunca-criada')).listar('blog/')
    ).toEqual([]);
  });

  it('não lista o arquivo temporário de uma gravação pela metade', async () => {
    const pasta = await mkdtemp(path.join(tmpdir(), 'armazem-tmp-'));

    try {
      await mkdir(path.join(pasta, 'blog', 'post'), { recursive: true });
      await writeFile(
        path.join(pasta, 'blog', 'post', 'foto-0123456789.png.1a2b.tmp'),
        bytes
      );

      expect(await criarArmazemDisco(pasta).listar('blog/')).toEqual([]);
    } finally {
      await rm(pasta, { recursive: true, force: true });
    }
  });

  it('recusa chave que sai da pasta', async () => {
    const armazem = criarArmazemDisco(raiz);

    await expect(
      armazem.gravar('../fora.png', bytes, 'image/png')
    ).rejects.toThrow('fora do armazém');
    await expect(armazem.ler('blog/../../fora.png')).rejects.toThrow(
      'fora do armazém'
    );
  });
});

/** Servidor HTTP local no lugar do bucket; devolve a porta e o fechamento. */
async function bucketLocal(responder: RequestListener) {
  const servidor = createServer(responder);

  servidor.listen(0);
  await once(servidor, 'listening');

  const { port } = z.object({ port: z.number() }).parse(servidor.address());

  return {
    porta: port,
    fechar: () => {
      servidor.closeAllConnections();
      servidor.close();
    }
  };
}

type PedidoS3 = {
  metodo?: string;
  host?: string;
  caminho: string;
  continuacao?: string | null;
};

/** Páginas pequenas obrigam o cliente a seguir o NextContinuationToken. */
const CHAVES_POR_PAGINA = 2;

const fechamentos: (() => void)[] = [];

afterAll(() => {
  for (const fechar of fechamentos) fechar();
});

/** Bucket em memória que responde como o S3: 404 NoSuchKey e 403 AccessDenied em XML. */
async function bucketFalso() {
  const objetos = new Map<string, { corpo: Buffer; quando: Date }>();
  const pedidos: PedidoS3[] = [];

  const erroS3 = (status: number, codigo: string) =>
    [
      status,
      `<?xml version="1.0" encoding="UTF-8"?><Error><Code>${codigo}</Code><Message>${codigo}</Message></Error>`
    ] as const;

  const servidor = await bucketLocal((pedido, resposta) => {
    const partes: Buffer[] = [];

    pedido.on('data', (parte: Buffer) => partes.push(parte));
    pedido.on('end', () => responder(pedido, Buffer.concat(partes), resposta));
  });

  const responder = (
    pedido: IncomingMessage,
    corpo: Buffer,
    resposta: ServerResponse
  ) => {
    const url = new URL(pedido.url ?? '/', 'http://x');
    const caminho = url.pathname;
    const onde = `${pedido.headers.host}${caminho}`;

    if (url.searchParams.get('list-type') === '2') {
      pedidos.push({
        metodo: pedido.method,
        host: pedido.headers.host,
        caminho,
        continuacao: url.searchParams.get('continuation-token')
      });
      listar(onde, url.searchParams, resposta);

      return;
    }

    pedidos.push({ metodo: pedido.method, host: pedido.headers.host, caminho });

    if (pedido.method === 'PUT') {
      objetos.set(onde, { corpo, quando: new Date() });
      resposta.writeHead(200, { etag: '"0"' }).end();

      return;
    }

    const guardado = objetos.get(onde);

    const [status, xml] = caminho.includes('negado')
      ? erroS3(403, 'AccessDenied')
      : erroS3(404, 'NoSuchKey');

    if (!guardado) {
      resposta
        .writeHead(status, { 'content-type': 'application/xml' })
        .end(xml);

      return;
    }

    resposta
      .writeHead(200, {
        'content-type': 'application/octet-stream',
        'content-length': String(guardado.corpo.length)
      })
      .end(guardado.corpo);
  };

  /** `onde` é o bucket: `<bucket>.host/` em virtual-host, `host/<bucket>` em path. */
  const listar = (
    onde: string,
    busca: URLSearchParams,
    resposta: ServerResponse
  ) => {
    const base = onde.endsWith('/') ? onde : `${onde}/`;
    const prefixo = busca.get('prefix') ?? '';
    const inicio = Number(busca.get('continuation-token') ?? 0);

    const chaves = [...objetos.keys()]
      .flatMap((guardado) => {
        const chave = guardado.slice(base.length);

        return guardado.startsWith(base) && chave.startsWith(prefixo)
          ? [chave]
          : [];
      })
      .sort();

    const pagina = chaves.slice(inicio, inicio + CHAVES_POR_PAGINA);
    const fim = inicio + CHAVES_POR_PAGINA;
    const truncada = fim < chaves.length;

    const conteudo = pagina
      .map((chave) => {
        const guardado = objetos.get(`${base}${chave}`);

        return `<Contents><Key>${chave}</Key><LastModified>${guardado?.quando.toISOString()}</LastModified><Size>${guardado?.corpo.length}</Size></Contents>`;
      })
      .join('');

    resposta
      .writeHead(200, { 'content-type': 'application/xml' })
      .end(
        `<?xml version="1.0" encoding="UTF-8"?><ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Name>meu-bucket</Name><Prefix>${prefixo}</Prefix><KeyCount>${pagina.length}</KeyCount><MaxKeys>${CHAVES_POR_PAGINA}</MaxKeys><IsTruncated>${truncada}</IsTruncated>${truncada ? `<NextContinuationToken>${fim}</NextContinuationToken>` : ''}${conteudo}</ListBucketResult>`
      );
  };

  fechamentos.push(servidor.fechar);

  return { porta: servidor.porta, pedidos };
}

const modosS3 = [
  ['virtual-host', false],
  ['path', true]
] as const;

const armazemFalso = async (estiloCaminho: boolean) => {
  const bucket = await bucketFalso();

  return {
    pedidos: bucket.pedidos,
    porta: bucket.porta,
    armazem: criarArmazemS3({
      endpoint: `http://localhost:${bucket.porta}`,
      regiao: 'auto',
      bucket: 'meu-bucket',
      chave: 'chave',
      segredo: 'segredo',
      estiloCaminho
    })
  };
};

for (const [modo, estiloCaminho] of modosS3) {
  contrato(
    `S3 local em ${modo}`,
    async () => (await armazemFalso(estiloCaminho)).armazem
  );
}

describe('armazém S3 contra o bucket local', () => {
  it.each(modosS3)(
    'em %s endereça o bucket pelo Host ou pelo caminho',
    async (_modo, estiloCaminho) => {
      const { armazem, pedidos, porta } = await armazemFalso(estiloCaminho);

      await armazem.gravar(
        'blog/fispal/foto-0123456789.png',
        bytes,
        'image/png'
      );

      expect(pedidos).toEqual([
        estiloCaminho
          ? {
              metodo: 'PUT',
              host: `localhost:${porta}`,
              caminho: '/meu-bucket/blog/fispal/foto-0123456789.png'
            }
          : {
              metodo: 'PUT',
              host: `meu-bucket.localhost:${porta}`,
              caminho: '/blog/fispal/foto-0123456789.png'
            }
      ]);
    }
  );

  it('segue as páginas do ListObjectsV2 até a última', async () => {
    const { armazem, pedidos } = await armazemFalso(false);

    const chaves = [1, 2, 3, 4, 5].map(
      (n) => `blog/fispal/foto-${n}-0123456789.png`
    );

    await Promise.all(
      chaves.map((chave) => armazem.gravar(chave, bytes, 'image/png'))
    );

    const listados = await armazem.listar('blog/');

    expect(listados.map((o) => o.chave).sort()).toEqual(chaves);
    expect(
      pedidos
        .filter((p) => p.continuacao !== undefined)
        .map((p) => p.continuacao)
    ).toEqual([null, '2', '4']);
  });

  it('chave que falta vira null e acesso negado vira exceção', async () => {
    const { armazem } = await armazemFalso(false);

    expect(await armazem.ler('blog/fispal/falta-0123456789.png')).toBeNull();
    await expect(
      armazem.ler('blog/fispal/negado-0123456789.png')
    ).rejects.toMatchObject({ name: 'AccessDenied' });
  });
});

describe('armazém S3 com bucket mudo', () => {
  it('desiste da leitura quando o bucket aceita a conexão e não responde', async () => {
    const mudo = await bucketLocal(() => {});

    const armazem = criarArmazemS3({
      endpoint: `http://127.0.0.1:${mudo.porta}`,
      regiao: 'auto',
      bucket: 'bucket',
      chave: 'chave',
      segredo: 'segredo',
      estiloCaminho: true
    });

    try {
      await expect(armazem.ler(chaveNova())).rejects.toMatchObject({
        name: 'TimeoutError'
      });
    } finally {
      mudo.fechar();
    }
  }, 20_000);
});

describe('escolha do armazém pelo ambiente', () => {
  const completo = {
    AWS_ENDPOINT_URL: 'http://127.0.0.1:1',
    AWS_ACCESS_KEY_ID: 'chave',
    AWS_SECRET_ACCESS_KEY: 'segredo-que-nao-aparece',
    AWS_S3_BUCKET_NAME: 'bucket',
    AWS_DEFAULT_REGION: 'auto'
  };

  it('sem AWS_* no bun dev grava no disco', async () => {
    const chave = chaveNova();

    await escolherArmazem(
      { NODE_ENV: 'development', AWS_ENDPOINT_URL: '' },
      raiz
    ).gravar(chave, bytes, 'image/png');

    expect(new Uint8Array(await readFile(path.join(raiz, chave)))).toEqual(
      bytes
    );
  });

  it('sem AWS_* fora do bun dev falha com erro de configuração', async () => {
    const armazem = escolherArmazem({ NODE_ENV: 'production' }, raiz);

    await expect(armazem.ler(chaveNova())).rejects.toBeInstanceOf(
      ErroConfiguracao
    );
    await expect(
      armazem.gravar(chaveNova(), bytes, 'image/png')
    ).rejects.toThrow('AWS_*');
  });

  it('com AWS_* incompletas, nomeia as que faltam sem mostrar valores', async () => {
    const { AWS_S3_BUCKET_NAME: _bucket, ...semBucket } = completo;

    const leitura = escolherArmazem(
      { NODE_ENV: 'development', ...semBucket },
      raiz
    ).ler(chaveNova());

    await expect(leitura).rejects.toBeInstanceOf(ErroConfiguracao);
    await expect(leitura).rejects.toThrow('AWS_S3_BUCKET_NAME');
    await expect(leitura).rejects.not.toThrow('segredo-que-nao-aparece');
  });

  it.each([
    ['virtual-host', false],
    ['virtual-hosted', false],
    ['VIRTUAL_HOSTED', false],
    ['path', true],
    ['path-style', true]
  ])('AWS_S3_URL_STYLE=%s dá estiloCaminho %s', (estilo, estiloCaminho) => {
    expect(lerConfigS3({ ...completo, AWS_S3_URL_STYLE: estilo })).toEqual({
      estado: 'pronto',
      config: expect.objectContaining({ estiloCaminho })
    });
  });

  it('sem AWS_S3_URL_STYLE usa virtual-host, como a Railway', () => {
    expect(lerConfigS3(completo)).toEqual({
      estado: 'pronto',
      config: {
        endpoint: 'http://127.0.0.1:1',
        regiao: 'auto',
        bucket: 'bucket',
        chave: 'chave',
        segredo: 'segredo-que-nao-aparece',
        estiloCaminho: false
      }
    });
  });

  it('recusa AWS_S3_URL_STYLE desconhecido', async () => {
    await expect(
      escolherArmazem({ ...completo, AWS_S3_URL_STYLE: 'dns' }, raiz).ler(
        chaveNova()
      )
    ).rejects.toThrow('AWS_S3_URL_STYLE');
  });

  it('bucket que não responde lança, em vez de dizer que a imagem não existe', async () => {
    await expect(
      escolherArmazem(completo, raiz).ler(chaveNova())
    ).rejects.not.toBeInstanceOf(ErroConfiguracao);
  }, 15_000);
});
