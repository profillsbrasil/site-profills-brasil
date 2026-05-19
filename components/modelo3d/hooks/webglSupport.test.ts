import { afterEach, describe, expect, it, vi } from 'vitest';

import { isWebGLAvailable, resetWebGLCache } from './webglSupport';

afterEach(() => {
  resetWebGLCache();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('isWebGLAvailable', () => {
  it('retorna true quando o canvas fornece um contexto webgl', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as WebGL2RenderingContext
    );
    expect(isWebGLAvailable()).toBe(true);
  });

  it('retorna false quando nenhum contexto webgl é criado', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    expect(isWebGLAvailable()).toBe(false);
  });

  it('retorna false quando getContext lança', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => {
        throw new Error('webgl disabled');
      }
    );
    expect(isWebGLAvailable()).toBe(false);
  });

  it('assume true em ambiente sem window (SSR)', () => {
    vi.stubGlobal('window', undefined);
    expect(isWebGLAvailable()).toBe(true);
  });
});
