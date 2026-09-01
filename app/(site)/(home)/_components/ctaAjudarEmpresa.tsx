import Image from 'next/image';

import { Highlighter } from '@/components/magicui/highlighter';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import logoAutonics from '@/lib/images/fornecedores/Autonics.png';
import logoFesto from '@/lib/images/fornecedores/Festo.png';
import logoHiwin from '@/lib/images/fornecedores/Hiwin.png';
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
    logo: logoHiwin,
    alt: 'Hiwin'
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
      'Processo de envase higiênico, dentro dos padrões da Anvisa, sem contato do produto com micro-organismos.',
    icon: <Shield className='h-5 w-5 text-accent' />
  },
  {
    title: 'Otimização de tempo',
    description:
      'Mais tempo para focar em outras áreas do negócio, como vendas e abertura de novos mercados.',
    icon: <Clock className='h-5 w-5 text-accent' />
  },
  {
    title: 'Automatização completa',
    description:
      'Automatiza o envase, reduz desperdício e aumenta o volume produzido.',
    icon: <Settings className='h-5 w-5 text-accent' />
  }
];

export default function CtaAjudarEmpresa() {
  return (
    <section className='relative z-10 px-4 py-16 md:py-24'>
      <div className='mx-auto max-w-6xl'>
        {/* Header Section */}
        <div className='mb-10 flex flex-col items-center text-center md:mb-14'>
          <h2 className='mb-4 flex flex-col gap-1 text-2xl leading-tight font-bold md:flex-row md:gap-2 md:text-3xl'>
            <TextAnimate
              animation='blurInUp'
              by='word'
              as='span'
              once
              startOnView
              className='text-2xl font-bold md:text-3xl'>
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
            Veja como automatizar o envase reduz custos, garante conformidade e
            libera tempo para o resto do seu negócio
          </p>
        </div>

        {/* Benefits Cards */}
        <div className='mb-12 grid grid-cols-1 gap-5 md:mb-16 md:grid-cols-3'>
          {cards.map((card, index) => (
            <BlurFade
              key={index}
              delay={0.1 + index * 0.1}
              inView
              className='h-full'>
              {/* Placa técnica: linguagem do hero (borda tracejada → sólida accent no hover) */}
              <div className='relative flex h-full flex-col rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60 p-6 transition-colors duration-300 hover:border-solid hover:border-accent hover:bg-slate-900/85'>
                <span
                  aria-hidden
                  className='absolute top-0.5 right-1.5 font-mono text-xs text-[rgba(148,178,235,0.4)]'>
                  +
                </span>
                <div className='mb-4 flex items-center gap-4'>
                  <div className='rounded-xs bg-accent/10 p-3'>{card.icon}</div>
                  <h3 className='text-base font-semibold text-white'>
                    {card.title}
                  </h3>
                </div>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {card.description}
                </p>
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
          <div className='grid grid-cols-3 gap-4 md:flex md:w-full md:items-center md:justify-center md:gap-6'>
            {fornecedores.map((fornecedor, i) => (
              <div
                key={fornecedor.alt}
                className='group relative flex h-16 w-full items-center justify-center rounded-xs border border-dashed border-[rgba(148,178,235,0.25)] bg-card p-3 transition-colors duration-300 hover:border-accent/60 md:h-20 md:w-1/6'>
                {/* "Hover automático": a vez deste chip no ciclo de 8s */}
                <span
                  aria-hidden
                  style={{ animationDelay: `${i * 2}s` }}
                  className='pointer-events-none absolute -inset-px rounded-xs border border-accent opacity-0 motion-reduce:hidden animate-[marca-borda-ativa_18s_linear_infinite]'
                />
                {/* brightness-0 + invert: logos monocromáticas brancas sobre o navy */}
                <Image
                  src={fornecedor.logo}
                  alt={fornecedor.alt}
                  sizes='(max-width: 768px) 25vw, 12vw'
                  style={{ animationDelay: `${i * 2}s` }}
                  className='h-full w-full object-contain opacity-65 brightness-0 invert transition-opacity duration-300 group-hover:opacity-100 motion-reduce:animate-none animate-[marca-logo-ativa_18s_linear_infinite]'
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
