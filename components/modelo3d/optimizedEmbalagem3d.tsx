'use client';

import { memo, type CSSProperties, type ReactNode } from 'react';

import { Model3DFallback } from '@/components/modelo3d/model3dFallback';
import { useOptimized3DModel } from '@/components/modelo3d/hooks/useOptimized3DModel';

interface OptimizedEmbalagem3dProps {
  modelSrc?: string;
  alt?: string;
  className?: string;
  autoRotate?: boolean;
  cameraOrbit?: string;
  placeholder?: ReactNode;
  priority?: boolean;
  fallbackLabel?: string;
  posterSrc?: string;
}

function OptimizedEmbalagem3dComponent({
  modelSrc = '/caixa-teste-3d.glb',
  alt = 'Modelo 3D - Embalagem',
  className = '',
  autoRotate = true,
  cameraOrbit = '40deg 75deg 105%',
  placeholder,
  priority = false,
  fallbackLabel = 'Modelo de embalagem',
  posterSrc
}: OptimizedEmbalagem3dProps) {
  const {
    containerRef,
    fallbackReason,
    modelViewerRef,
    hasBeenLoaded,
    isLoaded,
    isVisible,
    renderMode,
    shouldRender,
    handleModelLoad,
    handleModelError
  } = useOptimized3DModel({
    src: modelSrc,
    threshold: 0.1,
    rootMargin: priority ? '200px' : '100px',
    eagerLoad: priority,
    mountDelayMs: priority ? 0 : 100
  });

  const fallbackSubtitle =
    fallbackReason === 'unsupported-webgl'
      ? '3D indisponível neste navegador.'
      : fallbackReason === 'webglcontextlost'
        ? 'Prévia estática ativada para preservar estabilidade.'
        : hasBeenLoaded
          ? 'Prévia estática para reduzir custo de renderização.'
          : 'Carregamento sob demanda quando o card entra na tela.';
  const modelViewerStyle: CSSProperties & Record<'--poster-color', string> = {
    '--poster-color': 'transparent',
    backgroundColor: 'transparent',
    height: '250px',
    minHeight: '250px',
    opacity: isVisible ? 1 : 0.3,
    pointerEvents: isVisible ? 'auto' : 'none',
    width: '100%'
  };

  return (
    <div
      ref={containerRef}
      className={`flex h-full w-full items-center justify-center ${className}`}>
      {shouldRender && isLoaded && (
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          alt={alt}
          poster={posterSrc}
          camera-controls
          camera-orbit={cameraOrbit}
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
          loading={priority ? 'eager' : 'lazy'}
          reveal='auto'
          onLoad={handleModelLoad}
          onError={handleModelError}
          style={modelViewerStyle}
          className={`transition-all duration-300 ${
            isVisible ? 'hover:scale-[1.02]' : ''
          }`}>
        </model-viewer>
      )}

      {!shouldRender &&
        (placeholder || (
          <Model3DFallback
            className='rounded-none border-0'
            imageSrc={posterSrc}
            label={fallbackLabel}
            loading={renderMode === 'poster' && isVisible && !hasBeenLoaded}
            subtitle={fallbackSubtitle}
            minHeight={250}
          />
        ))}
    </div>
  );
}

export const OptimizedEmbalagem3d = memo(OptimizedEmbalagem3dComponent);
OptimizedEmbalagem3d.displayName = 'OptimizedEmbalagem3d';
