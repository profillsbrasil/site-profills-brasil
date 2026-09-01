import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /api/ é só form handler e entrega de catálogo por token — nada a indexar.
      // A landing /download continua liberada.
      disallow: ['/api/']
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
