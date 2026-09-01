import type { Metadata } from 'next';

import { OG_IMAGE, SITE_LOCALE, SITE_NAME } from './site';

const CARD_SOCIAL = {
  url: OG_IMAGE,
  width: 1200,
  height: 630,
  alt: 'Profills Brasil: máquinas envasadoras e embaladoras industriais'
};

/**
 * Metadata de uma página do site. Declarar `openGraph` num segmento filho
 * substitui o objeto inteiro herdado do layout: imagem, siteName e locale
 * somem juntos, e o template de título não se aplica ao og:title. Por isso os
 * quatro voltam aqui, em toda página.
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
  const tituloComMarca = `${titulo} | ${SITE_NAME}`;

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title: tituloComMarca,
      description: descricao,
      images: [CARD_SOCIAL]
    },
    twitter: {
      card: 'summary_large_image',
      title: tituloComMarca,
      description: descricao,
      images: [CARD_SOCIAL.url]
    }
  };
}
