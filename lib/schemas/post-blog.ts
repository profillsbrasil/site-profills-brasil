import {
  type Assunto,
  type Bloco,
  type Linha,
  PROPORCAO_MAXIMA,
  PROPORCAO_MINIMA,
  type Post,
  type PostGuardado,
  ehAssunto
} from '@/lib/blog/tipos';
import { LIMITE_SLUG, PADRAO_SLUG } from '@/lib/utils/slug';

import { z } from 'zod';

export const slugSchema = z
  .string()
  .max(LIMITE_SLUG, 'Endereço do post longo demais')
  .regex(PADRAO_SLUG, 'Endereço do post inválido');

export const PADRAO_CAMINHO_IMAGEM =
  /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:png|jpg|webp|avif)$/;

const caminhoImagem = z
  .string()
  .regex(PADRAO_CAMINHO_IMAGEM, 'A imagem precisa ser enviada pelo editor')
  .nullable();

const id = z.string().min(1).max(100);

const blocoSchema = z.discriminatedUnion('tipo', [
  z.object({ id, tipo: z.literal('titulo'), texto: z.string() }),
  z.object({ id, tipo: z.literal('paragrafo'), texto: z.string() }),
  z.object({
    id,
    tipo: z.literal('imagem'),
    src: caminhoImagem,
    legenda: z.string()
  }),
  z.object({ id, tipo: z.literal('lista'), itens: z.array(z.string()).min(1) }),
  z.object({
    id,
    tipo: z.literal('citacao'),
    texto: z.string(),
    autor: z.string()
  }),
  z.object({
    id,
    tipo: z.literal('tabela'),
    linhas: z.array(z.array(z.string()))
  }),
  z.object({
    id,
    tipo: z.literal('video'),
    url: z.string(),
    legenda: z.string()
  }),
  z.object({
    id,
    tipo: z.literal('link'),
    titulo: z.string(),
    url: z.string()
  }),
  z.object({
    id,
    tipo: z.literal('aviso'),
    titulo: z.string(),
    texto: z.string()
  }),
  z.object({ id, tipo: z.literal('maquina'), slug: z.string() }),
  z.object({
    id,
    tipo: z.literal('download'),
    titulo: z.string(),
    arquivo: z.string()
  })
]) satisfies z.ZodType<Bloco>;

const linhaSchema = z.object({
  id,
  colunas: z.union([
    z.tuple([blocoSchema]),
    z.tuple([blocoSchema, blocoSchema])
  ]),
  proporcao: z.number().int().min(PROPORCAO_MINIMA).max(PROPORCAO_MAXIMA)
}) satisfies z.ZodType<Linha>;

export const postSchema = z.object({
  assunto: z.custom<Assunto>(ehAssunto, 'Assunto desconhecido'),
  titulo: z.string().max(200),
  resumo: z.string().max(500),
  capa: caminhoImagem,
  linhas: z.array(linhaSchema)
}) satisfies z.ZodType<Post>;

const data = z.iso.datetime();

/** A ordem das chaves aqui é a ordem no arquivo: o parse devolve o objeto nela. */
export const postGuardadoSchema = z.discriminatedUnion('estado', [
  z.object({
    slug: slugSchema,
    estado: z.literal('rascunho'),
    criadoEm: data,
    atualizadoEm: data,
    publicadoEm: z.null(),
    post: postSchema
  }),
  z.object({
    slug: slugSchema,
    estado: z.literal('publicado'),
    criadoEm: data,
    atualizadoEm: data,
    publicadoEm: data,
    post: postSchema
  })
]) satisfies z.ZodType<PostGuardado>;

/** O que o editor manda ao gravar: sem slug, o post ainda não existe. */
export const entradaEditorSchema = z.object({
  slug: slugSchema.nullable(),
  post: postSchema
});

export type EntradaEditor = z.infer<typeof entradaEditorSchema>;
