import type { MaquinaCatalogo } from '@/lib/data/maquinas';

import {
  CNPJ,
  EMAIL_COMERCIAL,
  REDES_SOCIAIS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  TELEFONE_VENDAS,
  urlAbsoluta
} from './site';

const ORGANIZACAO_ID = `${SITE_URL}/#organizacao`;

/** Identidade da empresa. Alimenta o painel de conhecimento do Google. */
export function organizacaoSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZACAO_ID,
    name: SITE_NAME,
    legalName: 'Profills do Brasil',
    url: SITE_URL,
    logo: urlAbsoluta('/logo.png'),
    description: SITE_DESCRIPTION,
    taxID: CNPJ,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Curitiba',
      addressRegion: 'PR',
      addressCountry: 'BR'
    },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: TELEFONE_VENDAS,
        email: EMAIL_COMERCIAL,
        availableLanguage: ['Portuguese']
      }
    ],
    sameAs: REDES_SOCIAIS
  };
}

/** Marca o site como um todo — habilita o sitelinks searchbox e o nome na SERP. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'pt-BR',
    publisher: { '@id': ORGANIZACAO_ID }
  };
}

/**
 * Produto de uma máquina do catálogo. Sem `offers` de propósito: a venda é sob
 * orçamento e preço inventado em schema é motivo de penalidade manual.
 */
export function maquinaSchema(maquina: MaquinaCatalogo) {
  const url = urlAbsoluta(`/maquinas/${maquina.slug}`);
  const specs = [...maquina.specsMaquina, ...maquina.specsEmbalagem].map(
    (spec) => ({
      '@type': 'PropertyValue',
      name: spec.rotulo,
      value: spec.valor
    })
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#produto`,
    name: maquina.nomeCompleto,
    alternateName: maquina.nome,
    description: maquina.seo.descricao,
    url,
    category: maquina.categoria,
    ...(maquina.imagens && { image: urlAbsoluta(maquina.imagens.maquina.src) }),
    brand: { '@type': 'Brand', name: SITE_NAME },
    manufacturer: { '@id': ORGANIZACAO_ID },
    additionalProperty: specs,
    isRelatedTo: maquina.aplicacoes.produtos.slice(0, 12).map((produto) => ({
      '@type': 'Product',
      name: produto
    }))
  };
}

/** Trilha de navegação exibida acima do título na SERP. */
export function breadcrumbSchema(itens: { nome: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((item, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: item.nome,
      item: urlAbsoluta(item.path)
    }))
  };
}

/** Lista do catálogo — ajuda o Google a entender o índice de máquinas. */
export function catalogoSchema(maquinas: MaquinaCatalogo[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo de máquinas Profills',
    numberOfItems: maquinas.length,
    itemListElement: maquinas.map((maquina, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: maquina.nomeCompleto,
      url: urlAbsoluta(`/maquinas/${maquina.slug}`)
    }))
  };
}

/**
 * FAQ da página Sobre. O Google restringiu o rich result de FAQ a sites de
 * saúde e governo, mas o bloco segue ajudando na leitura semântica da página.
 */
export function faqSchema(
  questoes: { pergunta: string; resposta: string; topicos?: string[] }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questoes.map((questao) => ({
      '@type': 'Question',
      name: questao.pergunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: [questao.resposta, ...(questao.topicos ?? [])].join(' ')
      }
    }))
  };
}
