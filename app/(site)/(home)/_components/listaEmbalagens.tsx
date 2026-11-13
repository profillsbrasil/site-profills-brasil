'use client';

import dynamic from 'next/dynamic';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import { TextAnimate } from '@/components/ui/text-animate';
import { embalagens3d } from '@/lib/data/embalagens3d';

const OptimizedEmbalagem3d = dynamic(
  () =>
    import('@/components/modelo3d/optimizedEmbalagem3d').then((m) => ({
      default: m.OptimizedEmbalagem3d
    })),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: '150px' }} />
  }
);

const listaDeEmbalagens = [
  {
    title: '3 Soldas Duplo',
    description: 'Embalagem plana, estável e ideal para doses por porção.',
    embalagem: embalagens3d['3-soldas-duplo']
  },
  {
    title: 'Bisnaga',
    description: 'Formato maleável, perfeito para cremes, pastas e géis.',
    embalagem: embalagens3d.bisnaga
  },
  {
    title: 'Fardo',
    description: 'Conjunto agrupado para transporte e exposição em varejo.',
    embalagem: embalagens3d.fardo
  },
  {
    title: 'Flowpack',
    description: 'Invólucro contínuo, ideal para snacks e produtos unitários.',
    embalagem: embalagens3d.flowpack
  },
  {
    title: 'Frascos Tubulares',
    description:
      'Formato alongado, excelente para shampoos, cosméticos e líquidos.',
    embalagem: embalagens3d['frascos-tubulares']
  },
  {
    title: 'Galão',
    description: 'Volume ampliado para químicos, óleos e soluções líquidas.',
    embalagem: embalagens3d.galao
  },
  {
    title: 'Garrafa',
    description: 'Indicada para bebidas, lácteos e líquidos de consumo diário.',
    embalagem: embalagens3d.garrafa
  },
  {
    title: 'Pote',
    description: 'Estrutura rígida para alimentos, grãos, cremes e pastas.',
    embalagem: embalagens3d.pote
  },
  {
    title: 'Pouch',
    description: 'Embalagem flexível tipo stand-up para alimentos e líquidos.',
    embalagem: embalagens3d.pouch
  },
  {
    title: 'Sache 4 Soldas',
    description:
      'Sache retangular para doses individuais de produtos secos ou líquidos.',
    embalagem: embalagens3d['sache-4-soldas']
  },
  {
    title: 'Sache Especial',
    description:
      'Formato diferenciado para ações promocionais e linhas premium.',
    embalagem: embalagens3d['sache-especial']
  },
  {
    title: 'UHT',
    description: 'Caixa cartonada para leite, sucos e bebidas esterilizadas.',
    embalagem: embalagens3d.uht
  },
  {
    title: 'Sache Saco',
    description:
      'Bolsa flexível maior, ideal para refis e embalagens econômicas.',
    embalagem: embalagens3d['sache-saco']
  },
  {
    title: 'Stick',
    description: 'Formato estreito para porções individuais de pó ou líquidos.',
    embalagem: embalagens3d.stick
  },
  {
    title: 'Gable Top',
    description:
      'Embalagem do tipo gable top, ideal para leite, sucos e bebidas.',
    embalagem: embalagens3d['gable-top']
  },
  {
    title: 'Lata de Tinta',
    description: 'Embalagem metálica para armazenar e transportar tinta.',
    embalagem: embalagens3d['lata-tinta']
  }
];

export default function ListaEmbalagens() {
  return (
    <section className='relative z-10 px-4 py-10'>
      <div className='mx-auto max-w-6xl'>
        {/* Header Section */}
        <div className='items-left mb-6 flex flex-col text-left md:mb-5'>
          <TextAnimate
            animation='blurInUp'
            by='word'
            as='h2'
            once
            startOnView
            className='text-2xl mb-3 flex gap-2 leading-tight font-bold md:text-3xl md:mb-2'>
            Nossas Embalagens
          </TextAnimate>

          <p className='text-muted-foreground text-sm leading-relaxed md:text-base'>
            Embalagens para produtos líquidos, pastosos e sólidos
          </p>
        </div>

        {/* Benefits listaDeEmbalagens */}
        <AnimatedContainer delay={0.3}>
          <div className='mb-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5'>
            {listaDeEmbalagens.map((card, index) => (
              // Moldura blueprint: 3D no quadro tracejado com cantoneiras accent
              <div
                key={index}
                className='group flex h-full w-full cursor-pointer flex-col'>
                <div className='relative flex-1 rounded-t-xs border border-dashed border-[rgba(148,178,235,0.3)] p-3 transition-colors duration-300 group-hover:border-[rgba(148,178,235,0.55)] md:p-5'>
                  <span
                    aria-hidden
                    className='absolute -top-px -left-px z-10 h-2 w-2 border-t border-l border-accent'
                  />
                  <span
                    aria-hidden
                    className='absolute -right-px -bottom-px z-10 h-2 w-2 border-r border-b border-accent'
                  />
                  <OptimizedEmbalagem3d
                    embalagem={card.embalagem}
                    alt={`Modelo 3D - ${card.title}`}
                    autoRotate={true}
                  />
                </div>
                <div className='flex flex-col gap-1 rounded-b-xs border border-t-0 border-dashed border-[rgba(148,178,235,0.22)] bg-slate-900/60 px-3 py-2 transition-colors duration-300 group-hover:bg-slate-900/85 md:gap-2 md:px-5'>
                  <h3 className='flex-1 text-sm font-semibold text-white md:text-base'>
                    {card.title}
                  </h3>
                  <p className='text-muted-foreground line-clamp-2 min-h-[2lh] pb-1 text-xs leading-relaxed md:pb-2 md:text-sm'>
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
