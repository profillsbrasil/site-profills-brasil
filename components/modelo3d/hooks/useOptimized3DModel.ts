import { useCallback, useEffect, useRef, useState } from 'react';

import { logger } from '@/lib/utils/logger';
import { ModelViewerElement } from '@google/model-viewer';

import { isWebGLAvailable } from './webglSupport';

const modelCache = new Map<string, boolean>();
const modelViewerInstances = new Map<string, number>();
const ESPERA_PARA_LIMPAR_CACHE_MS = 5000;

interface UseOptimized3DModelOptions {
  eager?: boolean;
  src: string;
  threshold?: number;
  rootMargin?: string;
}

export function useOptimized3DModel({
  eager = false,
  src,
  threshold = 0.1,
  rootMargin = '50px'
}: UseOptimized3DModelOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelViewerRef = useRef<ModelViewerElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [hasBeenLoaded, setHasBeenLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- só dá para sondar o WebGL no client, depois do mount
    setWebglSupported(isWebGLAvailable());
  }, []);

  useEffect(() => {
    const count = modelViewerInstances.get(src) || 0;
    modelViewerInstances.set(src, count + 1);

    return () => {
      const currentCount = modelViewerInstances.get(src) || 0;

      if (currentCount <= 1) {
        modelViewerInstances.delete(src);
        setTimeout(() => {
          if (!modelViewerInstances.has(src)) {
            modelCache.delete(src);
          }
        }, ESPERA_PARA_LIMPAR_CACHE_MS);
      } else {
        modelViewerInstances.set(src, currentCount - 1);
      }
    };
  }, [src]);

  useEffect(() => {
    const observedElement = containerRef.current;

    const isLayoutVisible = observedElement
      ? observedElement.getClientRects().length > 0
      : false;

    if (eager && isLayoutVisible) {
      /* eslint-disable react-hooks/set-state-in-effect -- getClientRects() do DOM ignora a árvore invisível do hero mobile/desktop */
      setIsVisible(true);

      if (!hasBeenLoaded) {
        setShouldRender(true);
      }
      /* eslint-enable react-hooks/set-state-in-effect */
    }

    let renderTimeout: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);

            if (!hasBeenLoaded) {
              clearTimeout(renderTimeout);
              renderTimeout = setTimeout(() => setShouldRender(true), 100);
            }
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    if (observedElement) {
      observer.observe(observedElement);
    }

    return () => {
      clearTimeout(renderTimeout);

      if (observedElement) {
        observer.unobserve(observedElement);
      }

      observer.disconnect();
    };
  }, [eager, threshold, rootMargin, hasBeenLoaded]);

  useEffect(() => {
    if (!shouldRender || isLoaded || webglSupported !== true) return;

    const loadModelViewer = async () => {
      try {
        if (!modelCache.get('model-viewer-library')) {
          await import('@google/model-viewer');
          modelCache.set('model-viewer-library', true);
        }

        setIsLoaded(true);
        setHasBeenLoaded(true);
      } catch (error) {
        logger.error('Erro ao carregar model-viewer:', error);
      }
    };

    void loadModelViewer();
  }, [shouldRender, isLoaded, webglSupported]);

  useEffect(() => {
    if (!isLoaded) return;

    const styleId = 'model-viewer-optimized-styles';
    let style = document.getElementById(styleId);

    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        model-viewer::part(default-progress-bar) {
          display: none !important;
        }
        model-viewer::part(default-progress-mask) {
          display: none !important;
        }
        model-viewer .default-progress-bar {
          display: none !important;
        }
        model-viewer #default-progress-bar {
          display: none !important;
        }
        model-viewer > div[slot="progress-bar"] {
          display: none !important;
        }
        model-viewer > .default-progress-bar {
          display: none !important;
        }

        /* Otimizações de performance */
        model-viewer {
          --progress-bar-color: transparent;
          --progress-container-color: transparent;
          --progress-mask: transparent;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const totalInstances = Array.from(modelViewerInstances.values()).reduce(
        (sum, count) => sum + count,
        0
      );

      if (totalInstances === 0) {
        const existingStyle = document.getElementById(styleId);

        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      }
    };
  }, [isLoaded]);

  const handleModelLoad = useCallback(() => {
    if (modelViewerRef.current) {
      modelCache.set(src, true);
    }
  }, [src]);

  const handleModelError = useCallback(
    (error: Event) => {
      logger.error('Erro ao carregar modelo 3D:', error);
      modelCache.delete(src);
    },
    [src]
  );

  return {
    containerRef,
    modelViewerRef,
    isVisible,
    isLoaded,
    shouldRender: shouldRender || hasBeenLoaded,
    hasBeenLoaded,
    webglSupported,
    handleModelLoad,
    handleModelError
  };
}
