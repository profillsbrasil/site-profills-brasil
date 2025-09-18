"use client";

import { useOptimized3DModel } from "@/hooks/useOptimized3DModel";

interface OptimizedEmbalagem3dProps {
  modelSrc?: string;
  alt?: string;
  className?: string;
  autoRotate?: boolean;
  cameraOrbit?: string;
  placeholder?: React.ReactNode;
}

export function OptimizedEmbalagem3d({
  modelSrc = "/caixa-teste-3d.glb",
  alt = "Modelo 3D - Embalagem",
  className = "",
  autoRotate = true,
  cameraOrbit = "40deg 75deg 105%",
  placeholder,
}: OptimizedEmbalagem3dProps) {
  const {
    containerRef,
    modelViewerRef,
    isVisible,
    isLoaded,
    shouldRender,
    hasBeenLoaded,
    handleModelLoad,
    handleModelError,
  } = useOptimized3DModel({
    src: modelSrc,
    threshold: 0.1,
    rootMargin: "100px",
  });

  return (
    <div
      ref={containerRef}
      className={`flex h-full w-full items-center justify-center ${className}`}
    >
      {/* Model-viewer: Uma vez carregado, sempre renderizado mas com visibilidade controlada */}
      {shouldRender && isLoaded && (
        // @ts-expect-error O modelo 3D model-viewer não tem tipos nativos para React
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          alt={alt}
          camera-controls
          camera-orbit={cameraOrbit}
          min-camera-orbit="auto auto 50%"
          max-camera-orbit="auto auto 200%"
          disable-pan={true}
          disable-zoom={true}
          auto-rotate={autoRotate && isVisible} // Só roda animação se estiver visível
          auto-rotate-delay="500"
          environment-image="neutral"
          shadow-intensity="1"
          exposure="1"
          interaction-prompt="none"
          loading="lazy"
          reveal="auto"
          onLoad={handleModelLoad}
          onError={handleModelError}
          style={{
            width: "100%",
            height: "250px",
            minHeight: "250px",
            backgroundColor: "transparent",
            "--poster-color": "transparent",
            opacity: isVisible ? 1 : 0.3, // Reduz opacidade quando não visível
            pointerEvents: isVisible ? "auto" : "none", // Desabilita interação quando não visível
          }}
          className={`transition-all duration-300 ${
            isVisible ? "hover:scale-[1.02]" : ""
          }`}
        >
          {/* @ts-expect-error Tag fechamento do model-viewer não tem tipos nativos para React */}
        </model-viewer>
      )}

      {/* Placeholder: Só mostra se o modelo nunca foi carregado */}
      {(!shouldRender || !isLoaded) && (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ minHeight: "250px" }}
        >
          {placeholder || (
            <div className="text-muted-foreground flex flex-col items-center justify-center space-y-2">
              {isVisible && !hasBeenLoaded ? (
                <>
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  <span className="text-sm">Carregando modelo 3D...</span>
                </>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-sm bg-gradient-to-br from-slate-700 to-slate-800">
                  <span className="text-xs text-slate-400">Modelo 3D</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
