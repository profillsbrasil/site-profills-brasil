import { Highlighter } from '@/components/magicui/highlighter';
import { BlurFade } from '@/components/ui/blur-fade';

export default function TecnologiaDbaas() {
  return (
    <section
      aria-labelledby='titulo-tecnologia'
      className='flex h-full w-full max-w-6xl flex-col items-center justify-center gap-6 py-8 md:flex-row md:gap-10 md:py-16'>
      <BlurFade delay={0.1} inView>
        <div className='flex w-full flex-col items-start gap-4 md:w-1/2 md:gap-6'>
          <Highlighter
            action='underline'
            animationDuration={4000}
            textColor='text-2xl font-bold md:text-3xl'>
            <h2 id='titulo-tecnologia'>Tecnologia DBaaS</h2>
          </Highlighter>

          <div className='flex flex-col gap-4 text-sm leading-relaxed md:text-lg'>
            <p>
              A Profills Bank possui{' '}
              <span className='text-accent font-semibold'>
                tecnologia própria de sistemas DBaaS
              </span>{' '}
              (Digital Banking as a Service) e fornece{' '}
              <span className='text-accent font-semibold'>
                serviços e soluções para bancos digitais
              </span>{' '}
              e plataformas financeiras.
            </p>

            <p>
              Além de abrir um{' '}
              <span className='text-accent font-semibold'>
                novo espaço no mercado financeiro
              </span>
              , buscamos{' '}
              <span className='text-accent font-semibold'>
                boa experiência, segurança, agilidade e conectividade
              </span>{' '}
              no mundo das finanças.
            </p>
          </div>

          <ul className='list-disc pl-5 text-sm marker:text-[#2d62ef] md:text-lg'>
            <li>Digital Banking as a Service (DBaaS)</li>
            <li>Tecnologia própria e inovadora</li>
            <li>Atuação em diversos segmentos</li>
            <li>Foco em experiência e conectividade</li>
          </ul>
        </div>
      </BlurFade>

      <BlurFade delay={0.2} inView>
        <div className='z-10 flex w-full flex-col gap-4 md:w-1/2 md:gap-6'>
          <div className='rounded-xs border border-[#2d62ef]/20 bg-gradient-to-br from-[#2d62ef]/10 to-blue-100 p-6 shadow-lg md:p-8'>
            <h3 className='mb-4 text-xl font-bold text-[#2d62ef] md:text-2xl'>
              Nossa Missão
            </h3>
            <p className='text-sm leading-relaxed md:text-lg'>
              Apresentar um{' '}
              <span className='text-accent font-semibold'>
                serviço financeiro acessível
              </span>
              , para que os clientes não se preocupem com{' '}
              <span className='text-accent font-semibold'>
                tarifas e taxas da rede bancária tradicional
              </span>
              .
            </p>
          </div>

          <div className='rounded-xs border border-gray-200 bg-white p-4 shadow-lg backdrop-blur-md md:p-6'>
            <h4 className='mb-3 text-base font-semibold text-gray-800 backdrop-blur-md md:text-lg'>
              Serviços Oferecidos
            </h4>
            <ul className='space-y-2 text-sm text-gray-700 md:text-base'>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-[#2d62ef]'></div>
                Gestão de contas de pagamentos
              </li>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-[#2d62ef]'></div>
                Emissões de cartões
              </li>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-[#2d62ef]'></div>
                Intermediação de pagamentos
              </li>
              <li className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-[#2d62ef]'></div>
                Soluções para pequenas empresas
              </li>
            </ul>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
