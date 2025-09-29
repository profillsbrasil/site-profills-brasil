// types/model-viewer.d.ts
import type React from 'react';

declare global {
  interface ModelViewerElement extends HTMLElement {
    // Props/propriedades como propriedades JS (algumas chaveiam atributos)
    src?: string;
    iosSrc?: string; // iOS Quick Look (.usdz)
    alt?: string;
    poster?: string;
    loading?: 'lazy' | 'eager';
    reveal?: 'auto' | 'interaction' | 'manual';

    ar?: boolean;
    arModes?: 'webxr scene-viewer quick-look' | string; // space-separated
    arScale?: 'auto' | 'fixed';
    arPlacement?: 'floor' | 'wall';
    disableAr?: boolean;

    cameraControls?: boolean;
    cameraOrbit?: string; // ex: "40deg 75deg 105%"
    minCameraOrbit?: string; // ex: "auto auto 50%"
    maxCameraOrbit?: string; // ex: "auto auto 200%"
    cameraTarget?: string; // ex: "0m 0m 0m" | "auto"
    fieldOfView?: string; // ex: "45deg"
    minFieldOfView?: string;
    maxFieldOfView?: string;
    interpolationDecay?: number | string; // amortecimento ao parar interação

    autoRotate?: boolean;
    autoRotateDelay?: number | string; // ms
    rotationPerSecond?: string; // ex: "30deg"

    disableZoom?: boolean;
    disablePan?: boolean;

    environmentImage?: 'neutral' | string; // HDR/EXR/etc
    skyboxImage?: string; // imagem 360
    exposure?: number | string;
    shadowIntensity?: number | string;
    shadowSoftness?: number | string;
    toneMapping?: 'neutral' | 'aces' | 'reinhard' | 'linsrgb' | string;

    interactionPrompt?: 'auto' | 'none' | 'when-focused';
    interactionPromptStyle?: 'basic' | 'wiggle';

    // Animação/variantes
    animationName?: string; // nome da animação GLTF
    animationCrossfadeDuration?: number | string; // ms
    autoplay?: boolean;
    variantName?: string; // material variant
    orientation?: string; // ex: "0deg 0deg 0deg"
    scale?: string; // ex: "1 1 1"

    // Métodos úteis (subset mais usados)
    play: () => void;
    pause: () => void;
    showPoster: () => void;
    dismissPoster: () => void;

    // Eventos (como propriedades)
    onLoad?: (ev: Event) => void;
    onError?: (ev: Event) => void;
    onModelVisibility?: (ev: Event) => void;
    onCameraChange?: (ev: Event) => void;
    onArStatus?: (ev: Event) => void;
    onPlay?: (ev: Event) => void;
    onPause?: (ev: Event) => void;
  }

  type MVBaseProps = React.DetailedHTMLProps<
    React.HTMLAttributes<ModelViewerElement>,
    ModelViewerElement
  >;

  interface ModelViewerAttributes extends MVBaseProps {
    // Atributos refletidos (versão JSX/React das props acima)
    src?: string;
    'ios-src'?: string;
    alt?: string;
    poster?: string;
    loading?: 'lazy' | 'eager';
    reveal?: 'auto' | 'interaction' | 'manual';

    ar?: boolean;
    'ar-modes'?: 'webxr scene-viewer quick-look' | string;
    'ar-scale'?: 'auto' | 'fixed';
    'ar-placement'?: 'floor' | 'wall';
    'disable-ar'?: boolean;

    'camera-controls'?: boolean;
    'camera-orbit'?: string;
    'min-camera-orbit'?: string;
    'max-camera-orbit'?: string;
    'camera-target'?: string;
    'field-of-view'?: string;
    'min-field-of-view'?: string;
    'max-field-of-view'?: string;
    'interpolation-decay'?: number | string;

    'auto-rotate'?: boolean;
    'auto-rotate-delay'?: number | string;
    'rotation-per-second'?: string;

    'disable-zoom'?: boolean;
    'disable-pan'?: boolean;

    'environment-image'?: 'neutral' | string;
    'skybox-image'?: string;
    exposure?: number | string;
    'shadow-intensity'?: number | string;
    'shadow-softness'?: number | string;
    'tone-mapping'?: 'neutral' | 'aces' | 'reinhard' | 'linsrgb' | string;

    'interaction-prompt'?: 'auto' | 'none' | 'when-focused';
    'interaction-prompt-style'?: 'basic' | 'wiggle';

    'animation-name'?: string;
    'animation-crossfade-duration'?: number | string;
    autoplay?: boolean;
    'variant-name'?: string;
    orientation?: string;
    scale?: string;

    // Eventos (versão React onX)
    onLoad?: (ev: Event) => void;
    onError?: (ev: Event) => void;
    onModelVisibility?: (ev: Event) => void;
    onCameraChange?: (ev: Event) => void;
    onArStatus?: (ev: Event) => void;
    onPlay?: (ev: Event) => void;
    onPause?: (ev: Event) => void;
  }

  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes;
    }
  }
}
export {};
