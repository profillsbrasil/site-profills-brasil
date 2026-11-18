import { ErroConfiguracao } from '@/lib/utils/erro-configuracao';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  NoSuchKey,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';

import { openAsBlob } from 'node:fs';
import { mkdir, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import 'server-only';
import { z } from 'zod';

export type ObjetoGuardado = {
  corpo: ReadableStream<Uint8Array>;
  tamanho: number;
};

export type ObjetoListado = {
  chave: string;
  tamanho: number;
  modificadoEm: Date;
};

/** Bytes guardados por chave, como `blog/<slug>/foto-1a2b3c4d5e.webp`. */
export type Armazem = {
  /** Uma chave já guardada fica como está, com a data da primeira gravação: o nome da imagem leva o hash dos bytes. */
  gravar: (chave: string, bytes: Uint8Array, tipo: string) => Promise<void>;
  /** null quando a chave não existe; lança quando o armazém não responde. */
  ler: (chave: string) => Promise<ObjetoGuardado | null>;
  /** Toda chave que começa por `prefixo`, sem ordem garantida; lança quando o armazém não responde. */
  listar: (prefixo: string) => Promise<ObjetoListado[]>;
  /** Devolve as chaves que ficaram; chave que já não existe conta como apagada, então repetir não falha. */
  apagar: (chaves: string[]) => Promise<string[]>;
};

const SUFIXO_TEMPORARIO = '.tmp';

/** A listagem inteira, ou o apagar inteiro, com todas as páginas e novas tentativas, desiste depois disto. */
export const PRAZO_LOTE_MS = 5_000;

/** Armazém numa pasta do disco. A chave nunca sai da pasta. */
export function criarArmazemDisco(raiz: string) {
  const pasta = path.resolve(raiz);

  const caminho = (chave: string) => {
    const alvo = path.resolve(pasta, chave);

    if (!alvo.startsWith(`${pasta}${path.sep}`)) {
      throw new Error(`Chave fora do armazém: ${chave}`);
    }

    return alvo;
  };

  const armazem: Armazem = {
    async gravar(chave, bytes) {
      const alvo = caminho(chave);

      try {
        await stat(alvo);

        return;
      } catch (erro) {
        if (!(
          erro instanceof Error &&
          'code' in erro &&
          erro.code === 'ENOENT'
        )) {
          throw erro;
        }
      }

      const temporario = `${alvo}.${crypto.randomUUID()}${SUFIXO_TEMPORARIO}`;

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
    },

    async listar(prefixo) {
      let entradas;

      try {
        entradas = await readdir(pasta, {
          recursive: true,
          withFileTypes: true
        });
      } catch (erro) {
        if (erro instanceof Error && 'code' in erro && erro.code === 'ENOENT') {
          return [];
        }

        throw erro;
      }

      const chaves = entradas
        .filter((entrada) => entrada.isFile())
        .map((entrada) =>
          path
            .relative(pasta, path.join(entrada.parentPath, entrada.name))
            .split(path.sep)
            .join('/')
        )
        .filter(
          (chave) =>
            chave.startsWith(prefixo) && !chave.endsWith(SUFIXO_TEMPORARIO)
        );

      return Promise.all(
        chaves.map(async (chave) => {
          const { size, mtime } = await stat(caminho(chave));

          return { chave, tamanho: size, modificadoEm: mtime };
        })
      );
    },

    async apagar(chaves) {
      const alvos = chaves.map(caminho);

      const resultados = await Promise.allSettled(
        alvos.map((alvo) => rm(alvo, { force: true }))
      );

      return chaves.filter((_, i) => resultados[i]?.status === 'rejected');
    }
  };

  return armazem;
}

export type ConfigS3 = {
  endpoint: string;
  regiao: string;
  bucket: string;
  chave: string;
  segredo: string;
  estiloCaminho: boolean;
};

export function criarArmazemS3(config: ConfigS3) {
  const cliente = new S3Client({
    endpoint: config.endpoint,
    region: config.regiao,
    credentials: { accessKeyId: config.chave, secretAccessKey: config.segredo },
    forcePathStyle: config.estiloCaminho,
    // WARNING: o SDK do S3 não tem prazo padrão; sem este, um bucket mudo prende o socket e a rota pública para.
    requestHandler: {
      connectionTimeout: 2_000,
      requestTimeout: 3_000,
      throwOnRequestTimeout: true
    }
  });

  const armazem: Armazem = {
    async gravar(chave, bytes, tipo) {
      const guardada = await cliente
        .send(new HeadObjectCommand({ Bucket: config.bucket, Key: chave }))
        .then(
          () => true,
          () => false
        );

      if (guardada) return;

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
    },

    async listar(prefixo) {
      const prazo = AbortSignal.timeout(PRAZO_LOTE_MS);

      const desde = async (continuacao?: string) => {
        const pagina = await cliente.send(
          new ListObjectsV2Command({
            Bucket: config.bucket,
            Prefix: prefixo,
            ContinuationToken: continuacao
          }),
          { abortSignal: prazo }
        );

        const objetos = (pagina.Contents ?? []).map(
          ({ Key, Size, LastModified }) => {
            if (Key === undefined || Size === undefined || !LastModified) {
              throw new Error(`O bucket listou um objeto incompleto: ${Key}`);
            }

            return { chave: Key, tamanho: Size, modificadoEm: LastModified };
          }
        );

        const todos: ObjetoListado[] =
          pagina.IsTruncated && pagina.NextContinuationToken
            ? [...objetos, ...(await desde(pagina.NextContinuationToken))]
            : objetos;

        return todos;
      };

      return desde();
    },

    async apagar(chaves) {
      const prazo = AbortSignal.timeout(PRAZO_LOTE_MS);

      const resultados = await Promise.allSettled(
        chaves.map((chave) =>
          cliente.send(
            new DeleteObjectCommand({ Bucket: config.bucket, Key: chave }),
            { abortSignal: prazo }
          )
        )
      );

      return chaves.filter((_, i) => resultados[i]?.status === 'rejected');
    }
  };

  return armazem;
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
    (env) =>
      ({
        endpoint: env.AWS_ENDPOINT_URL,
        regiao: env.AWS_DEFAULT_REGION,
        bucket: env.AWS_S3_BUCKET_NAME,
        chave: env.AWS_ACCESS_KEY_ID,
        segredo: env.AWS_SECRET_ACCESS_KEY,
        estiloCaminho: env.AWS_S3_URL_STYLE.startsWith('path')
      }) satisfies ConfigS3
  );

function armazemIndisponivel(motivo: string) {
  const falhar = () => Promise.reject(new ErroConfiguracao(motivo));

  const armazem: Armazem = {
    gravar: falhar,
    ler: falhar,
    listar: falhar,
    apagar: falhar
  };

  return armazem;
}

export type LeituraS3 =
  | { estado: 'ausente' }
  | { estado: 'invalido'; motivo: string }
  | { estado: 'pronto'; config: ConfigS3 };

/** Variável vazia conta como ausente; o motivo cita só nomes, nunca valores. */
export function lerConfigS3(env: AmbienteArmazem) {
  const definidas = Object.fromEntries(
    NOMES_S3.flatMap((nome) => (env[nome] ? [[nome, env[nome]]] : []))
  );

  if (Object.keys(definidas).length === 0)
    return { estado: 'ausente' } satisfies LeituraS3;

  const lido = ambienteS3.safeParse(definidas);

  if (lido.success) {
    return { estado: 'pronto', config: lido.data } satisfies LeituraS3;
  }

  const nomes = [...new Set(lido.error.issues.map((i) => i.path.join('.')))];

  return {
    estado: 'invalido',
    motivo: `Armazém de imagens mal configurado: confira ${nomes.join(', ')}.`
  } satisfies LeituraS3;
}

/**
 * Com as AWS_*, o bucket S3. Sem nenhuma, só o bun dev cai no disco em
 * raizDisco; fora dele, o armazém falha em vez de gravar onde o deploy apaga.
 */
export function escolherArmazem(env: AmbienteArmazem, raizDisco: string) {
  const lido = lerConfigS3(env);

  if (lido.estado === 'pronto') return criarArmazemS3(lido.config);

  if (lido.estado === 'invalido') return armazemIndisponivel(lido.motivo);

  if (env.NODE_ENV === 'development') return criarArmazemDisco(raizDisco);

  return armazemIndisponivel(
    'Armazém de imagens sem configuração: defina as AWS_* do bucket.'
  );
}
