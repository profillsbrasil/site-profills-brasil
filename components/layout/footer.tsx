import Image from 'next/image';
import Link from 'next/link';

import { BlurFade } from '@/components/ui/blur-fade';
import logoProfills from '@/public/logo-branco.png';

import { GridPattern } from './gridPatternBg';
import { socialLinks } from './socialLinks';
import { Mail, MapPin, Phone } from 'lucide-react';

const contacts = [
  {
    title: 'Vendas/Peças',
    icon: Phone,
    links: [
      {
        href: 'mailto:comercial@profillsdobrasil.com.br',
        icon: Mail,
        label: 'comercial@profillsdobrasil.com.br'
      },
      {
        href: 'tel:+5541997851998',
        icon: Phone,
        label: '+55 (41) 99785-1998'
      }
    ]
  },
  {
    title: 'Suporte e Assistência Técnica',
    icon: Mail,
    links: [
      {
        href: 'mailto:suporte@profillsdobrasil.com.br',
        icon: Mail,
        label: 'suporte@profillsdobrasil.com.br'
      }
    ]
  },
  {
    title: 'Compras (Fornecedores)',
    icon: MapPin,
    links: [
      {
        href: 'mailto:compras@profillsdobrasil.com.br',
        icon: Mail,
        label: 'compras@profillsdobrasil.com.br'
      },
      {
        href: 'tel:+554197695013',
        icon: Phone,
        label: '+55 (41) 9769-5013'
      }
    ]
  }
];

export default function Footer() {
  return (
    <footer className='relative overflow-hidden bg-secondary'>
      <GridPattern />

      <div className='relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-14'>
        <BlurFade delay={0.1} inView>
          <div className='mb-6 text-center md:mb-8'>
            <Link
              href='/'
              aria-label='Profills Brasil'
              className='group mb-6 inline-block md:mb-8'>
              <Image
                src={logoProfills}
                alt='Logo Profills'
                className='mx-auto h-12 w-auto transition-transform duration-300 md:h-16'
              />
            </Link>
            <div className='mx-auto max-w-3xl'>
              <p className='text-sm leading-relaxed font-medium text-secondary-foreground/80 md:text-lg'>
                A Profills é uma empresa jovem e arrojada, que produz{' '}
                <span className='text-accent font-semibold'>
                  Máquinas Envasadoras
                </span>{' '}
                para produtos líquidos, pastosos e sólidos.
              </p>
              <p className='mt-2 text-xs text-secondary-foreground/50 md:text-base'>
                Utilizando tecnologia de ponta e os melhores componentes.
              </p>
            </div>
          </div>
        </BlurFade>

        <div className='grid gap-4 md:grid-cols-3 md:gap-6'>
          {contacts.map((contact, index) => (
            <BlurFade
              key={contact.title}
              delay={0.2 + index * 0.1}
              inView
              className='h-full'>
              <div className='group h-full rounded-xs border border-secondary-foreground/10 bg-secondary-foreground/5 p-4 transition-colors duration-300 hover:border-accent/20 hover:bg-secondary-foreground/8 md:p-6'>
                <div className='mb-3 flex items-center gap-3 md:mb-4'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xs bg-accent/10 md:h-10 md:w-10'>
                    <contact.icon className='h-4 w-4 text-accent md:h-5 md:w-5' />
                  </div>
                  <h3 className='text-sm font-semibold text-secondary-foreground md:text-base'>
                    {contact.title}
                  </h3>
                </div>
                <div className='flex flex-col space-y-2 md:space-y-3'>
                  {contact.links.map(({ href, icon: LinkIcon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className='group/link flex items-center gap-2 text-secondary-foreground/60 transition-colors hover:text-accent md:gap-3'>
                      <LinkIcon className='h-4 w-4 text-accent/60 transition-colors group-hover/link:text-accent md:h-4 md:w-4' />
                      <span className='text-xs font-medium md:text-sm'>
                        {label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.5} inView>
          <div className='mt-8 pt-8 md:mt-8'>
            <div className='mb-6 text-center md:mb-8'>
              <h3 className='mb-2 text-base font-semibold text-secondary-foreground md:text-lg'>
                Conecte-se conosco
              </h3>
              <p className='text-xs text-secondary-foreground/50 md:text-base'>
                Acompanhe nossos projetos e novidades do setor industrial
              </p>
            </div>
            <div className='flex items-center justify-center gap-3 md:gap-4'>
              {socialLinks.map(({ href, Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='rounded-xs border border-secondary-foreground/10 p-2 text-secondary-foreground/40 transition-all duration-300 hover:border-accent/30 hover:text-accent md:p-4'>
                  <Icon className='size-8 md:size-10' />
                </Link>
              ))}
            </div>
            <p className='mt-4 flex items-center justify-center gap-1 flex-col text-xs text-secondary-foreground/50 md:text-sm'>
              <span>
                &copy; {new Date().getFullYear()} Profills Brasil. Todos os
                direitos reservados.
              </span>
              <span>CNPJ 02.202.294/0001-60</span>
            </p>
          </div>
        </BlurFade>
      </div>
    </footer>
  );
}
