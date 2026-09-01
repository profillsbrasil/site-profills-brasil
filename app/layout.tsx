import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import MetaPixel from '@/components/layout/metaPixel';
import { JsonLd } from '@/components/seo/jsonLd';
import { Toaster } from '@/components/ui/sonner';
import { organizacaoSchema, websiteSchema } from '@/lib/seo/schemas';
import {
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL
} from '@/lib/seo/site';
import { GoogleAnalytics } from '@next/third-parties/google';

import './globals.css';

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Máquinas envasadoras e embaladoras industriais`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    url: '/',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Máquinas envasadoras e embaladoras industriais`,
    description: SITE_DESCRIPTION
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Máquinas envasadoras e embaladoras industriais`,
    description: SITE_DESCRIPTION
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR' suppressHydrationWarning className='relative'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full w-full overflow-x-hidden antialiased`}
        suppressHydrationWarning>
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg'>
          Pular para o conteúdo
        </a>
        <Toaster richColors />
        {children}
        <JsonLd data={organizacaoSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {metaPixelId && <MetaPixel pixelId={metaPixelId} />}
    </html>
  );
}
