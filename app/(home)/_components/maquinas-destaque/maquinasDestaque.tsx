import { TextAnimate } from '@/components/ui/text-animate';

import CardGridSket from './cardsGridMaquinas';

export default function MaquinasDestaque() {
  return (
    <div className='mx-auto flex w-full flex-col items-center justify-center gap-4 px-4 py-10 md:gap-5'>
      <div className='w-full max-w-6xl'>
        <TextAnimate animation='blurInUp' by='word' as='h2' once startOnView className='text-2xl font-bold mb-3 md:text-3xl'>
          Máquinas em Destaque
        </TextAnimate>
        <p className='text-muted-foreground text-sm md:text-base'>
          Conheça algumas das nossas linhas de máquinas em destaque
        </p>
      </div>
      <CardGridSket />
    </div>
  );
}
