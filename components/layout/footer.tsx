'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { BlurFade } from '@/components/ui/blur-fade';
import logoProfills from '@/public/logo-branco.png';
import logoCartoonsRanca from '@/public/profills-cartoons-ranca.png';

import { GridPattern } from './gridPatternBg';
import { WhatsAppIcon, socialLinks } from './socialLinks';
import { Mail, MapPin, Phone } from 'lucide-react';

// Números por setor (só nos links wa.me — nunca renderizados na tela).
// TODO: trocar Suporte e Compras quando o comercial confirmar os números.
const WHATSAPP_VENDAS = '5541997851998';
const WHATSAPP_SUPORTE = '5541997851998';
const WHATSAPP_COMPRAS = '5541997851998';

function waLink(numero: string, mensagem: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

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
        href: waLink(
          WHATSAPP_VENDAS,
          'Olá! Vim pelo site da Profills e quero falar com Vendas/Peças.'
        ),
        icon: WhatsAppIcon,
        label: 'Conversar no WhatsApp',
        ariaLabel: 'Conversar no WhatsApp com Vendas/Peças',
        external: true
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
      },
      {
        href: waLink(
          WHATSAPP_SUPORTE,
          'Olá! Vim pelo site da Profills e preciso de suporte técnico.'
        ),
        icon: WhatsAppIcon,
        label: 'Conversar no WhatsApp',
        ariaLabel: 'Conversar no WhatsApp com Suporte e Assistência Técnica',
        external: true
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
        href: waLink(
          WHATSAPP_COMPRAS,
          'Olá! Vim pelo site da Profills e quero falar com Compras.'
        ),
        icon: WhatsAppIcon,
        label: 'Conversar no WhatsApp',
        ariaLabel: 'Conversar no WhatsApp com Compras (Fornecedores)',
        external: true
      }
    ]
  }
];

export default function Footer() {
  const [copiedCnpj, setCopiedCnpj] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function handleCopyCnpj() {
    try {
      await navigator.clipboard.writeText('02.202.294/0001-60');
      setCopiedCnpj(true);

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = window.setTimeout(() => {
        setCopiedCnpj(false);
      }, 2000);
    } catch {
      setCopiedCnpj(false);
    }
  }

  return (
    <footer className='relative overflow-hidden bg-secondary'>
      <GridPattern className='[mask-image:linear-gradient(to_bottom,transparent_0,black_80px,black_100%)]' />

      <div className='relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:pt-14 md:pb-10'>
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
                  {contact.links.map(
                    ({ href, icon: LinkIcon, label, ariaLabel, external }) => (
                      <Link
                        key={href}
                        href={href}
                        aria-label={ariaLabel}
                        {...(external && {
                          target: '_blank',
                          rel: 'noopener noreferrer'
                        })}
                        className='group/link flex items-center gap-2 text-secondary-foreground/60 transition-colors hover:text-accent md:gap-3'>
                        <LinkIcon className='h-4 w-4 text-accent/60 transition-colors group-hover/link:text-accent md:h-4 md:w-4' />
                        <span className='text-xs font-medium md:text-sm'>
                          {label}
                        </span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.4} inView>
          <div className='mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:mt-10 md:gap-6'>
            <div className='h-px bg-gradient-to-r from-transparent via-secondary-foreground/15 to-transparent' />
            <Link
              href='#'
              aria-label='Conheça também: Profills Cartoons Branca'
              className='group flex flex-col items-center'>
              <Image
                src={logoCartoonsRanca}
                alt='Profills Cartoons Ranca'
                className='h-10 w-auto transition duration-300 group-hover:brightness-110 md:h-12'
              />
            </Link>
            <div className='h-px bg-gradient-to-r from-transparent via-secondary-foreground/15 to-transparent' />
          </div>
        </BlurFade>

        <BlurFade delay={0.5} inView>
          <div className='pt-8'>
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
            <div className='mt-6 flex flex-col items-center justify-center gap-1 text-xs text-secondary-foreground/50 md:text-sm'>
              <p className='text-center'>
                <span className='text-accent'>&copy;</span>{' '}
                {new Date().getFullYear()} Profills Brasil. Todos os direitos
                reservados.
              </p>
              <button
                type='button'
                aria-label='Copiar CNPJ'
                onClick={handleCopyCnpj}
                className='cursor-copy text-center transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none'>
                <span>CNPJ 02.202.294/0001-60</span>
              </button>
              <span
                aria-live='polite'
                className='min-h-4 text-[11px] text-accent/80'>
                {copiedCnpj ? 'CNPJ copiado' : ''}
              </span>
            </div>
          </div>
        </BlurFade>
      </div>
    </footer>
  );
}
