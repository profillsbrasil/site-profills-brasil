'use client';

import {
  memo,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useState
} from 'react';

import { Model3DFallback } from '@/components/modelo3d/model3dFallback';
import { useOptimized3DModel } from '@/components/modelo3d/hooks/useOptimized3DModel';

interface CaixaHome3dProps {
  modelSrc?: string;
  alt?: string;
  className?: string;
  autoRotate?: boolean;
  cameraOrbit?: string;
  placeholder?: ReactNode;
  isMobile?: boolean;
  priority?: boolean;
  mountDelayMs?: number;
  posterSrc?: string;
  fallbackLabel?: string;
  deferUntilInteraction?: boolean;
}

function CaixaHome3dComponent({
  modelSrc = '/caixa-teste-3d.glb',
  alt = 'Modelo 3D - Embalagem',
  className = '',
  autoRotate = true,
  cameraOrbit = '40deg 75deg 105%',
  placeholder,
  isMobile = false,
  priority = false,
  mountDelayMs = priority ? 0 : 100,
  posterSrc = '/images/caixinha-profills.png',
  fallbackLabel = 'Linha de Produtos Profills',
  deferUntilInteraction = false
}: CaixaHome3dProps) {
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
    mountDelayMs,
    eagerLoad: priority
  });

  const [hasDismissedPoster, setHasDismissedPoster] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(!deferUntilInteraction);

  useEffect(() => {
    if (!deferUntilInteraction) return;

    const unlock = () => {
      setHasInteracted(true);
    };

    window.addEventListener('mouseover', unlock, { once: true });
    window.addEventListener('touchmove', unlock, {
      once: true,
      passive: true
    });
    window.addEventListener('scroll', unlock, {
      once: true,
      passive: true
    });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('mouseover', unlock);
      window.removeEventListener('touchmove', unlock);
      window.removeEventListener('scroll', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [deferUntilInteraction]);

  useEffect(() => {
    if (!shouldRender) {
      setHasDismissedPoster(false);
    }
  }, [shouldRender]);

  useEffect(() => {
    if (
      posterSrc === undefined ||
      !shouldRender ||
      !isLoaded ||
      hasDismissedPoster ||
      (deferUntilInteraction && !hasInteracted) ||
      modelViewerRef.current === null
    ) {
      return;
    }

    const revealTimeout = window.setTimeout(() => {
      modelViewerRef.current?.dismissPoster();
      setHasDismissedPoster(true);
    }, 120);

    return () => {
      window.clearTimeout(revealTimeout);
    };
  }, [
    deferUntilInteraction,
    hasDismissedPoster,
    hasInteracted,
    isLoaded,
    modelViewerRef,
    posterSrc,
    shouldRender
  ]);

  const fallbackSubtitle =
    fallbackReason === 'unsupported-webgl'
      ? 'A visualização 3D não está disponível neste navegador.'
      : fallbackReason === 'webglcontextlost'
        ? 'O navegador perdeu o contexto 3D. Exibindo prévia estática.'
        : hasBeenLoaded
          ? 'Prévia estática carregada para preservar a performance.'
          : 'A caixa 3D é carregada quando entra na área visível.';
  const modelViewerStyle: CSSProperties & Record<'--poster-color', string> = {
    '--poster-color': 'transparent',
    backgroundColor: 'transparent',
    height: '100%',
    minHeight: isMobile ? '400px' : '600px',
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
          reveal={posterSrc ? 'manual' : 'auto'}
          onLoad={handleModelLoad}
          onError={handleModelError}
          style={modelViewerStyle}
          className={`transition-all duration-300 ${
            isVisible && !isMobile ? 'hover:scale-[1.02]' : ''
          }`}>
        </model-viewer>
      )}

      {!shouldRender &&
        (placeholder || (
          <Model3DFallback
            imageSrc={posterSrc}
            label={fallbackLabel}
            loading={renderMode === 'poster' && isVisible && !hasBeenLoaded}
            subtitle={fallbackSubtitle}
            minHeight={isMobile ? 400 : 600}
          />
        ))}
    </div>
  );
}

export const CaixaHome3d = memo(CaixaHome3dComponent);
CaixaHome3d.displayName = 'CaixaHome3d';
