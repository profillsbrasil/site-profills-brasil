'use client';

import {
  FileInput,
  FileInputDropzone,
  FileInputTrigger
} from '@ui-sdk/react/file-input';

import { ImagePlus } from 'lucide-react';

type Props = {
  src: string | null;
  rotulo: string;
  proporcao?: 'larga' | 'foto';
  onEscolher: (src: string) => void;
};

export function EscolherImagem({
  src,
  rotulo,
  proporcao = 'larga',
  onEscolher
}: Props) {
  const escolher = (arquivos: readonly File[]) => {
    const [arquivo] = arquivos;

    if (!arquivo) return;

    if (src?.startsWith('blob:')) URL.revokeObjectURL(src);
    onEscolher(URL.createObjectURL(arquivo));
  };

  return (
    <FileInput accept='image/*' onValueChange={escolher}>
      <FileInputDropzone className='group/zona relative'>
        <FileInputTrigger
          aria-label={src ? `Trocar ${rotulo}` : `Enviar ${rotulo}`}
          className={`relative block w-full overflow-hidden rounded-xs border border-dashed border-[#8a90a0] bg-[#0f172b] bg-contain bg-center bg-no-repeat transition-colors outline-none group-data-dragging/zona:border-solid group-data-dragging/zona:border-[#3b80f6] hover:border-solid hover:border-[#3b80f6] focus-visible:border-solid focus-visible:border-[#3b80f6] motion-reduce:transition-none ${proporcao === 'larga' ? 'aspect-[16/7]' : 'aspect-[4/3]'}`}
          style={src ? { backgroundImage: `url(${src})` } : undefined}>
          {src ? (
            <span className='absolute right-2 bottom-2 rounded-xs bg-white px-2 py-1 text-xs font-semibold text-[#1b1c1f]'>
              Trocar imagem
            </span>
          ) : (
            <span className='flex h-full flex-col items-center justify-center gap-1.5 p-3 text-center text-xs text-[#b6c5e2]'>
              <ImagePlus aria-hidden='true' className='size-5 text-white' />
              Clique para enviar ou solte a imagem aqui
            </span>
          )}
        </FileInputTrigger>
      </FileInputDropzone>
    </FileInput>
  );
}
