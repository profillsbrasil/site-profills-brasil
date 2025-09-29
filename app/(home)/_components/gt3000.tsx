import Image from 'next/image';

import { Highlighter } from '@/components/magicui/highlighter';
import { Marquee } from '@/components/magicui/marquee';
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
    <section className='z-20 flex h-full w-full flex-col items-center justify-center gap-6 px-4 pb-10 md:gap-8'>
      <div className='relative flex h-full w-full max-w-7xl flex-col items-center justify-center'>
        <div className='mb-6 flex flex-col items-center justify-center text-center md:mb-8'>
          <div className='flex flex-col items-center justify-center gap-1 md:flex-row md:gap-2'>
            <h2 className='mb-1 text-2xl font-bold md:mb-2 md:text-3xl'>
              Linha de Produção
            </h2>
            <Highlighter
              action='underline'
              color='#2d62ef'
              animationDuration={4000}
              textColor='text-2xl font-bold mb-1 md:text-3xl md:mb-2'>
              GT-3000
            </Highlighter>
          </div>
          <p className='text-muted-foreground text-sm md:text-lg'>
            A linha de produção GT-3000 é a mais moderna e eficiente do mercado.
          </p>
        </div>

        <Image
          src={imageGt3000}
          className='h-48 w-full rounded-xs object-contain md:h-96 md:object-cover'
          alt='GT-3000'
        />
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
    <div className='hover:bg-muted bg-background relative z-10 h-full w-52 cursor-pointer overflow-hidden rounded-xs border border-dashed border-black/40 p-3 shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-2xl md:w-64 md:p-4'>
      <div className='flex flex-row items-center gap-2'>
        <IconCard className='h-5 w-5 text-slate-900 md:h-6 md:w-6' />
        <div className='flex flex-col'>
          <figcaption className='text-xs font-medium md:text-sm'>
            {title}
          </figcaption>
        </div>
      </div>
      <blockquote className='mt-2 text-xs leading-relaxed md:text-sm'>
        {description}
      </blockquote>
    </div>
  );
};
