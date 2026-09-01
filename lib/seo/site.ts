/**
 * Fonte única dos dados de identidade usados em metadata, JSON-LD e e-mails.
 * O host canônico é www.profills.com. O apex profills.com responde 308 para ele;
 * profills.com.br é domínio legado e não serve o site por HTTPS.
 */

export const SITE_URL = (
  process.env.SITE_URL || 'https://www.profills.com'
).replace(/\/$/, '');

export const SITE_NAME = 'Profills Brasil';

export const SITE_DESCRIPTION =
  'Fabricante de máquinas envasadoras e embaladoras para líquidos, pastosos, pós e sólidos. Projetamos a linha inteira, do sachê ao fim de linha, e montamos a planta da sua fábrica.';

export const SITE_LOCALE = 'pt_BR';

export const CNPJ = '02.202.294/0001-60';

export const TELEFONE_VENDAS = '+5541997851998';

export const EMAIL_COMERCIAL = 'comercial@profillsdobrasil.com.br';

export const REDES_SOCIAIS = [
  'https://www.facebook.com/profillsbrasil/',
  'https://www.instagram.com/profillsdobrasil/',
  'https://www.linkedin.com/company/profillsdobrasil/',
  'https://www.youtube.com/channel/UCQhaNOzqbkYnZlknSd79zEw'
];

/** Monta URL absoluta a partir de um path do site. */
export function urlAbsoluta(path = '/') {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Card social padrão, gerado por app/opengraph-image.tsx. */
export const OG_IMAGE = '/opengraph-image';
