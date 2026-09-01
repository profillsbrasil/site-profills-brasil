import type { Metadata } from 'next';

import { OG_IMAGE } from './site';

/**
 * Metadata de uma página do site. Declarar `openGraph` num segmento filho
 * substitui o objeto inteiro herdado do layout, imagem incluída — por isso o
 * card social entra aqui de novo em toda página.
 */
export function metadataDaPagina({
  titulo,
  descricao,
  path
}: {
  titulo: string;
  descricao: string;
  path: string;
}): Metadata {
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      title: titulo,
      description: descricao,
      images: [OG_IMAGE]
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
      images: [OG_IMAGE]
    }
  };
}
