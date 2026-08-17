import type { Metadata } from 'next';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import { GridPattern } from '@/components/layout/gridPatternBg';

import ContactForm from './_components/contact-form/ContactForm';
import ListaServicos from './_components/listaServicos';
import { ServicosIndustriais } from './_components/servicosIndustriais';

export const metadata: Metadata = {
  title: 'Serviços Personalizados | Profills',
  description:
    'Corte a laser, dobra e usinagem CNC, torno, soldagem e tratamento térmico — fabricação sob medida em metal, além de cutelaria, brindes e peças exclusivas em inox.'
};

export default function ServicosPersonalizados() {
  return (
    <div className='tema-navy bg-background text-foreground relative min-h-screen w-full pt-16'>
      <GridPattern />
      <div className='relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8'>
        {/* Hero */}
        <AnimatedContainer trigger='mount' className='pt-8 md:pt-12'>
          <section className='flex flex-col gap-6 md:flex-row md:items-center'>
            <div className='md:w-2/5'>
              <span className='text-accent font-mono text-xs tracking-[0.2em] uppercase'>
                Fabricação sob medida
              </span>
              <h1 className='mt-2 text-2xl leading-tight font-bold text-pretty text-white md:text-4xl'>
                Serviços personalizados
              </h1>
              <p className='text-muted-foreground mt-3 max-w-md text-base text-pretty md:text-lg'>
                A mesma engenharia que fabrica nossas máquinas, a serviço do seu
                projeto: corte, dobra, usinagem e soldagem em metal.
              </p>
            </div>
            <div className='relative border border-dashed border-[rgba(148,178,235,0.35)] p-2 md:w-3/5'>
              <video
                src='/videos/servico-personalizado.mp4'
                autoPlay
                loop
                muted
                playsInline
                className='h-48 w-full object-cover md:h-80'
              />
            </div>
          </section>
        </AnimatedContainer>

        <ServicosIndustriais />
        <ListaServicos />

        <section id='contato' className='scroll-mt-28 py-10 md:py-14'>
          <AnimatedContainer>
            <ContactForm />
          </AnimatedContainer>
        </section>
      </div>
    </div>
  );
}
