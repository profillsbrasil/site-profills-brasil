import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'motion',
      'framer-motion',
      '@radix-ui/react-icons',
    ],
  },
  async redirects() {
    return [
      {
        source: '/downloads/:path*',
        destination: '/download',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
