'use client';

import Image from 'next/image';
import { useOptimized3DModel } from '@/components/modelo3d/hooks/useOptimized3DModel';
import { WebGLFallback } from '@/components/modelo3d/WebGLFallback';

interface CaixaHome3dProps {
  modelSrc?: string;
  alt?: string;
  className?: string;
  autoRotate?: boolean;
  cameraOrbit?: string;
  eager?: boolean;
  placeholder?: React.ReactNode;
  isMobile?: boolean;
  posterSrc?: string;
  blurDataURL?: string;
}

export function CaixaHome3d({
  modelSrc = '/caixa-teste-3d.glb',
  alt = 'Modelo 3D - Embalagem',
  className = '',
  autoRotate = true,
  cameraOrbit = '40deg 75deg 105%',
  eager = false,
  placeholder,
  isMobile = false,
  posterSrc,
  blurDataURL,
}: CaixaHome3dProps) {
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
    eager,
    src: modelSrc,
    threshold: 0.1,
    rootMargin: '100px'
  });

  return (
    <div
      ref={containerRef}
      className={`relative flex w-full items-center justify-center ${className}`}>
      {posterSrc && (
        <Image
          src={posterSrc}
          alt={alt}
          width={800}
          height={800}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          priority={eager}
          sizes={isMobile ? '320px' : '50vw'}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {shouldRender && webglSupported !== false && (
        // @ts-expect-error O modelo 3D model-viewer não tem tipos nativos para React
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          alt={alt}
          camera-controls
          camera-orbit={cameraOrbit}
          min-camera-orbit='auto auto 50%'
          max-camera-orbit='auto auto 200%'
          disable-pan={true}
          disable-zoom={true}
          auto-rotate={autoRotate && isVisible}
          auto-rotate-delay='500'
          environment-image='neutral'
          shadow-intensity='1'
          exposure='1'
          interaction-prompt='none'
          loading={eager ? 'eager' : 'lazy'}
          reveal='auto'
          onLoad={handleModelLoad}
          onError={handleModelError}
          style={{
            width: '100%',
            height: isMobile ? '420px' : '100%',
            backgroundColor: 'transparent',
            '--poster-color': 'transparent',
            opacity: isLoaded && isVisible ? 1 : 0,
            pointerEvents: isVisible ? 'auto' : 'none',
            transition: 'opacity 200ms',
          }}
          className={isVisible && !isMobile ? 'hover:scale-[1.02]' : ''}>
          {/* @ts-expect-error Tag fechamento do model-viewer não tem tipos nativos para React */}
        </model-viewer>
      )}

      {!posterSrc && webglSupported !== false && (!shouldRender || !isLoaded) && (
        <div
          className='flex w-full items-center justify-center'
          style={{ height: isMobile ? '320px' : '100%' }}>
          {placeholder || (
            <div
              data-testid='caixa-home-3d-placeholder'
              className='flex min-h-[220px] w-full max-w-sm flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center shadow-[0_20px_80px_rgba(15,23,42,0.35)] backdrop-blur-sm'>
              <div className='relative flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent' />
              </div>
              <span className='mt-4 text-sm font-semibold tracking-wide text-white'>
                Carregando modelo 3D...
              </span>
              <span className='mt-2 text-xs leading-relaxed text-white/60'>
                Preparando a visualização interativa da embalagem.
              </span>
            </div>
          )}
        </div>
      )}
      {!posterSrc && webglSupported === false && (
        <WebGLFallback variant='dark' />
      )}
    </div>
  );
}
