'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { useOptimized3DModel } from '@/components/modelo3d/hooks/useOptimized3DModel';
import type { Embalagem3d } from '@/lib/data/embalagens3d';
import { cn } from '@/lib/utils';

interface OptimizedEmbalagem3dProps {
  embalagem: Embalagem3d;
  alt: string;
  className?: string;
  autoRotate?: boolean;
}

export function OptimizedEmbalagem3d({
  embalagem,
  alt,
  className = '',
  autoRotate = true
}: OptimizedEmbalagem3dProps) {
  const {
    containerRef,
    modelViewerRef,
    isVisible,
    isLoaded,
    shouldRender,
    webglSupported,
    handleModelLoad,
    handleModelError
  } = useOptimized3DModel({
    src: embalagem.glb,
    threshold: 0.1,
    rootMargin: '100px'
  });
  const montado = shouldRender && isLoaded && webglSupported !== false;
  const [modeloPronto, setModeloPronto] = useState(false);

  // O React não liga onLoad/onError em custom element (load e error não borbulham)
  useEffect(() => {
    const el = modelViewerRef.current;
    if (!montado || !el) return;
    const aoCarregar = () => {
      setModeloPronto(true);
      handleModelLoad();
    };
    const aoFalhar = (evento: Event) => handleModelError(evento);
    el.addEventListener('load', aoCarregar);
    el.addEventListener('error', aoFalhar);
    return () => {
      el.removeEventListener('load', aoCarregar);
      el.removeEventListener('error', aoFalhar);
    };
  }, [montado, modelViewerRef, handleModelLoad, handleModelError]);

  return (
    <div
      ref={containerRef}
      className={`flex h-full w-full items-center justify-center ${className}`}>
      <div className='relative h-[250px] w-full'>
        {montado && (
          // @ts-expect-error O modelo 3D model-viewer não tem tipos nativos para React
          <model-viewer
            ref={modelViewerRef}
            src={embalagem.glb}
            alt={alt}
            camera-controls
            camera-orbit={embalagem.cameraOrbit}
            min-camera-orbit='auto auto 50%'
            max-camera-orbit='auto auto 200%'
            disable-pan={true}
            disable-zoom={true}
            auto-rotate={autoRotate && isVisible} // Só roda animação se estiver visível
            auto-rotate-delay='500'
            environment-image='neutral'
            shadow-intensity='1'
            exposure='1'
            interaction-prompt='none'
            loading='lazy'
            reveal='auto'
            style={{
              width: '100%',
              height: '250px',
              minHeight: '250px',
              backgroundColor: 'transparent',
              '--poster-color': 'transparent',
              opacity: isVisible ? 1 : 0.3, // Reduz opacidade quando não visível
              pointerEvents: isVisible ? 'auto' : 'none' // Desabilita interação quando não visível
            }}
            className={`transition-all duration-300 ${
              isVisible ? 'hover:scale-[1.02]' : ''
            }`}>
            {/* @ts-expect-error Tag fechamento do model-viewer não tem tipos nativos para React */}
          </model-viewer>
        )}

        <Image
          src={embalagem.poster}
          alt={alt}
          aria-hidden={modeloPronto || undefined}
          fill
          sizes='231px'
          className={cn(
            'pointer-events-none object-contain transition-opacity duration-200 motion-reduce:transition-none',
            modeloPronto && 'opacity-0'
          )}
        />
      </div>
    </div>
  );
}
