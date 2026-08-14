import { render } from '@testing-library/react';

import { VideoMaquina } from '../videoMaquina';
import { describe, expect, it } from 'vitest';

describe('VideoMaquina', () => {
  it('não renderiza NADA sem vídeo (nem section, nem placeholder)', () => {
    const { container } = render(<VideoMaquina nome='X' />);
    expect(container.innerHTML).toBe('');
  });

  it('renderiza o player quando há vídeo', () => {
    const { container } = render(
      <VideoMaquina
        nome='Pouch Speed'
        video={{
          src: '/videos/maquinas/teste.mp4',
          poster: '/videos/maquinas/teste.webp'
        }}
      />
    );
    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute('poster', '/videos/maquinas/teste.webp');
    expect(container.querySelector('#video')).not.toBeNull();
  });
});
