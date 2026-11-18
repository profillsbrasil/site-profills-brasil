import type React from 'react';

declare global {
  interface ModelViewerElement extends HTMLElement {
    src?: string;
    iosSrc?: string;
    alt?: string;
    poster?: string;
    loading?: 'lazy' | 'eager';
    reveal?: 'auto' | 'interaction' | 'manual';

    ar?: boolean;
    arModes?: string;
    arScale?: 'auto' | 'fixed';
    arPlacement?: 'floor' | 'wall';
    disableAr?: boolean;

    cameraControls?: boolean;
    cameraOrbit?: string;
    minCameraOrbit?: string;
    maxCameraOrbit?: string;
    cameraTarget?: string;
    fieldOfView?: string;
    minFieldOfView?: string;
    maxFieldOfView?: string;
    interpolationDecay?: number | string;

    autoRotate?: boolean;
    autoRotateDelay?: number | string;
    rotationPerSecond?: string;

    disableZoom?: boolean;
    disablePan?: boolean;

    environmentImage?: string;
    skyboxImage?: string;
    exposure?: number | string;
    shadowIntensity?: number | string;
    shadowSoftness?: number | string;
    toneMapping?: string;

    interactionPrompt?: 'auto' | 'none' | 'when-focused';
    interactionPromptStyle?: 'basic' | 'wiggle';

    animationName?: string;
    animationCrossfadeDuration?: number | string;
    autoplay?: boolean;
    variantName?: string;
    orientation?: string;
    scale?: string;

    play: () => void;
    pause: () => void;
    showPoster: () => void;
    dismissPoster: () => void;

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
    src?: string;
    'ios-src'?: string;
    alt?: string;
    poster?: string;
    loading?: 'lazy' | 'eager';
    reveal?: 'auto' | 'interaction' | 'manual';

    ar?: boolean;
    'ar-modes'?: string;
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

    'environment-image'?: string;
    'skybox-image'?: string;
    exposure?: number | string;
    'shadow-intensity'?: number | string;
    'shadow-softness'?: number | string;
    'tone-mapping'?: string;

    'interaction-prompt'?: 'auto' | 'none' | 'when-focused';
    'interaction-prompt-style'?: 'basic' | 'wiggle';

    'animation-name'?: string;
    'animation-crossfade-duration'?: number | string;
    autoplay?: boolean;
    'variant-name'?: string;
    orientation?: string;
    scale?: string;

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
