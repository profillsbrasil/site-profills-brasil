import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Ban,
  Calendar,
  Check,
  Clock,
  ListChecks,
  MessageCircle,
  QrCode,
  Smartphone,
  Trophy
} from 'lucide-react';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { InstagramIcon } from '@/components/layout/socialLinks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { BlurFade } from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { TextAnimate } from '@/components/ui/text-animate';
import logoProfills from '@/public/logo-branco.png';

// Bot WhatsApp em produção no monorepo sistema-coleta-de-lead.
const WHATSAPP_NUMERO = '5541998954229';
const WHATSAPP_MENSAGEM = 'sorteio';
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
  WHATSAPP_MENSAGEM
)}`;

const DATA_SORTEIO = '05/06/2026';

export const metadata: Metadata = {
  title: 'Sorteio FISPAL 2026 | Profills Brasil',
  description:
    'Concorra a uma TV 65", uma Churrasqueira Champions Grill e um Cooler Profills. Sorteio em 05/06/2026 no estande Profills na FISPAL 2026.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Sorteio Profills FISPAL 2026',
    description:
      'Concorra a uma TV 65", uma Churrasqueira Champions Grill e um Cooler Profills.',
    images: ['/sorteio-fispal-2026/banner.png']
  }
};

const passos = [
  {
    icone: QrCode,
    titulo: 'Escaneie o QR no estande',
    detalhe:
      'No estande Profills da FISPAL 2026. Ou envie "sorteio" no WhatsApp.'
  },
  {
    icone: Check,
    titulo: 'Aceite o termo',
    detalhe: 'LGPD: opt-in por botão. Você decide o que compartilhar.'
  },
  {
    icone: InstagramIcon,
    titulo: 'Cumpra 4 tarefas no Instagram',
    detalhe:
      'Siga 3 perfis Profills + curta e marque 2 amigos no post oficial.'
  },
  {
    icone: Trophy,
    titulo: 'Receba seu código',
    detalhe: 'Você entra no sorteio. Resultado em 05/06/2026.'
  }
];

const faq = [
  {
    pergunta: 'Preciso estar presente na Fispal 2026 pra participar?',
    resposta:
      'Sim. A inscrição só é válida pra quem escaneou o QR Code no estande Profills durante o evento.'
  },
  {
    pergunta: 'Quando recebo meu código de inscrição?',
    resposta:
      'Logo após cumprir os 4 passos (cadastro completo + as 4 tarefas no Instagram), o código chega automaticamente pelo WhatsApp.'
  },
  {
    pergunta: 'Posso me inscrever mais de uma vez?',
    resposta:
      'Não. Cada número de WhatsApp pode se inscrever apenas uma vez. O bot garante o limite técnico.'
  },
  {
    pergunta: 'Como saberei se fui sorteado?',
    resposta:
      'O ganhador é contactado pelo mesmo WhatsApp usado na inscrição. Você tem 48h pra responder, senão um suplente é chamado.'
  },
  {
    pergunta: 'Já me inscrevi. E agora?',
    resposta:
      'Aguarde o sorteio em 05/06/2026. Você pode acompanhar nossas redes sociais pra novidades.'
  }
];

const regras = [
  {
    icone: Ban,
    titulo: 'Funcionários Profills não participam',
    detalhe:
      'Vedação para CLT, PJ direto, estagiários, jovem aprendiz e terceirizados.'
  },
  {
    icone: ListChecks,
    titulo: 'Os 4 passos são obrigatórios',
    detalhe:
      'Cadastro completo + as 4 tarefas no Instagram. Sem isso, a inscrição não vale.'
  },
  {
    icone: Clock,
    titulo: '48h pra responder se for sorteado',
    detalhe:
      'O ganhador é contactado pelo mesmo WhatsApp da inscrição. Não respondendo em 48h, um suplente é chamado.'
  },
  {
    icone: Smartphone,
    titulo: '1 inscrição por WhatsApp',
    detalhe: 'Cada número só pode se inscrever uma vez. O bot garante o limite.'
  }
];

export default function SorteioFispal2026() {
  return (
    <div className='relative min-h-screen w-full text-secondary-foreground'>
      {/* Hero — banner full-bleed */}
      <section className='relative isolate flex min-h-[92vh] w-full flex-col overflow-hidden'>
        <Image
          src='/sorteio-fispal-2026/banner.png'
          alt='Sorteio Profills FISPAL 2026: TV 65 polegadas, Churrasqueira Champions Grill e Cooler Profills'
          fill
          priority
          sizes='100vw'
          className='-z-20 object-cover object-center'
        />
        <div
          aria-hidden
          className='absolute inset-0 -z-10 bg-gradient-to-b from-secondary/30 via-secondary/45 to-secondary'
        />

        {/* Logo no topo */}
        <div className='relative z-10 mx-auto w-full max-w-6xl px-4 pt-6 md:px-6 md:pt-10'>
          <Link
            href='/'
            aria-label='Profills Brasil'
            className='inline-block transition-opacity hover:opacity-80'>
            <Image
              src={logoProfills}
              alt='Profills'
              priority
              className='h-9 w-auto md:h-11'
            />
          </Link>
        </div>

        {/* Conteúdo do hero ancorado embaixo */}
        <div className='relative z-10 mx-auto mt-auto w-full max-w-6xl px-4 pb-16 md:px-6 md:pb-24'>
          <BlurFade delay={0.1} inView>
            <div className='inline-flex items-center gap-2 rounded-xs border border-accent/40 bg-secondary/85 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg backdrop-blur-sm'>
              <Calendar className='text-accent size-3.5' aria-hidden />
              Sorteio em {DATA_SORTEIO}
            </div>
          </BlurFade>

          <h1 className='mt-5 flex max-w-3xl flex-col gap-1 text-balance text-4xl font-bold leading-[1.05] text-white md:text-6xl lg:text-7xl'>
            <TextAnimate
              animation='blurInUp'
              by='word'
              as='span'
              once
              startOnView
              className='text-4xl font-bold leading-[1.05] md:text-6xl lg:text-7xl'>
              Sorteio Profills
            </TextAnimate>
            <span className='text-accent text-4xl font-bold leading-[1.05] md:text-6xl lg:text-7xl'>
              FISPAL 2026
            </span>
          </h1>

          <BlurFade delay={0.4} inView>
            <p className='mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg'>
              Concorra a uma <strong className='font-semibold text-white'>TV 65"</strong>,
              uma <strong className='font-semibold text-white'>Churrasqueira Champions Grill</strong>
              {' '}e um <strong className='font-semibold text-white'>Cooler Profills</strong>.
              Inscreva-se pelo WhatsApp e cumpra as 4 tarefas no Instagram.
            </p>
          </BlurFade>

          <BlurFade delay={0.5} inView>
            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <Button
                asChild
                size='lg'
                className='group !bg-background !text-foreground hover:!bg-accent hover:!text-accent-foreground hover:!border-accent rounded-xs border border-border font-semibold shadow-md transition-all duration-300 hover:scale-[1.02]'>
                <a
                  href={whatsappUrl}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <MessageCircle className='size-5 text-current' aria-hidden />
                  Inscreva-se pelo WhatsApp
                </a>
              </Button>
              <p className='text-sm text-white/70'>
                Ou escaneie o QR no estande Profills.
              </p>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Wrapper único pra evitar seams entre seções (cada GridPattern resetava o padrão) */}
      <div className='relative overflow-hidden bg-secondary'>
        <GridPattern className='[mask-image:linear-gradient(to_bottom,transparent_0,black_80px,black_100%)]' />

      {/* Como participar */}
      <section className='relative px-4 py-16 md:py-24'>
        <div className='relative mx-auto max-w-6xl'>
          <BlurFade delay={0.1} inView>
            <div className='mb-12 flex flex-col items-center text-center'>
              <h2 className='mb-3 text-2xl font-bold tracking-wider text-secondary-foreground uppercase md:text-3xl'>
                Como participar
              </h2>
              <p className='text-sm text-secondary-foreground/70 md:text-base'>
                Quatro passos rápidos e seu código de inscrição chega no WhatsApp.
              </p>
            </div>
          </BlurFade>

          <ol className='grid gap-4 md:grid-cols-2 md:gap-5'>
            {passos.map((passo, i) => {
              const Icone = passo.icone;
              return (
                <BlurFade key={passo.titulo} delay={0.15 + i * 0.08} inView className='h-full'>
                  <li className='group relative flex h-full gap-5 rounded-xs border border-secondary-foreground/10 bg-secondary-foreground/5 p-5 transition-colors duration-300 hover:border-accent/30 md:p-6'>
                    <div className='flex shrink-0 flex-col items-center gap-3'>
                      <span className='font-mono text-xs font-medium text-secondary-foreground/40'>
                        0{i + 1}
                      </span>
                      <div className='flex size-11 items-center justify-center rounded-xs bg-accent/10 text-accent ring-1 ring-accent/30'>
                        <Icone className='size-5' aria-hidden />
                      </div>
                    </div>
                    <div className='pt-0.5'>
                      <h3 className='text-base font-semibold text-secondary-foreground md:text-lg'>
                        {passo.titulo}
                      </h3>
                      <p className='mt-1.5 text-sm leading-relaxed text-secondary-foreground/70'>
                        {passo.detalhe}
                      </p>
                    </div>
                  </li>
                </BlurFade>
              );
            })}
          </ol>

          <BlurFade delay={0.55} inView>
            <div className='mt-10 flex flex-wrap items-center justify-between gap-6 rounded-xs border border-accent/20 bg-accent/5 p-6 md:p-8'>
              <div>
                <p className='font-mono text-xs uppercase tracking-widest text-secondary-foreground/50'>
                  Pronto pra começar?
                </p>
                <p className='mt-1 text-lg font-semibold text-secondary-foreground md:text-xl'>
                  Inscreva-se em menos de 1 minuto pelo WhatsApp.
                </p>
              </div>
              <Button
                asChild
                size='lg'
                className='group !bg-background !text-foreground hover:!bg-accent hover:!text-accent-foreground hover:!border-accent rounded-xs border border-border font-semibold shadow-md transition-all duration-300 hover:scale-[1.02]'>
                <a
                  href={whatsappUrl}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <MessageCircle className='size-5 text-current' aria-hidden />
                  Participar
                </a>
              </Button>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Regras essenciais */}
      <section className='relative px-4 py-16 md:py-24'>
        <div className='relative mx-auto max-w-6xl'>
          <BlurFade delay={0.1} inView>
            <div className='mb-10 flex flex-col items-center text-center md:mb-12'>
              <h2 className='mb-3 text-2xl font-bold tracking-wider text-secondary-foreground uppercase md:text-3xl'>
                Regras essenciais
              </h2>
              <p className='text-sm text-secondary-foreground/70 md:text-base'>
                Antes de participar, dá uma olhada nas regras principais.
              </p>
            </div>
          </BlurFade>

          <ul className='grid gap-4 md:grid-cols-2 md:gap-5'>
            {regras.map((regra, i) => {
              const Icone = regra.icone;
              return (
                <BlurFade key={regra.titulo} delay={0.15 + i * 0.08} inView className='h-full'>
                  <li className='group flex h-full gap-4 rounded-xs border border-secondary-foreground/10 bg-secondary-foreground/5 p-5 transition-colors duration-300 hover:border-accent/30 md:p-6'>
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-xs bg-accent/10 text-accent ring-1 ring-accent/30'>
                      <Icone className='size-5' aria-hidden />
                    </div>
                    <div>
                      <h3 className='font-semibold text-secondary-foreground'>
                        {regra.titulo}
                      </h3>
                      <p className='mt-1 text-sm leading-relaxed text-secondary-foreground/70'>
                        {regra.detalhe}
                      </p>
                    </div>
                  </li>
                </BlurFade>
              );
            })}
          </ul>

        </div>
      </section>

      {/* FAQ */}
      <section className='relative px-4 py-16 md:py-24'>
        <div className='relative mx-auto max-w-4xl'>
          <BlurFade delay={0.1} inView>
            <div className='mb-10 flex flex-col items-center text-center md:mb-12'>
              <h2 className='mb-3 text-2xl font-bold tracking-wider text-secondary-foreground uppercase md:text-3xl'>
                Perguntas frequentes
              </h2>
              <p className='text-sm text-secondary-foreground/70 md:text-base'>
                Tirou a dúvida aqui? Boa. Senão, manda mensagem no WhatsApp.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <Accordion
              type='single'
              collapsible
              className='rounded-xs border border-secondary-foreground/10 bg-secondary-foreground/5 px-4 md:px-6'>
              {faq.map((item, i) => (
                <AccordionItem
                  key={item.pergunta}
                  value={`item-${i}`}
                  className='border-secondary-foreground/10 last:border-0'>
                  <AccordionTrigger className='text-base font-semibold text-secondary-foreground hover:no-underline md:text-lg'>
                    {item.pergunta}
                  </AccordionTrigger>
                  <AccordionContent className='text-sm leading-relaxed text-secondary-foreground/70 md:text-base'>
                    {item.resposta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </BlurFade>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className='relative border-t border-secondary-foreground/10'>
        <div className='relative mx-auto flex max-w-6xl items-center justify-center gap-4 px-4 py-6 text-xs text-secondary-foreground/60 md:justify-start md:px-6 md:py-8 md:text-sm'>
          <Image
            src={logoProfills}
            alt='Profills'
            className='h-7 w-auto md:h-8'
          />
          <p className='hidden md:block'>
            <span className='text-accent'>&copy;</span>{' '}
            {new Date().getFullYear()} Profills Brasil. Sorteio FISPAL 2026.
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}
