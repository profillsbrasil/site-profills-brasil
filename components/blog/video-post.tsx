'use client';

import { useState } from 'react';

import { Moldura } from './moldura';
import { Play } from 'lucide-react';

const focarAoMontar = (iframe: HTMLIFrameElement | null) => iframe?.focus();

/** O iframe do YouTube só entra no clique: a página não baixa o player de quem não assiste. */
export function VideoYoutube({ id, legenda }: { id: string; legenda: string }) {
  const [tocando, setTocando] = useState(false);

  return (
    <Moldura className='aspect-video'>
      {tocando ? (
        <iframe
          ref={focarAoMontar}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={legenda || 'Vídeo do post'}
          allow='autoplay; encrypted-media; picture-in-picture; fullscreen'
          className='absolute inset-0 size-full border-0'
        />
      ) : (
        <button
          type='button'
          onClick={() => setTocando(true)}
          aria-label={legenda ? `Tocar o vídeo: ${legenda}` : 'Tocar o vídeo'}
          className='group absolute inset-0 grid place-items-center focus-visible:outline-none'>
          <span className='grid size-16 place-items-center bg-accent text-white transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none'>
            <Play aria-hidden='true' className='size-6 fill-current' />
          </span>
        </button>
      )}
    </Moldura>
  );
}
