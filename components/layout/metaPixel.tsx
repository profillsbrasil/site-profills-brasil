'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type MetaPixelProps = { pixelId: string };

/**
 * Meta Pixel (Facebook). Carrega o fbevents.js depois da hidratação e
 * dispara PageView no primeiro load e a cada navegação client-side do App Router.
 */
export default function MetaPixel({ pixelId }: MetaPixelProps) {
  const pathname = usePathname();

  useEffect(() => {
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  return (
    <>
      <Script id='meta-pixel' strategy='afterInteractive'>
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');`}
      </Script>
      <noscript>
        <img
          height='1'
          width='1'
          style={{ display: 'none' }}
          alt=''
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
