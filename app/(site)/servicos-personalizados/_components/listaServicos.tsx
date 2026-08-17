import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import brindesCorporativos from '@/lib/images/extras/servicos/brindes-inox.jpg';
import cutelariaInox from '@/lib/images/extras/servicos/cutelaria-inox.jpg';
import pecasSobMedida from '@/lib/images/extras/servicos/especiais-02.jpg';
import projetosArquitetonicos from '@/lib/images/extras/servicos/outros-inox.jpg';

const listaServicos = [
  {
    id: 'cutelaria-inox',
    image: cutelariaInox,
    title: 'Cutelaria em Inox',
    description:
      'Cortes e dobras de alta precisão para produção de facas artesanais. Garantimos matéria-prima de qualidade e acabamento impecável, proporcionando peças funcionais, duráveis e com estética refinada.'
  },
  {
    id: 'brindes-corporativos',
    image: brindesCorporativos,
    title: 'Brindes Corporativos',
    description:
      'Personalize chaveiros, marcadores, suportes e outros itens exclusivos em inox. Brindes resistentes, elegantes e feitos sob medida para valorizar sua marca e encantar clientes e parceiros.'
  },
  {
    id: 'projetos-arquitetonicos',
    image: pecasSobMedida,
    title: 'Projetos Arquitetônicos',
    description:
      'Soluções em inox para transformar ambientes com modernidade e sofisticação. Realizamos desde detalhes estruturais até móveis personalizados, unindo design, precisão técnica e durabilidade.'
  },
  {
    id: 'pecas-sob-medida',
    image: projetosArquitetonicos,
    title: 'Peças Sob Medida',
    description:
      'Desenvolvemos peças personalizadas em inox para usos industriais, comerciais e decorativos. Cortes, dobras e soldas realizados com excelência, oferecendo versatilidade e qualidade em cada projeto.'
  }
];

export default function ListaServicos() {
  return (
    <section id='o-que-fazemos' className='w-full scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer>
        <h2 className='text-xl font-bold text-white md:text-2xl'>
          O que podemos fazer?
        </h2>
        <p className='text-muted-foreground/70 mt-1 font-mono text-sm tracking-wider'>
          Peças e produtos exclusivos em inox
        </p>

        <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5'>
          {listaServicos.map((servico) => (
            <article
              id={servico.id}
              key={servico.id}
              className='group relative scroll-mt-28 border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 transition-colors hover:border-[rgba(148,178,235,0.6)]'>
              <span className='text-accent/60 absolute -top-2 -left-1 z-10 font-mono text-xs'>
                +
              </span>
              <div className='relative h-52 w-full overflow-hidden md:h-64'>
                <Image
                  src={servico.image}
                  alt={servico.title}
                  fill
                  sizes='(min-width: 768px) 50vw, 100vw'
                  className='object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                />
              </div>
              <div className='p-4 md:p-5'>
                <h3 className='text-lg font-bold text-white md:text-xl'>
                  {servico.title}
                </h3>
                <p className='text-muted-foreground mt-2 text-base leading-relaxed text-pretty'>
                  {servico.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </AnimatedContainer>
    </section>
  );
}
