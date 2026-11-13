import { render } from '@testing-library/react';

import { VideoServicos } from './videoServicos';
import { afterEach, describe, expect, it, vi } from 'vitest';

let avisar: IntersectionObserverCallback = () => {};

function naTela(visivel: boolean) {
  avisar(
    [{ isIntersecting: visivel } as IntersectionObserverEntry],
    {} as IntersectionObserver
  );
}

describe('VideoServicos', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('toca direto quando o navegador não tem IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);

    render(<VideoServicos />);

    expect(play).toHaveBeenCalledTimes(1);
  });

  it('só toca quando entra na tela e pausa ao sair', () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          avisar = cb;
        }
        observe() {}
        disconnect() {}
      }
    );
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {});

    const { container } = render(<VideoServicos />);
    const video = container.querySelector('video');

    expect(video).not.toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('preload', 'metadata');
    expect(video).toHaveAttribute(
      'poster',
      '/videos/servico-personalizado-poster.webp'
    );
    expect(play).not.toHaveBeenCalled();

    naTela(true);
    expect(play).toHaveBeenCalledTimes(1);

    naTela(false);
    expect(pause).toHaveBeenCalledTimes(1);
  });
});
