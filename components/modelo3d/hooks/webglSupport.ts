let cached: boolean | null = null;

/**
 * Detecta suporte a WebGL criando um contexto descartável.
 * Resultado memoizado por sessão (no client).
 */
export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached;

  // SSR: assume suporte; a detecção real roda no client e não é memoizada aqui.
  if (typeof window === 'undefined') return true;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    cached = gl !== null;
  } catch {
    // getContext pode lançar quando WebGL está bloqueado — isso significa indisponível.
    cached = false;
  }

  return cached;
}

/** Apenas para testes: limpa o resultado memoizado. */
export function resetWebGLCache(): void {
  cached = null;
}
