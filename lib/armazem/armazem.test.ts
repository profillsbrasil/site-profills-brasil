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
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { type RequestListener, createServer } from 'node:http';
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
