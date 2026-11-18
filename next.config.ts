import type { NextConfig } from 'next';

import { buildMaquinaRedirects } from './lib/data/maquinas/redirects';

const nextConfig: NextConfig = {
  // As instruções para agentes vivem no CLAUDE.md; sem isto o next dev grava um AGENTS.md na raiz.
  agentRules: false,
  compress: true,
  experimental: {
    serverActions: {
      // Atrás do proxy da Railway o Host chega interno; a action aceita o Origin dos dois domínios do site.
      allowedOrigins: ['www.profills.com', 'profills.com']
    }
  },
  // O PGlite do bun dev carrega WASM e módulos opcionais em runtime; empacotado pelo Turbopack, quebra.
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
