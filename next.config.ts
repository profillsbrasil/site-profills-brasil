import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

import { buildMaquinaRedirects } from './lib/data/maquinas/redirects';

const nextConfig: NextConfig = {
  compress: true,
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

// O admin do blog não tem login e grava em disco: as rotas dele usam o sufixo `.dev.tsx` e só entram no `next dev`.
// Fora dele os arquivos nem fazem parte do build, então não viram rota, chunk público nem function.
const EXTENSOES = ['tsx', 'ts', 'jsx', 'js'];

export default function config(fase: string): NextConfig {
  return {
    ...nextConfig,
    pageExtensions:
      fase === PHASE_DEVELOPMENT_SERVER
        ? [...EXTENSOES.map((extensao) => `dev.${extensao}`), ...EXTENSOES]
        : EXTENSOES
  };
}
