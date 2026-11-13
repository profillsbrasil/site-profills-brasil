'use client';

import { useEffect, useState } from 'react';

export default function Mv3d({
  src,
  alt,
  cameraOrbit,
  autoRotate,
  poster,
  altura = 250,
  onPronto
}: {
  src: string;
  alt: string;
  cameraOrbit: string;
  autoRotate: boolean;
  poster?: string;
  altura?: number | string;
  onPronto?: () => void;
}) {
  const [lib, setLib] = useState(false);

  useEffect(() => {
    let vivo = true;
    import('@google/model-viewer').then(() => vivo && setLib(true));
    return () => {
      vivo = false;
    };
  }, []);

  if (!lib) return null;

  return (
    // @ts-expect-error model-viewer sem tipos JSX
    <model-viewer
      data-proto-mv
      src={src}
      alt={alt}
      poster={poster}
      camera-controls
      camera-orbit={cameraOrbit}
      min-camera-orbit='auto auto 50%'
      max-camera-orbit='auto auto 200%'
      disable-pan
      disable-zoom
      auto-rotate={autoRotate || undefined}
      auto-rotate-delay='500'
      environment-image='neutral'
      shadow-intensity='1'
      interaction-prompt='none'
      onLoad={onPronto}
      style={{
        width: '100%',
        height: altura,
        backgroundColor: 'transparent',
        '--poster-color': 'transparent'
      }}>
      {/* @ts-expect-error fechamento do model-viewer */}
    </model-viewer>
  );
}
