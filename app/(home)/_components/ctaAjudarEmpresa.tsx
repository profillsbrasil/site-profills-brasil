import Image from 'next/image';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { Highlighter } from '@/components/magicui/highlighter';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import logoAutonics from '@/lib/images/fornecedores/Autonics.png';
import logoFesto from '@/lib/images/fornecedores/Festo.png';
import logoNetzsch from '@/lib/images/fornecedores/Netzsch.png';
import logoOmron from '@/lib/images/fornecedores/Omron.png';
import logoPanasonic from '@/lib/images/fornecedores/Panasonic.png';
import logoSewEurodrive from '@/lib/images/fornecedores/SEWeurodrive.png';
import logoSmc from '@/lib/images/fornecedores/SMC.png';
import logoWeg from '@/lib/images/fornecedores/weg.png';

import { Clock, Settings, Shield } from 'lucide-react';

const fornecedores = [
  {
    logo: logoAutonics,
    alt: 'Autonics'
  },

  {
    logo: logoFesto,
    alt: 'Festo'
  },

  {
    logo: logoNetzsch,
    alt: 'Netzsch'
  },
  {
    logo: logoOmron,
    alt: 'Omron'
  },
  {
    logo: logoPanasonic,
    alt: 'Panasonic'
  },
  {
    logo: logoSewEurodrive,
    alt: 'Sew Eurodrive'
  },
  {
    logo: logoSmc,
    alt: 'SMC'
  },
  {
    logo: logoWeg,
    alt: 'Weg'
  }
];

const cards = [
  {
    title: 'Conformidade garantida',
    description:
      'Adequação da operação a um processo de envase higiênico, nos padrões da Anvisa, impedindo o contato do produto com micro-organismos.',
    icon: <Shield className='h-5 w-5 text-accent-foreground' />
  },
  {
    title: 'Otimização de tempo',
    description:
      'Tempo para dedicar-se a outras áreas do seu negócio, a exemplo das vendas e abertura de novos mercados.',
    icon: <Clock className='h-5 w-5 text-accent-foreground' />
  },
  {
    title: 'Automatização completa',
    description:
      'Automatização do processo de envase, evitando desperdícios, otimizando a produção com aumento em volume de envase.',
    icon: <Settings className='h-5 w-5 text-accent-foreground' />
  }
];

export default function CtaAjudarEmpresa() {
  return (
    <section className='relative z-10 px-4 py-16 md:py-24'>
      <div className='mx-auto max-w-6xl'>
        {/* Header Section */}
        <div className='mb-10 flex flex-col items-center text-center md:mb-14'>
          <h2 className='mb-4 flex flex-col gap-1 text-2xl leading-tight font-bold md:flex-row md:gap-2 md:text-3xl'>
            <TextAnimate animation='blurInUp' by='word' as='span' once startOnView className='text-2xl font-bold md:text-3xl'>
              Como podemos
            </TextAnimate>
            <Highlighter
              action='underline'
              
              animationDuration={4000}
              textColor='text-2xl font-bold text-accent md:text-3xl'>
              ajudar sua empresa?
            </Highlighter>
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-sm md:text-base'>
            Descubra como nossas soluções podem revolucionar seus processos e
            impulsionar seus resultados de forma mensurável e sustentável
          </p>
        </div>

        {/* Benefits Cards */}
        <div className='mb-12 grid grid-cols-1 gap-5 md:mb-16 md:grid-cols-3'>
            {cards.map((card, index) => (
              <BlurFade key={index} delay={0.1 + index * 0.1} inView>
                <div className='group relative flex flex-col overflow-hidden rounded-xs bg-secondary text-secondary-foreground shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-2xl'>
                  <GridPattern />
                  <div className='relative p-6 transition-all duration-300'>
                    <div className='mb-4 flex items-start gap-4'>
                      <div className='rounded-xs bg-accent/10 p-3 transition-transform duration-300 group-hover:scale-105'>
                        {card.icon}
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-base font-semibold'>
                          {card.title}
                        </h3>
                      </div>
                    </div>
                    <p className='text-sm leading-relaxed text-secondary-foreground/70'>{card.description}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

        <div className='w-full max-w-6xl'>
          <div className='mb-8 text-center'>
            <h3 className='text-foreground text-xl font-semibold md:text-2xl'>
              As melhores marcas do mercado
            </h3>
            <p className='text-muted-foreground mt-2 text-sm md:text-base'>
              A qualidade começa na escolha dos melhores componentes
            </p>
          </div>
          <div className='grid grid-cols-4 gap-4 md:flex md:w-full md:items-center md:justify-center md:gap-6'>
            {fornecedores.map((fornecedor) => (
              <div
                key={fornecedor.alt}
                className='flex h-16 w-full items-center justify-center transition-all duration-300 hover:scale-110 md:h-20 md:w-1/6 md:scale-115'>
                <Image
                  src={fornecedor.logo}
                  alt={fornecedor.alt}
                  sizes='(max-width: 768px) 25vw, 12vw'
                  className='h-full w-full object-contain'
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
