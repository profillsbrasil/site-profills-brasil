import { useCallback, useEffect, useRef, useState } from "react";

// Cache global para modelos 3D já carregados
const modelCache = new Map<string, boolean>();
const modelViewerInstances = new Map<string, number>();

interface UseOptimized3DModelOptions {
  src: string;
  threshold?: number;
  rootMargin?: string;
}

export function useOptimized3DModel({
  src,
  threshold = 0.1,
  rootMargin = "50px",
}: UseOptimized3DModelOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [hasBeenLoaded, setHasBeenLoaded] = useState(false);

  // Incrementa contador de instâncias
  useEffect(() => {
    const count = modelViewerInstances.get(src) || 0;
    modelViewerInstances.set(src, count + 1);

    return () => {
      const currentCount = modelViewerInstances.get(src) || 0;
      if (currentCount <= 1) {
        modelViewerInstances.delete(src);
        // Remove do cache se não há mais instâncias
        setTimeout(() => {
          if (!modelViewerInstances.has(src)) {
            modelCache.delete(src);
          }
        }, 5000); // Aguarda 5s antes de limpar o cache
      } else {
        modelViewerInstances.set(src, currentCount - 1);
      }
    };
  }, [src]);

  // Intersection Observer para lazy loading inteligente
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Só renderiza na primeira vez ou se nunca foi carregado
            if (!hasBeenLoaded) {
              setTimeout(() => setShouldRender(true), 100);
            }
          } else {
            setIsVisible(false);
            // Uma vez carregado, não desmonta mais o model-viewer
            // Apenas deixa invisível via CSS
          }
        });
      },
      { threshold, rootMargin },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, hasBeenLoaded]);

  // Carrega model-viewer dinamicamente apenas quando necessário
  useEffect(() => {
    if (!shouldRender || isLoaded) return;

    const loadModelViewer = async () => {
      try {
        if (!modelCache.get("model-viewer-library")) {
          await import("@google/model-viewer");
          modelCache.set("model-viewer-library", true);
        }
        setIsLoaded(true);
        setHasBeenLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar model-viewer:", error);
      }
    };

    loadModelViewer();
  }, [shouldRender, isLoaded]);

  // Cleanup de estilos compartilhado
  useEffect(() => {
    if (!isLoaded) return;

    // Só adiciona os estilos uma vez
    const styleId = "model-viewer-optimized-styles";
    let style = document.getElementById(styleId);

    if (!style) {
      style = document.createElement("style");
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
      // Só remove os estilos se não há mais instâncias
      const totalInstances = Array.from(modelViewerInstances.values()).reduce(
        (sum, count) => sum + count,
        0,
      );
      if (totalInstances === 0) {
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      }
    };
  }, [isLoaded]);

  // Limpa recursos do model-viewer quando não está mais visível
  const handleModelLoad = useCallback(() => {
    if (modelViewerRef.current) {
      modelCache.set(src, true);
    }
  }, [src]);

  const handleModelError = useCallback(
    (error: any) => {
      console.error("Erro ao carregar modelo 3D:", error);
      modelCache.delete(src);
    },
    [src],
  );

  return {
    containerRef,
    modelViewerRef,
    isVisible,
    isLoaded,
    shouldRender: shouldRender || hasBeenLoaded, // Sempre renderiza se já foi carregado uma vez
    hasBeenLoaded,
    handleModelLoad,
    handleModelError,
  };
}
