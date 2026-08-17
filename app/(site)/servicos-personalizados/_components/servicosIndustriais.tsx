import Image from 'next/image';

import { AnimatedContainer } from '@/components/AnimatedContainer';
import corteLaser from '@/lib/images/extras/servicos/outros/corte-laser.jpg';
import dobraCnc from '@/lib/images/extras/servicos/outros/dobra-cnc.jpg';
import soldagem from '@/lib/images/extras/servicos/outros/solda.jpg';
import tornoCnc from '@/lib/images/extras/servicos/outros/torno-cnc.jpg';
import tratamento from '@/lib/images/extras/servicos/outros/tratamento.jpg';
import usinagemCnc from '@/lib/images/extras/servicos/outros/usinagem.jpg';

/* Os ids são alvos de âncora da navbar (Outros Serviços) — mudar um id
   exige atualizar navbarDesktop e navbarMobile. */
const servicos = [
  {
    id: 'corte-laser',
    titulo: 'Corte a Laser',
    descricao:
      'Corte de chapas metálicas com precisão de traço e repetibilidade, para peças únicas ou produção em série.',
    imagem: corteLaser
  },
  {
    id: 'dobra-cnc',
    titulo: 'Dobra CNC',
    descricao:
      'Dobras programadas em CNC para geometria consistente em cada lote, do protótipo à produção.',
    imagem: dobraCnc
  },
  {
    id: 'usinagem-cnc',
    titulo: 'Usinagem CNC',
    descricao:
      'Usinagem de componentes sob desenho técnico, com tolerâncias e acabamento industriais.',
    imagem: usinagemCnc
  },
  {
    id: 'torno-cnc',
    titulo: 'Torno CNC',
    descricao:
      'Torneamento de peças cilíndricas sob medida, em inox e outros metais.',
    imagem: tornoCnc
  },
  {
    id: 'soldagem',
    titulo: 'Soldagem',
    descricao:
      'Soldagem de estruturas e conjuntos metálicos com acabamento uniforme.',
    imagem: soldagem
  },
  {
    id: 'tratamento-termico',
    titulo: 'Tratamento Térmico',
    descricao:
      'Tratamento térmico de peças e ferramentas para maior dureza e durabilidade.',
    imagem: tratamento
  }
];

export function ServicosIndustriais() {
  return (
    <section id='servicos-industriais' className='scroll-mt-28 py-10 md:py-14'>
      <AnimatedContainer>
        <h2 className='text-xl font-bold text-white md:text-2xl'>
          Serviços industriais
        </h2>
        <p className='text-muted-foreground/70 mt-1 font-mono text-sm tracking-wider'>
          Fabricação sob medida em metal
        </p>

        <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {servicos.map((servico) => (
            <article
              key={servico.id}
              id={servico.id}
              className='group relative scroll-mt-28 border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 transition-colors hover:border-[rgba(148,178,235,0.6)]'>
              <span className='text-accent/60 absolute -top-2 -left-1 z-10 font-mono text-xs'>
                +
              </span>
              <div className='relative h-44 w-full overflow-hidden md:h-52'>
                <Image
                  src={servico.imagem}
                  alt={servico.titulo}
                  fill
                  sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
                  className='object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                />
              </div>
              <div className='p-4 md:p-5'>
                <h3 className='flex items-center gap-2 font-mono text-sm font-semibold tracking-widest text-white uppercase'>
                  <span className='bg-accent inline-block h-1.5 w-1.5' />
                  {servico.titulo}
                </h3>
                <p className='text-muted-foreground mt-2 text-base text-pretty'>
                  {servico.descricao}
                </p>
              </div>
            </article>
          ))}
        </div>
      </AnimatedContainer>
    </section>
  );
}
