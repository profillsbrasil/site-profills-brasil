import { useEffect, useState } from 'react';

import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';

interface MaquinaCardProps {
  maquina: MaquinaCatalogo;
  index: number; // Para delay escalonado
  filtersApplied?: boolean; // Indica se os filtros foram aplicados da URL
}

// Subtítulo do card: parte após ' - ' de nomeCompleto; sem separador, cai na categoria
function subtituloDe(maquina: MaquinaCatalogo): string {
  const [, subtitulo] = maquina.nomeCompleto.split(' - ');
  return subtitulo ?? maquina.categoria;
}

export default function MaquinaCard({
  maquina,
  index,
  filtersApplied = false
}: MaquinaCardProps) {
  // Padronização: todos os cards com mesmas dimensões externas
  // e mesma proporção de conteúdo/rodapé para evitar desalinhamentos

  const [imgLoaded, setImgLoaded] = useState(false);
  const [pkgLoaded, setPkgLoaded] = useState(false);

  // Reset dos estados quando a máquina muda (importante para filtros)
  useEffect(() => {
    setImgLoaded(false);
    setPkgLoaded(false);
  }, [maquina.slug]);

  // Delay escalonado para animação suave (máximo 0.3s para melhor performance)
  const animationDelay = Math.min(index * 0.03, 0.3);

  return (
    <AnimatedContainer
      delay={animationDelay}
      trigger={filtersApplied ? 'mount' : 'inView'} // Usa "mount" quando filtros aplicados da URL
      once={!filtersApplied} // Permite reanimação quando filtros mudam
      amount={0.1} // Dispara quando 10% do elemento está visível
      className={`group flex h-[28rem] w-full flex-col md:h-[32rem]`}>
      {/* Moldura blueprint: mídia no quadro tracejado com cantoneiras accent */}
      <div
        className={`relative h-[86%] w-full rounded-t-xs border border-dashed border-[rgba(148,178,235,0.3)] px-2 transition-colors duration-300 group-hover:border-[rgba(148,178,235,0.55)]`}>
        <span
          aria-hidden
          className='absolute -top-px -left-px z-10 h-2 w-2 border-t border-l border-accent'
        />
        <span
          aria-hidden
          className='absolute -right-px -bottom-px z-10 h-2 w-2 border-r border-b border-accent'
        />
        {maquina.imagens ? (
          <>
            <Image
              src={maquina.imagens.maquina}
              alt='Máquina'
              width={400}
              height={300}
              loading={'eager'} // Primeiras 9 imagens carregam imediatamente
              onLoad={() => setImgLoaded(true)}
              className={`${
                maquina.imagens.maquinaClassName ||
                'h-full w-full object-contain'
              } transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            <Image
              src={maquina.imagens.embalagem}
              alt='Embalagem'
              width={200}
              height={150}
              loading={'eager'} // Primeiras 9 imagens carregam imediatamente
              onLoad={() => setPkgLoaded(true)}
              className={`${
                maquina.imagens.embalagemClassName ||
                'absolute right-3 bottom-0 h-1/2 w-auto max-w-[65%] object-contain'
              } transition-opacity duration-300 ${pkgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        ) : (
          // Máquinas de engenharia não têm foto de catálogo: miolo sólido com
          // rótulo técnico (o nome já aparece no rodapé do card).
          <div className='flex h-full w-full flex-col items-center justify-center gap-2 rounded-t-xs bg-slate-900/60'>
            <span className='text-accent font-mono text-2xl'>+</span>
            <span className='text-muted-foreground/70 px-4 text-center font-mono text-[11px] tracking-[0.2em] uppercase'>
              Engenharia
              <br />
              sob projeto
            </span>
          </div>
        )}
      </div>
      <div
        className={`flex h-[14%] w-full flex-col items-center justify-center rounded-b-xs border border-t-0 border-dashed border-[rgba(148,178,235,0.22)] bg-slate-900/60 transition-colors duration-300 group-hover:bg-slate-900/85`}>
        <h2 className='text-base font-bold text-white md:text-lg'>
          {maquina.nome}
        </h2>
        <p className='text-muted-foreground text-xs md:text-sm'>
          {subtituloDe(maquina)}
        </p>
      </div>
    </AnimatedContainer>
  );
}
