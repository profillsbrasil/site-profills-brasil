import { useCallback, useEffect, useRef, useState } from 'react';

import {
  DEFAULT_MODEL_3D_SUPPORT_STATE,
  detectModel3DSupport,
  disableModel3DForSession,
  getFallbackReasonFromModelViewerError,
  type Model3DFallbackReason,
  resolveModel3DRenderMode,
  type Model3DSupportState
} from '@/components/modelo3d/model3dSupport';

const MODEL_VIEWER_LIBRARY_CACHE_KEY = 'model-viewer-library';
const DEFAULT_UNMOUNT_DELAY_MS = 250;

const modelCache = new Map<string, boolean>();
let modelViewerLibraryPromise: Promise<void> | null = null;
let modelViewerStylesInjected = false;

const injectSharedModelViewerStyles = () => {
  if (modelViewerStylesInjected || typeof document === 'undefined') return;

  modelViewerStylesInjected = true;
  const style = document.createElement('style');
  style.id = 'model-viewer-optimized-styles';
  style.textContent = `
    model-viewer::part(default-progress-bar),
    model-viewer::part(default-progress-mask),
    model-viewer .default-progress-bar,
    model-viewer #default-progress-bar,
    model-viewer > div[slot="progress-bar"],
    model-viewer > .default-progress-bar {
      display: none !important;
    }

    model-viewer {
      --progress-bar-color: transparent;
      --progress-container-color: transparent;
      --progress-mask: transparent;
    }
  `;
  document.head.appendChild(style);
};

const loadModelViewerLibrary = async () => {
  if (modelCache.get(MODEL_VIEWER_LIBRARY_CACHE_KEY)) {
    injectSharedModelViewerStyles();
    return;
  }

  if (!modelViewerLibraryPromise) {
    modelViewerLibraryPromise = import('@google/model-viewer')
      .then(() => {
        modelCache.set(MODEL_VIEWER_LIBRARY_CACHE_KEY, true);
        injectSharedModelViewerStyles();
      })
      .catch((error) => {
        modelViewerLibraryPromise = null;
        throw error;
      });
  }

  await modelViewerLibraryPromise;
};

interface UseOptimized3DModelOptions {
  src: string;
  threshold?: number;
  rootMargin?: string;
  mountDelayMs?: number;
  unmountDelayMs?: number;
  eagerLoad?: boolean;
}

