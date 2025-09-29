'use client';

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext
} from 'react';

// Context para compartilhar configurações globais dos modelos 3D
interface ModelViewer3DContextType {
  preloadModel: (src: string) => Promise<void>;
  isModelCached: (src: string) => boolean;
  clearModelCache: (src?: string) => void;
}

const ModelViewer3DContext = createContext<ModelViewer3DContextType | null>(
  null
);

interface ModelViewer3DProviderProps {
  children: ReactNode;
  maxCacheSize?: number;
  preloadImportantModels?: string[];
}

export function ModelViewer3DProvider({
  children,
  maxCacheSize = 5,
  preloadImportantModels = []
}: ModelViewer3DProviderProps) {
  // Cache global de modelos estável entre renders
  const modelCacheRef = React.useRef<Map<string, boolean>>(new Map());

  const preloadModel = useCallback(
    async (src: string) => {
      if (modelCacheRef.current.get(src)) return;

      try {
        // Pré-carrega o modelo sem renderizar
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        document.head.appendChild(link);

        // Respeita capacidade máxima do cache
        if (modelCacheRef.current.size >= maxCacheSize) {
          const oldestKey = modelCacheRef.current.keys().next().value as
            | string
            | undefined;
          if (oldestKey) modelCacheRef.current.delete(oldestKey);
        }
        modelCacheRef.current.set(src, true);

        // Remove o link após um tempo para não poluir o DOM
        setTimeout(() => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        }, 5000);
      } catch (error) {
        console.warn('Erro ao pré-carregar modelo:', error);
      }
    },
    [maxCacheSize]
  );

  const isModelCached = useCallback((src: string) => {
    return modelCacheRef.current.has(src);
  }, []);

  const clearModelCache = useCallback((src?: string) => {
    if (src) {
      modelCacheRef.current.delete(src);
    } else {
      modelCacheRef.current.clear();
    }
  }, []);

  // Pré-carrega modelos importantes quando o provider é montado
  React.useEffect(() => {
    preloadImportantModels.forEach((src) => {
      preloadModel(src);
    });
  }, [preloadImportantModels, preloadModel]);

  const value = {
    preloadModel,
    isModelCached,
    clearModelCache
  };

  return (
    <ModelViewer3DContext.Provider value={value}>
      {children}
    </ModelViewer3DContext.Provider>
  );
}

export function useModelViewer3D() {
  const context = useContext(ModelViewer3DContext);
  if (!context) {
    throw new Error(
      'useModelViewer3D deve ser usado dentro de ModelViewer3DProvider'
    );
  }
  return context;
}

// Hook para observar performance dos modelos 3D
export function useModelPerformanceMonitor() {
  const logPerformance = useCallback(
    (modelSrc: string, action: string, duration?: number) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[3D Performance] ${action} - ${modelSrc}${duration ? ` (${duration}ms)` : ''}`
        );
      }
    },
    []
  );

  const measureLoadTime = useCallback(
    (modelSrc: string) => {
      const startTime = performance.now();

      return () => {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        logPerformance(modelSrc, 'Carregamento concluído', duration);
      };
    },
    [logPerformance]
  );

  return {
    logPerformance,
    measureLoadTime
  };
}
