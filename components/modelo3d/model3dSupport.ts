export const MODEL_3D_SUPPORT_STORAGE_KEY = 'profills:model3d:webgl-support';

export type Model3DFallbackReason =
  | 'unsupported-webgl'
  | 'webglcontextlost'
  | 'load-error';

export type Model3DSupportStatus = 'unknown' | 'supported' | 'unsupported';
export type PersistedModel3DSupportValue =
  | 'supported'
  | 'unsupported-webgl'
  | 'webglcontextlost';
export type Model3DRenderMode = 'fallback' | 'poster' | 'model';

export interface Model3DSupportState {
  status: Model3DSupportStatus;
  reason: Exclude<Model3DFallbackReason, 'load-error'> | null;
}

export const DEFAULT_MODEL_3D_SUPPORT_STATE: Model3DSupportState = {
  reason: null,
  status: 'unknown'
};

export const parseStoredModel3DSupport = (
  value: string | null
): Model3DSupportState | null => {
  switch (value) {
    case 'supported':
      return {
        reason: null,
        status: 'supported'
      };
    case 'unsupported-webgl':
      return {
        reason: 'unsupported-webgl',
        status: 'unsupported'
      };
    case 'webglcontextlost':
      return {
        reason: 'webglcontextlost',
        status: 'unsupported'
      };
    default:
      return null;
  }
};

export const resolveModel3DRenderMode = ({
  shouldMountModelViewer,
  shouldShowPoster,
  supportStatus
}: {
  shouldMountModelViewer: boolean;
  shouldShowPoster: boolean;
  supportStatus: Model3DSupportStatus;
}): Model3DRenderMode => {
  if (supportStatus === 'unsupported') {
    return 'fallback';
  }

  if (shouldMountModelViewer) {
    return 'model';
  }

  if (shouldShowPoster) {
    return 'poster';
  }

  return 'fallback';
};

const hasErrorDetailType = (
  value: unknown
): value is { detail?: { type?: unknown } } =>
  typeof value === 'object' && value !== null && 'detail' in value;

export const getFallbackReasonFromModelViewerError = (
  event: unknown
): Model3DFallbackReason => {
  if (
    hasErrorDetailType(event) &&
    event.detail !== undefined &&
    typeof event.detail === 'object' &&
    event.detail !== null &&
    'type' in event.detail &&
    event.detail.type === 'webglcontextlost'
  ) {
    return 'webglcontextlost';
  }

  return 'load-error';
};

const readSessionStorageValue = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    return window.sessionStorage.getItem(MODEL_3D_SUPPORT_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const readCachedModel3DSupport = (): Model3DSupportState | null => {
  return parseStoredModel3DSupport(readSessionStorageValue());
};

const writeSessionStorageValue = (
  value: PersistedModel3DSupportValue | null
): void => {
  if (typeof window === 'undefined') return;

  try {
    if (value === null) {
      window.sessionStorage.removeItem(MODEL_3D_SUPPORT_STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(MODEL_3D_SUPPORT_STORAGE_KEY, value);
  } catch {
    // Ignore sessionStorage failures and continue with in-memory state.
  }
};

export const persistModel3DSupport = (
  state: Model3DSupportState
): PersistedModel3DSupportValue | null => {
  if (state.status === 'supported') {
    writeSessionStorageValue('supported');
    return 'supported';
  }

  if (state.status === 'unsupported' && state.reason !== null) {
    writeSessionStorageValue(state.reason);
    return state.reason;
  }

  writeSessionStorageValue(null);
  return null;
};

export const disableModel3DForSession = (
  reason: Exclude<Model3DFallbackReason, 'load-error'>
): Model3DSupportState => {
  const state: Model3DSupportState = {
    reason,
    status: 'unsupported'
  };

  persistModel3DSupport(state);

  return state;
};

export const enableModel3DForSession = (): Model3DSupportState => {
  const state: Model3DSupportState = {
    reason: null,
    status: 'supported'
  };

  persistModel3DSupport(state);

  return state;
};

export const detectModel3DSupport = (): Model3DSupportState => {
  const cachedState = readCachedModel3DSupport();
  if (cachedState !== null) {
    return cachedState;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_MODEL_3D_SUPPORT_STATE;
  }

  const canvas = document.createElement('canvas');

  try {
    const webgl2Context = canvas.getContext('webgl2');
    const webglContext =
      webgl2Context ?? canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl');

    if (webglContext === null) {
      return disableModel3DForSession('unsupported-webgl');
    }

    return enableModel3DForSession();
  } catch {
    return disableModel3DForSession('unsupported-webgl');
  }
};
