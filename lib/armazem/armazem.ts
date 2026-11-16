import { ErroConfiguracao } from '@/lib/utils/erro-configuracao';
import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';

import { openAsBlob } from 'node:fs';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import 'server-only';
import { z } from 'zod';

export type ObjetoGuardado = {
  corpo: ReadableStream<Uint8Array>;
  tamanho: number;
};

/** Bytes guardados por chave, como `blog/<slug>/foto-1a2b3c4d5e.webp`. */
export type Armazem = {
  /** Gravar de novo a mesma chave com os mesmos bytes não muda nada. */
  gravar: (chave: string, bytes: Uint8Array, tipo: string) => Promise<void>;
  /** null quando a chave não existe; lança quando o armazém não responde. */
  ler: (chave: string) => Promise<ObjetoGuardado | null>;
};

/** Armazém numa pasta do disco. A chave nunca sai da pasta. */
export function criarArmazemDisco(raiz: string): Armazem {
  const pasta = path.resolve(raiz);

  const caminho = (chave: string) => {
    const alvo = path.resolve(pasta, chave);

    if (!alvo.startsWith(`${pasta}${path.sep}`)) {
      throw new Error(`Chave fora do armazém: ${chave}`);
    }

    return alvo;
  };

  return {
    async gravar(chave, bytes) {
      const alvo = caminho(chave);
      const temporario = `${alvo}.${crypto.randomUUID()}.tmp`;

      await mkdir(path.dirname(alvo), { recursive: true });
      await writeFile(temporario, bytes);
      await rename(temporario, alvo);
    },

    async ler(chave) {
      try {
        const arquivo = await openAsBlob(caminho(chave));

        return { corpo: arquivo.stream(), tamanho: arquivo.size };
      } catch (erro) {
        if (erro instanceof Error && 'code' in erro && erro.code === 'ENOENT') {
          return null;
        }

        throw erro;
      }
    }
  };
}

export type ConfigS3 = {
  endpoint: string;
  regiao: string;
  bucket: string;
  chave: string;
  segredo: string;
  estiloCaminho: boolean;
};

export function criarArmazemS3(config: ConfigS3): Armazem {
  const cliente = new S3Client({
    endpoint: config.endpoint,
    region: config.regiao,
    credentials: { accessKeyId: config.chave, secretAccessKey: config.segredo },
    forcePathStyle: config.estiloCaminho,
    // Sem prazo, um bucket mudo prende o socket e a rota pública para de responder.
    requestHandler: {
      connectionTimeout: 2_000,
      requestTimeout: 3_000,
      throwOnRequestTimeout: true
    }
  });

  return {
    async gravar(chave, bytes, tipo) {
      await cliente.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: chave,
          Body: bytes,
          ContentType: tipo
        })
      );
    },

    async ler(chave) {
      try {
        const objeto = await cliente.send(
          new GetObjectCommand({ Bucket: config.bucket, Key: chave })
        );

        if (!objeto.Body || objeto.ContentLength === undefined) {
          throw new Error(`O bucket respondeu sem corpo para ${chave}`);
        }

        return {
          corpo: objeto.Body.transformToWebStream(),
          tamanho: objeto.ContentLength
        };
      } catch (erro) {
        if (erro instanceof NoSuchKey) return null;

        throw erro;
      }
    }
  };
}

const NOMES_S3 = [
  'AWS_ENDPOINT_URL',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET_NAME',
  'AWS_DEFAULT_REGION',
  'AWS_S3_URL_STYLE'
] as const;

/** Só as variáveis que o armazém lê; process.env cabe aqui. */
export type AmbienteArmazem = Partial<
  Record<(typeof NOMES_S3)[number] | 'NODE_ENV', string>
>;

// A Railway entrega "virtual-host" (medido em 16/11/2026 em `railway bucket credentials --json`); caixa e separador não importam.
const estiloUrl = z
  .string()
  .transform((estilo) => estilo.toLowerCase().replace(/[^a-z]/g, ''))
  .pipe(z.enum(['virtualhost', 'virtualhosted', 'path', 'pathstyle']));

const ambienteS3 = z
  .object({
    AWS_ENDPOINT_URL: z.url(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_S3_BUCKET_NAME: z.string(),
    AWS_DEFAULT_REGION: z.string(),
    AWS_S3_URL_STYLE: estiloUrl.default('virtualhost')
  })
  .transform(
    (env): ConfigS3 => ({
      endpoint: env.AWS_ENDPOINT_URL,
      regiao: env.AWS_DEFAULT_REGION,
      bucket: env.AWS_S3_BUCKET_NAME,
      chave: env.AWS_ACCESS_KEY_ID,
      segredo: env.AWS_SECRET_ACCESS_KEY,
      estiloCaminho: env.AWS_S3_URL_STYLE.startsWith('path')
    })
  );

/** Cada chamada falha com o motivo: o upload o devolve ao editor e a rota pública responde 503. */
function armazemIndisponivel(motivo: string): Armazem {
  const falhar = () => Promise.reject(new ErroConfiguracao(motivo));

  return { gravar: falhar, ler: falhar };
}

export type LeituraS3 =
  | { estado: 'ausente' }
  | { estado: 'invalido'; motivo: string }
  | { estado: 'pronto'; config: ConfigS3 };

/** Variável vazia conta como ausente; o motivo cita só nomes, nunca valores. */
export function lerConfigS3(env: AmbienteArmazem): LeituraS3 {
  const definidas = Object.fromEntries(
    NOMES_S3.flatMap((nome) => (env[nome] ? [[nome, env[nome]]] : []))
  );

  if (Object.keys(definidas).length === 0) return { estado: 'ausente' };

  const lido = ambienteS3.safeParse(definidas);

  if (lido.success) return { estado: 'pronto', config: lido.data };

  const nomes = [...new Set(lido.error.issues.map((i) => i.path.join('.')))];

  return {
    estado: 'invalido',
    motivo: `Armazém de imagens mal configurado: confira ${nomes.join(', ')}.`
  };
}

/**
 * Com as AWS_*, o bucket S3. Sem nenhuma, só o bun dev cai no disco em
 * raizDisco; fora dele, o armazém falha em vez de gravar onde o deploy apaga.
 */
export function escolherArmazem(
  env: AmbienteArmazem,
  raizDisco: string
): Armazem {
  const lido = lerConfigS3(env);

  if (lido.estado === 'pronto') return criarArmazemS3(lido.config);

  if (lido.estado === 'invalido') return armazemIndisponivel(lido.motivo);

  if (env.NODE_ENV === 'development') return criarArmazemDisco(raizDisco);

  return armazemIndisponivel(
    'Armazém de imagens sem configuração: defina as AWS_* do bucket.'
  );
}
