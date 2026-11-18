import type { NextConfig } from 'next';

import { buildMaquinaRedirects } from './lib/data/maquinas/redirects';

const nextConfig: NextConfig = {
  agentRules: false,
  compress: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['www.profills.com', 'profills.com']
    }
  },
  // WARNING: empacotado pelo Turbopack, o PGlite quebra o next dev em Can't resolve 'ws'.
  serverExternalPackages: ['@electric-sql/pglite'],
  images: {
    formats: ['image/avif', 'image/webp']
  },
  outputFileTracingExcludes: {
    '*': [
      'public/**/*.glb',
      'public/**/*.gltf',
      'public/**/*.mp4',
      'public/**/*.webm',
      'public/**/*.mov',
      'public/**/*.png',
      'public/**/*.jpg',
      'public/**/*.jpeg',
      'public/**/*.webp',
      'public/**/*.avif',
      'public/**/*.pdf',
      'public/**/*.zip',
      'lib/emails/**/*.html',
      'lib/emails/**/*.css'
    ]
  },
  async redirects() {
    return [
      {
        source: '/downloads/:path*',
        destination: '/download',
        permanent: true
      },
      ...buildMaquinaRedirects()
    ];
  }
};

export default nextConfig;
