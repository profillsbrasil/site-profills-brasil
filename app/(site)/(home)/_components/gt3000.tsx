import Image from 'next/image';

import { Highlighter } from '@/components/magicui/highlighter';
import { Marquee } from '@/components/magicui/marquee';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import imageGt3000 from '@/public/images/gt3000NoBg.png';

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
    <section className='z-20 flex h-full w-full flex-col items-center justify-center gap-6 px-4 pt-10 pb-16 md:gap-8 md:pt-14 md:pb-20'>
      <div className='relative flex h-full w-full max-w-7xl flex-col items-center justify-center'>
        <div className='mb-6 flex flex-col items-center justify-center text-center md:mb-8'>
          <div className='flex flex-col items-center justify-center gap-1 md:flex-row md:gap-2'>
            <TextAnimate
              animation='blurInUp'
              by='word'
              as='h2'
              once
              startOnView
              className='mb-1 text-2xl font-bold md:mb-2 md:text-3xl'>
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

        <BlurFade delay={0.2} inView className='w-full'>
          <Image
            src={imageGt3000}
            sizes='(max-width: 768px) 100vw, 80vw'
            className='h-56 w-full object-contain [mask-image:radial-gradient(95%_130%_at_50%_45%,black_62%,transparent_100%)] md:h-[28rem]'
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
    // Placa técnica: mesma linguagem dos cards de "Como podemos ajudar"
    <div className='relative z-10 h-full w-52 rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60 p-4 transition-colors duration-300 hover:border-solid hover:border-accent hover:bg-slate-900/85 md:w-64 md:p-5'>
      <span
        aria-hidden
        className='absolute top-0.5 right-1.5 font-mono text-xs text-[rgba(148,178,235,0.4)]'>
        +
      </span>
      <div className='mb-3 flex items-center gap-3'>
        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xs bg-accent/10 md:h-9 md:w-9'>
          <IconCard className='h-4 w-4 text-accent md:h-5 md:w-5' />
        </div>
        <span className='text-xs font-semibold text-white md:text-sm'>
          {title}
        </span>
      </div>
      <p className='text-muted-foreground text-xs leading-relaxed md:text-sm'>
        {description}
      </p>
    </div>
  );
};
