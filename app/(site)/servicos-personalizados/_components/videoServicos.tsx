'use client';

import { useEffect, useRef } from 'react';

import { logger } from '@/lib/utils/logger';

// Toca só enquanto está na tela; fora dela, pausa e não consome banda.
export function VideoServicos() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;

    if (!video) return;

    const tocar = () =>
      video.play().catch((error: unknown) => {
        // pause() antes do play() terminar rejeita com AbortError; é esperado.
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        logger.warn('Vídeo de serviços não iniciou:', error);
      });

    if (typeof IntersectionObserver === 'undefined') {
      void tocar();

      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void tocar();
      } else {
        video.pause();
      }
    });

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      loop
      muted
      playsInline
      preload='metadata'
      poster='/videos/servico-personalizado-poster.webp'
      className='z-10 mb-3 h-48 w-full rounded-xs object-fill md:h-full md:object-cover'>
      <source src='/videos/servico-personalizado.webm' type='video/webm' />
      <source src='/videos/servico-personalizado.mp4' type='video/mp4' />
    </video>
  );
}
