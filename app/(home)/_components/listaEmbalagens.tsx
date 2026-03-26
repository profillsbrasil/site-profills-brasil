import { AnimatedContainer } from '@/components/AnimatedContainer';
import { Highlighter } from '@/components/magicui/highlighter';
import { OptimizedEmbalagem3d } from '@/components/modelo3d/optimizedEmbalagem3d';

const listaDeEmbalagens = [
  {
    title: '3 Soldas Duplo',
    description: 'Embalagem plana, estável e ideal para doses por porção.',
    modelSrc: '/embalagens-3d/3-soldas-duplo.glb',
    cameraOrbit: '38deg 72deg 100%'
  },
  {
    title: 'Bisnaga',
    description: 'Formato maleável, perfeito para cremes, pastas e géis.',
    modelSrc: '/embalagens-3d/bisnaga.glb',
    cameraOrbit: '28deg 78deg 100%'
  },
  {
    title: 'Fardo',
    description: 'Conjunto agrupado para transporte e exposição em varejo.',
    modelSrc: '/embalagens-3d/fardo.glb',
    cameraOrbit: '52deg 68deg 100%'
  },
  {
    title: 'Flowpack',
    description: 'Invólucro contínuo, ideal para snacks e produtos unitários.',
    modelSrc: '/embalagens-3d/flowpack.glb',
    cameraOrbit: '18deg 82deg 100%'
  },
  {
    title: 'Frascos Tubulares',
    description:
      'Formato alongado, excelente para shampoos, cosméticos e líquidos.',
    modelSrc: '/embalagens-3d/frascos-tubulares.glb',
    cameraOrbit: '43deg 77deg 100%'
  },
  {
    title: 'Galão',
    description: 'Volume ampliado para químicos, óleos e soluções líquidas.',
    modelSrc: '/embalagens-3d/galao.glb',
    cameraOrbit: '33deg 83deg 100%'
  },
  {
    title: 'Garrafa',
    description: 'Indicada para bebidas, lácteos e líquidos de consumo diário.',
    modelSrc: '/embalagens-3d/garrafas-02.glb',
    cameraOrbit: '57deg 70deg 100%'
  },
  {
    title: 'Pote',
    description: 'Estrutura rígida para alimentos, grãos, cremes e pastas.',
    modelSrc: '/embalagens-3d/pote02.glb',
    cameraOrbit: '270deg 40deg 100%'
  },
  {
    title: 'Pouch',
    description: 'Embalagem flexível tipo stand-up para alimentos e líquidos.',
    modelSrc: '/embalagens-3d/pouch.glb',
    cameraOrbit: '27deg 80deg 100%'
  },
  {
    title: 'Sache 4 Soldas',
    description:
      'Sache retangular para doses individuais de produtos secos ou líquidos.',
    modelSrc: '/embalagens-3d/sache-4-soldas.glb',
    cameraOrbit: '32deg 86deg 100%'
  },
  {
    title: 'Sache Especial',
    description:
      'Formato diferenciado para ações promocionais e linhas premium.',
    modelSrc: '/embalagens-3d/sache-especial.glb',
    cameraOrbit: '41deg 74deg 100%'
  },
  {
    title: 'UHT',
    description: 'Caixa cartonada para leite, sucos e bebidas esterilizadas.',
    modelSrc: '/embalagens-3d/uht.glb',
    cameraOrbit: '36deg 79deg 100%'
  },
  {
    title: 'Sache Saco',
    description:
      'Bolsa flexível maior, ideal para refis e embalagens econômicas.',
    modelSrc: '/embalagens-3d/sache-saco.glb',
    cameraOrbit: '29deg 84deg 100%'
  },
  {
    title: 'Stick',
    description: 'Formato estreito para porções individuais de pó ou líquidos.',
    modelSrc: '/embalagens-3d/stick.glb',
    cameraOrbit: '20deg 120deg 100%'
  },
  {
    title: 'Gable Top',
    description:
      'Embalagem do tipo gable top, ideal para leite, sucos e bebidas.',
    modelSrc: '/embalagens-3d/gable-top.glb',
    cameraOrbit: '45deg 75deg 100%'
  },
  {
    title: 'Lata de Tinta',
    description: 'Lata de tinta para embalagem de tinta.',
    modelSrc: '/embalagens-3d/lata-tinta.glb',
    cameraOrbit: '190deg 66deg 100%'
  }
];

export default function ListaEmbalagens() {
  return (
    <section className='relative z-10 px-4 py-10'>
      <div className='mx-auto max-w-6xl'>
        {/* Header Section */}
        <div className='items-left mb-6 flex flex-col text-left md:mb-5'>
          <Highlighter
            action='underline'
            color='#2d62ef'
            animationDuration={4000}
            textColor='text-2xl mb-3 flex gap-2 leading-tight font-bold md:text-3xl md:mb-2'>
            Nossas Embalagens
          </Highlighter>

          <p className='text-muted-foreground text-sm leading-relaxed md:text-base'>
            Soluções para todos os tipos de produtos
          </p>
        </div>

        {/* Benefits listaDeEmbalagens */}
        <AnimatedContainer delay={0.3}>
          <div className='mb-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5'>
            {listaDeEmbalagens.map((card, index) => (
              <div
                key={index}
                className='group bg-background hover:bg-muted flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xs border border-black/30 shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-2xl'>
                <div className='relative'>
                  <div className='bg-background rounded-xs p-3 group-hover:shadow-md group-hover:shadow-black/10 md:p-5'>
                    <OptimizedEmbalagem3d
                      modelSrc={card.modelSrc}
                      alt={`Modelo 3D - ${card.title}`}
                      cameraOrbit={card.cameraOrbit}
                      autoRotate={true}
                    />
                  </div>
                  <div className='flex flex-col gap-1 border-t border-black/30 px-3 py-2 md:gap-2 md:px-5'>
                    <h3 className='flex-1 text-sm font-semibold md:text-base'>
                      {card.title}
                    </h3>
                    <p className='pb-1 text-xs leading-relaxed md:pb-2 md:text-sm'>
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
