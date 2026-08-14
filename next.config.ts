import type { NextConfig } from 'next';

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

export default nextConfig;
