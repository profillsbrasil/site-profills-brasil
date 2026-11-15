'use client';

import { useState } from 'react';

import { motivosImagem } from '@/lib/blog/erro';
import { IMAGEM_LIMITE_BYTES, IMAGEM_TIPOS_ACEITOS } from '@/lib/blog/tipos';
import {
  FileInput,
  FileInputDropzone,
  FileInputTrigger,
  type FileRejection
} from '@ui-sdk/react/file-input';

import { useEnvioImagem } from './envio-imagem';
import { ImagePlus, LoaderCircle } from 'lucide-react';

type Props = {
  src: string | null;
  rotulo: string;
  proporcao?: 'larga' | 'foto';
  onEscolher: (src: string) => void;
};

const motivoRecusa = ([recusa]: FileRejection[]) =>
  recusa?.reasons.includes('file-too-large')
    ? motivosImagem.tamanho
    : motivosImagem.tipo;

export function EscolherImagem({
  src,
  rotulo,
  proporcao = 'larga',
  onEscolher
}: Props) {
  const { enviar, recusar } = useEnvioImagem();
  const [enviando, setEnviando] = useState(false);

  const escolher = async (arquivos: readonly File[]) => {
    const [arquivo] = arquivos;

    if (!arquivo) return;

    setEnviando(true);
    const caminho = await enviar(arquivo);
    setEnviando(false);

    if (caminho) onEscolher(caminho);
  };

  return (
    <FileInput
      accept={IMAGEM_TIPOS_ACEITOS.join(',')}
      maxSize={IMAGEM_LIMITE_BYTES}
      disabled={enviando}
      onValueChange={(arquivos) => void escolher(arquivos)}
      onReject={(recusas) => recusar(motivoRecusa(recusas))}>
      <FileInputDropzone className='group/zona relative'>
        <FileInputTrigger
          aria-label={src ? `Trocar ${rotulo}` : `Enviar ${rotulo}`}
          aria-busy={enviando}
          className={`relative block w-full overflow-hidden rounded-xs border border-dashed border-[#8a90a0] bg-[#0f172b] bg-contain bg-center bg-no-repeat transition-colors outline-none group-data-dragging/zona:border-solid group-data-dragging/zona:border-[#3b80f6] hover:border-solid hover:border-[#3b80f6] focus-visible:border-solid focus-visible:border-[#3b80f6] motion-reduce:transition-none ${proporcao === 'larga' ? 'aspect-[16/7]' : 'aspect-[4/3]'}`}
          style={src ? { backgroundImage: `url(${src})` } : undefined}>
          {enviando ? (
            <span className='flex h-full items-center justify-center gap-2 bg-[rgba(15,23,43,0.7)] text-xs font-medium text-white'>
              <LoaderCircle
                aria-hidden='true'
                className='size-4 animate-spin motion-reduce:animate-none'
              />
              Enviando imagem
            </span>
          ) : src ? (
            <span className='absolute right-2 bottom-2 rounded-xs bg-white px-2 py-1 text-xs font-medium text-[#1b1c1f]'>
              Trocar imagem
            </span>
          ) : (
            <span className='flex h-full flex-col items-center justify-center gap-2 p-3 text-center text-xs text-[#b6c5e2]'>
              <ImagePlus aria-hidden='true' className='size-5 text-white' />
              Clique para enviar ou solte a imagem aqui
              <span className='text-xs'>PNG, JPEG, WebP ou AVIF, até 5 MB</span>
            </span>
          )}
        </FileInputTrigger>
      </FileInputDropzone>
    </FileInput>
  );
}
