import { AnimatedContainer } from '@/components/AnimatedContainer';

interface VideoMaquinaProps {
  video?: { src: string; poster?: string };
  nome: string;
}

export function VideoMaquina({ video, nome }: VideoMaquinaProps) {
  if (!video) return null;

  return (
    <section id='video' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer>
        <h2 className='text-lg font-bold text-white md:text-xl'>
          Veja a {nome} em operação
        </h2>
        <div className='relative mt-4 border border-dashed border-[rgba(148,178,235,0.35)] p-2'>
          <video
            controls
            preload='metadata'
            poster={video.poster}
            className='w-full'
            src={video.src}
          />
        </div>
      </AnimatedContainer>
    </section>
  );
}
