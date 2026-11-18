import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo/site';

export default function robots() {
  const regras: MetadataRoute.Robots = {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/catalogo.pdf', '/admin/']
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };

  return regras;
}
