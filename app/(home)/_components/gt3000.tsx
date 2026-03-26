import Image from 'next/image';

import { Highlighter } from '@/components/magicui/highlighter';
import { Marquee } from '@/components/magicui/marquee';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import imageGt3000 from '@/public/images/gt3000.png';

import type { LucideIcon } from 'lucide-react';
import {
  Layers,
  LayoutGrid,
  Package,
  Palette,
  Recycle,
  Truck
} from 'lucide-react';

export type Diferencial = {
  IconCard: LucideIcon;
  title: string;
  description: string;
};

export const diferenciaisDaGt3000: Diferencial[] = [
  {
    IconCard: Package,
    title: 'Compacta no pré-envase',
    description: 'Ocupa menos espaço em estoque e reduz custo de transporte.'
  },
  {
    IconCard: Layers,
    title: 'Cubagem otimizada',
    description:
      'Base quadrada facilita palletização e aproveita melhor o volume.'
  },
  {
    IconCard: Palette,
    title: 'Grande área de marca',
    description: 'Até 8 painéis personalizáveis para impressão e comunicação.'
  },
  {
    IconCard: LayoutGrid,
    title: 'Exposição eficiente',
    description: 'Formato que organiza melhor as gôndolas e destaca o produto.'
  },
  {
    IconCard: Recycle,
    title: 'Sem alumínio',
    description: 'Compatível com cadeia de reciclagem de papel/celulose.'
  },
  {
    IconCard: Truck,
    title: 'Sem logística reversa',
    description: 'Simplifica a operação ao dispensar retorno de embalagens.'
  }
];

const row = diferenciaisDaGt3000.slice(0, diferenciaisDaGt3000.length);

export default function Gt3000() {
  return (
    <section className='z-20 flex h-full w-full flex-col items-center justify-center gap-8 px-4 py-16 md:gap-12 md:py-24'>
      <div className='relative flex h-full w-full max-w-7xl flex-col items-center justify-center'>
        <div className='mb-6 flex flex-col items-center justify-center text-center md:mb-8'>
          <div className='flex flex-col items-center justify-center gap-1 md:flex-row md:gap-2'>
            <TextAnimate animation='blurInUp' by='word' as='h2' once startOnView className='mb-1 text-2xl font-bold md:mb-2 md:text-3xl'>
              Linha de Produção
            </TextAnimate>
            <Highlighter
              action='underline'
              
              animationDuration={4000}
              textColor='text-2xl font-bold mb-1 md:text-3xl md:mb-2'>
              GT-3000
            </Highlighter>
          </div>
          <p className='text-muted-foreground text-sm md:text-lg'>
            A linha de produção GT-3000 é a mais moderna e eficiente do mercado.
          </p>
        </div>

        <BlurFade delay={0.2} inView>
          <Image
            src={imageGt3000}
            sizes='(max-width: 768px) 100vw, 80vw'
            className='h-48 w-full rounded-xs object-contain md:h-96 md:object-cover'
            alt='GT-3000'
          />
        </BlurFade>
      </div>
      <div className='z-20 container mx-auto w-full'>
        <div className='relative flex w-full flex-col items-center justify-center overflow-hidden'>
          <Marquee
            pauseOnHover
            className='[--duration:30s] md:[--duration:20s]'>
            {row.map((diferencial) => (
              <MarqueeCard key={diferencial.title} {...diferencial} />
            ))}
          </Marquee>

          <div className='from-background pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r md:w-1/6'></div>
          <div className='from-background pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l md:w-1/6'></div>
        </div>
      </div>
    </section>
  );
}

const MarqueeCard = ({
  IconCard,
  title,
  description
}: {
  IconCard: LucideIcon;
  title: string;
  description: string;
}) => {
  return (
    <div className='hover:bg-muted bg-background relative z-10 h-full w-52 cursor-pointer overflow-hidden rounded-xs border border-border p-4 shadow-md transition-all duration-300 hover:shadow-lg md:w-64 md:p-5'>
      <div className='mb-3 flex items-center gap-3'>
        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xs bg-accent/10 md:h-9 md:w-9'>
          <IconCard className='h-4 w-4 text-foreground md:h-5 md:w-5' />
        </div>
        <span className='text-xs font-semibold md:text-sm'>
          {title}
        </span>
      </div>
      <p className='text-muted-foreground text-xs leading-relaxed md:text-sm'>
        {description}
      </p>
    </div>
  );
};