export function useOptimized3DModel({
  src,
  threshold = 0.1,
  rootMargin = '50px',
  mountDelayMs = 100,
  unmountDelayMs = DEFAULT_UNMOUNT_DELAY_MS,
  eagerLoad = false
}: UseOptimized3DModelOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelViewerRef = useRef<ModelViewerElement | null>(null);
  const mountTimeoutRef = useRef<number | null>(null);
  const unmountTimeoutRef = useRef<number | null>(null);

  const initialSupportState =
    detectModel3DSupport() ?? DEFAULT_MODEL_3D_SUPPORT_STATE;

  const [isVisible, setIsVisible] = useState(eagerLoad);
  const [isLoaded, setIsLoaded] = useState(
    modelCache.get(MODEL_VIEWER_LIBRARY_CACHE_KEY) === true
  );
  const [shouldMountModelViewer, setShouldMountModelViewer] =
    useState(eagerLoad && initialSupportState.status === 'supported');
  const [hasBeenLoaded, setHasBeenLoaded] = useState(
    modelCache.get(src) === true
  );
  const [supportState, setSupportState] =
    useState<Model3DSupportState>(initialSupportState);
  const [fallbackReason, setFallbackReason] =
    useState<Model3DFallbackReason | null>(
      initialSupportState.status === 'unsupported'
        ? initialSupportState.reason
        : null
    );

  const clearMountTimeout = useCallback(() => {
    if (mountTimeoutRef.current !== null) {
      window.clearTimeout(mountTimeoutRef.current);
      mountTimeoutRef.current = null;
    }
  }, []);

  const clearUnmountTimeout = useCallback(() => {
    if (unmountTimeoutRef.current !== null) {
      window.clearTimeout(unmountTimeoutRef.current);
      unmountTimeoutRef.current = null;
    }
  }, []);

  const ensureModelSupport = useCallback(() => {
    const nextSupportState = detectModel3DSupport();
    setSupportState(nextSupportState);

    if (nextSupportState.status === 'unsupported') {
      setFallbackReason(nextSupportState.reason);
      setShouldMountModelViewer(false);
      return false;
    }

    return true;
  }, []);

  const scheduleModelMount = useCallback(() => {
    clearUnmountTimeout();

    if (shouldMountModelViewer || fallbackReason === 'webglcontextlost') {
      return;
    }

    const commitMount = () => {
      if (!ensureModelSupport()) return;

      setFallbackReason(null);
      setShouldMountModelViewer(true);
    };

    if (mountDelayMs <= 0) {
      commitMount();
      return;
    }

    if (mountTimeoutRef.current !== null) {
      return;
    }

    mountTimeoutRef.current = window.setTimeout(() => {
      mountTimeoutRef.current = null;
      commitMount();
    }, mountDelayMs);
  }, [
    clearUnmountTimeout,
    ensureModelSupport,
    fallbackReason,
    mountDelayMs,
    shouldMountModelViewer
  ]);

  const scheduleModelUnmount = useCallback(() => {
    clearMountTimeout();

    if (!shouldMountModelViewer || eagerLoad) {
      return;
    }

    if (unmountDelayMs <= 0) {
      setShouldMountModelViewer(false);
      return;
    }

    if (unmountTimeoutRef.current !== null) {
      return;
    }

    unmountTimeoutRef.current = window.setTimeout(() => {
      setShouldMountModelViewer(false);
      unmountTimeoutRef.current = null;
    }, unmountDelayMs);
  }, [
    clearMountTimeout,
    eagerLoad,
    shouldMountModelViewer,
    unmountDelayMs
  ]);

  useEffect(
    () => () => {
      clearMountTimeout();
      clearUnmountTimeout();
    },
    [clearMountTimeout, clearUnmountTimeout]
  );

  useEffect(() => {
    const nextSupportState = detectModel3DSupport();
    setSupportState(nextSupportState);

    if (nextSupportState.status === 'unsupported') {
      setFallbackReason(nextSupportState.reason);
    }
  }, []);

  useEffect(() => {
    if (eagerLoad) {
      scheduleModelMount();
    }
  }, [eagerLoad, scheduleModelMount]);

  useEffect(() => {
    const observedElement = containerRef.current;
    if (!observedElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            scheduleModelMount();
          } else {
            setIsVisible(false);
            scheduleModelUnmount();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(observedElement);

    return () => {
      observer.unobserve(observedElement);
      observer.disconnect();
    };
  }, [rootMargin, scheduleModelMount, scheduleModelUnmount, threshold]);

  useEffect(() => {
    if (!shouldMountModelViewer || isLoaded || supportState.status !== 'supported') {
      return;
    }

    let isCancelled = false;

    const loadModelViewer = async () => {
      try {
        await loadModelViewerLibrary();

        if (!isCancelled) {
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Erro ao carregar model-viewer:', error);

        if (!isCancelled) {
          setFallbackReason('load-error');
          setShouldMountModelViewer(false);
        }
      }
    };

    void loadModelViewer();

    return () => {
      isCancelled = true;
    };
  }, [isLoaded, shouldMountModelViewer, supportState.status]);

  const handleModelLoad = useCallback(() => {
    if (modelViewerRef.current === null) return;

    modelCache.set(src, true);
    setFallbackReason(null);
    setHasBeenLoaded(true);
  }, [src]);

  const handleModelError = useCallback(
    (event: ModelViewerErrorEvent) => {
      const reason = getFallbackReasonFromModelViewerError(event);

      console.error('Erro ao carregar modelo 3D:', event);
      modelCache.delete(src);
      setFallbackReason(reason);
      setShouldMountModelViewer(false);

      if (reason === 'webglcontextlost') {
        setSupportState(disableModel3DForSession(reason));
        return;
      }

      setSupportState((currentSupportState) =>
        currentSupportState.status === 'unsupported'
          ? currentSupportState
          : {
              reason: null,
              status: 'supported'
            }
      );
    },
    [src]
  );

  const shouldRenderModelViewer =
    shouldMountModelViewer && isLoaded && fallbackReason === null;

  const renderMode =
    fallbackReason !== null
      ? 'fallback'
      : resolveModel3DRenderMode({
          shouldMountModelViewer: shouldRenderModelViewer,
          shouldShowPoster:
            eagerLoad || isVisible || shouldMountModelViewer || hasBeenLoaded,
          supportStatus: supportState.status
        });

  return {
    containerRef,
    fallbackReason,
    handleModelError,
    handleModelLoad,
    hasBeenLoaded,
    isLoaded,
    isVisible,
    modelViewerRef,
    renderMode,
    shouldRender: shouldRenderModelViewer,
    supportState
  };
}
