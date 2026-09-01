import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /api/ é só form handler e entrega de catálogo por token, nada a indexar.
      // /catalogo.pdf serve o PDF de 81 MB direto: fora do índice para o download
      // continuar passando pelo formulário de /download, que segue liberada.
      disallow: ['/api/', '/catalogo.pdf']
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
