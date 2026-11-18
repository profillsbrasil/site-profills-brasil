let cached: boolean | null = null;

/**
 * Detecta suporte a WebGL criando um contexto descartável.
 * Resultado memoizado por sessão (no client).
 */
export function isWebGLAvailable() {
  if (cached !== null) return cached;

  if (typeof window === 'undefined') return true;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    cached = gl !== null;
  } catch {
    cached = false;
  }

  return cached;
}

/** Apenas para testes: limpa o resultado memoizado. */
export function resetWebGLCache() {
  cached = null;
}
