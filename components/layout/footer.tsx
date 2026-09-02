'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useContatoComercial } from '@/components/indicacao/useContatoComercial';
import { BlurFade } from '@/components/ui/blur-fade';
import { CONTATO_PADRAO } from '@/lib/data/contatos';
import { waLink } from '@/lib/utils/whatsapp';
import logoProfills from '@/public/logo-branco.png';
import logoCartoonsRanca from '@/public/profills-cartoons-ranca.png';

import { GridPattern } from './gridPatternBg';
import { WhatsAppIcon, socialLinks } from './socialLinks';
import { Mail, MapPin, Phone } from 'lucide-react';

const contatosFixos = [
  {
    title: 'Suporte e Assistência Técnica',
    icon: Mail,
    links: [
      {
        href: `mailto:${CONTATO_PADRAO.suporte.email}`,
        icon: Mail,
        label: 'suporte@profillsdobrasil.com.br'
      },
      {
        href: waLink(
          CONTATO_PADRAO.suporte.telefone,
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
        href: `mailto:${CONTATO_PADRAO.compras.email}`,
        icon: Mail,
        label: 'compras@profillsdobrasil.com.br'
      },
      {
        href: waLink(
          CONTATO_PADRAO.compras.telefone,
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
  const comercial = useContatoComercial();

  const cardVendas = {
    title: 'Vendas/Peças',
    icon: Phone,
    links: [
      {
        href: `mailto:${comercial.email}`,
        icon: Mail,
        label: comercial.email
      },
      {
        href: comercial.whatsapp(
          'Olá! Vim pelo site da Profills e quero falar com Vendas/Peças.'
        ),
        icon: WhatsAppIcon,
        label: 'Conversar no WhatsApp',
        ariaLabel: 'Conversar no WhatsApp com Vendas/Peças',
        external: true
      }
    ]
  };
  const contacts = [cardVendas, ...contatosFixos];

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
    <footer className='relative overflow-hidden border-t border-dashed border-[rgba(148,178,235,0.22)] bg-secondary'>
      <GridPattern />

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
              <p className='text-sm leading-relaxed font-medium text-[#b6c5e2] md:text-lg'>
                A Profills é uma empresa jovem e arrojada, que produz{' '}
                <span className='text-accent font-semibold'>
                  Máquinas Envasadoras
                </span>{' '}
                para produtos líquidos, pastosos e sólidos.
              </p>
              <p className='mt-2 text-xs text-[#b6c5e2]/70 md:text-base'>
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
              {/* Placa técnica (cores explícitas: o footer vive fora da .tema-navy) */}
              <div className='group relative h-full rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60 p-4 transition-colors duration-300 hover:border-solid hover:border-accent hover:bg-slate-900/85 md:p-6'>
                <span
                  aria-hidden
                  className='absolute top-0.5 right-1.5 font-mono text-xs text-[rgba(148,178,235,0.4)]'>
                  +
                </span>
                <div className='mb-3 flex items-center gap-3 md:mb-4'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xs bg-accent/10 md:h-10 md:w-10'>
                    <contact.icon className='h-4 w-4 text-accent md:h-5 md:w-5' />
                  </div>
                  <h3 className='text-sm font-semibold text-white md:text-base'>
                    {contact.title}
                  </h3>
                </div>
                <div className='flex flex-col space-y-2 md:space-y-3'>
                  {contact.links.map(
                    ({ href, icon: LinkIcon, label, ariaLabel, external }) => {
                      const aguardando =
                        contact.title === 'Vendas/Peças' && !comercial.pronto;
                      return (
                        <a
                          key={ariaLabel ?? label}
                          href={aguardando ? undefined : href}
                          aria-label={ariaLabel}
                          aria-disabled={aguardando || undefined}
                          {...(external &&
                            !aguardando && {
                              target: '_blank',
                              rel: 'noopener noreferrer'
                            })}
                          className='group/link flex items-center gap-2 text-[#b6c5e2] transition-colors hover:text-accent md:gap-3'>
                          <LinkIcon className='h-4 w-4 text-accent/60 transition-colors group-hover/link:text-accent md:h-4 md:w-4' />
                          <span className='min-h-4 text-xs font-medium md:text-sm'>
                            {aguardando && label.includes('@') ? '' : label}
                          </span>
                        </a>
                      );
                    }
                  )}
                </div>
              </div>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.4} inView>
          <div className='mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:mt-10 md:gap-6'>
            <div className='h-px border-t border-dashed border-[rgba(148,178,235,0.22)]' />
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
            <div className='h-px border-t border-dashed border-[rgba(148,178,235,0.22)]' />
          </div>
        </BlurFade>

        <BlurFade delay={0.5} inView>
          <div className='pt-8'>
            <div className='mb-6 text-center md:mb-8'>
              <h3 className='mb-2 text-base font-semibold text-white md:text-lg'>
                Conecte-se conosco
              </h3>
              <p className='text-xs text-[#b6c5e2]/70 md:text-base'>
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
                  className='rounded-xs border border-dashed border-[rgba(148,178,235,0.25)] p-2 text-[#b6c5e2]/70 transition-all duration-300 hover:border-solid hover:border-accent hover:text-accent md:p-4'>
                  <Icon className='size-8 md:size-10' />
                </Link>
              ))}
            </div>
            <div className='mt-6 flex flex-col items-center justify-center gap-1 text-xs text-[#b6c5e2]/70 md:text-sm'>
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
