import { Highlighter } from '@/components/magicui/highlighter';
import { BlurFade } from '@/components/ui/blur-fade';

export default function Instituicao() {
  return (
    <section
      aria-labelledby='titulo-regulacao'
      className='flex h-full w-full max-w-6xl flex-col items-center justify-center gap-6 py-8 md:gap-10 md:py-16'>
      <Highlighter
        action='underline'
        animationDuration={4000}
        textColor='text-2xl font-bold text-center md:text-3xl'>
        <h2 id='titulo-regulacao'>
          Instituição Financeira Digital Regulamentada
        </h2>
      </Highlighter>

      <BlurFade delay={0.1} inView>
        <div className='flex w-full flex-col gap-6 md:flex-row md:gap-10'>
          <div className='flex w-full flex-col gap-4 text-sm leading-relaxed md:w-1/2 md:text-base'>
            <p>
              A Profills Bank foi desenvolvida como uma{' '}
              <span className='text-accent font-semibold'>
                instituição financeira digital
              </span>{' '}
              e segue as{' '}
              <span className='text-accent font-semibold'>
                diretrizes que regulam essas operações em nível global
              </span>
              .
            </p>

            <p>
              Desde o início, o objetivo foi construir um{' '}
              <span className='text-accent font-semibold'>
                modelo de negócios baseado nos termos de Instituições
                Financeiras Digitais
              </span>
              , estruturando as operações a partir do{' '}
              <span className='text-accent font-semibold'>
                atendimento inicial a pessoa jurídica (B2B)
              </span>{' '}
              e, na sequência, da{' '}
              <span className='text-accent font-semibold'>
                pessoa física ligada a essas operações comerciais (B2C)
              </span>
              .
            </p>
          </div>

          <div className='flex w-full flex-col gap-4 text-sm leading-relaxed md:w-1/2 md:text-base'>
            <p>
              A{' '}
              <span className='text-accent font-semibold'>
                geração de renda está ligada à geração de emprego
              </span>
              , e esses empregos vêm do{' '}
              <span className='text-accent font-semibold'>
                empreendedorismo: empresas que acreditam no mercado
              </span>
              , investem em tecnologia e conectam consumidor e fornecedor.
            </p>

            <p>
              A Profills Bank{' '}
              <span className='text-accent font-semibold'>
                fortalece essa relação entre empresa e cliente
              </span>
              , tornando produtos e serviços{' '}
              <span className='text-accent font-semibold'>
                mais acessíveis e com custo de operação menor
              </span>{' '}
              que os das instituições tradicionais.
            </p>
          </div>
        </div>
      </BlurFade>

      {/* Impact Numbers */}
      <BlurFade delay={0.2} inView>
        <div className='mt-6 grid w-full max-w-5xl grid-cols-1 gap-4 md:mt-8 md:grid-cols-3 md:gap-8'>
          <div className='flex flex-col items-center justify-center rounded-xs border border-gray-200 bg-white py-3 text-center shadow-md backdrop-blur-sm'>
            <div className='mb-2 text-3xl font-bold text-[#2d62ef]'>100%</div>
            <div className='text-gray-600'>Digital</div>
          </div>
          <div className='flex flex-col items-center justify-center rounded-xs border border-gray-200 bg-white py-3 text-center shadow-md backdrop-blur-sm'>
            <div className='mb-2 text-3xl font-bold text-[#2d62ef]'>
              B2B + B2C
            </div>
            <div className='text-gray-600'>Atendimento</div>
          </div>
          <div className='flex flex-col items-center justify-center rounded-xs border border-gray-200 bg-white py-3 text-center shadow-md backdrop-blur-sm'>
            <div className='mb-2 text-3xl font-bold text-[#2d62ef]'>DBaaS</div>
            <div className='text-gray-600'>Tecnologia Própria</div>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
