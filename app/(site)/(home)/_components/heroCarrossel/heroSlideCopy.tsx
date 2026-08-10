'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';

import { WhatsAppIcon } from '@/components/layout/socialLinks';

import type { SlideMaquina } from './slideData';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const EASE_ENTRADA = [0.19, 1, 0.22, 1] as const;

const cascata = {
  entrar: { transition: { staggerChildren: 0.04 } }
};

const bloco = {
  inicial: { y: '112%' },
  entrar: { y: '0%', transition: { duration: 0.52, ease: EASE_ENTRADA } }
};

const WHATSAPP_URL = `https://wa.me/5541997851998?text=${encodeURIComponent(
  'Olá! Vim pelo site da Profills e quero falar com um especialista.'
)}`;

/* Máscara do Reveal: o bloco sobe de dentro de um recorte overflow-hidden */
function Mascara({ children }: { children: ReactNode }) {
  return (
    <span className='block overflow-hidden'>
      <motion.span variants={bloco} className='block'>
        {children}
      </motion.span>
    </span>
  );
}

interface HeroSlideCopyProps {
  slide: SlideMaquina;
  /** true só para o slide inicial: ele renderiza o h1 da página */
  primeiro: boolean;
  /** Reduced motion: render direto, sem variants */
  estatico?: boolean;
}

export function HeroSlideCopy({
  slide,
  primeiro,
  estatico = false
}: HeroSlideCopyProps) {
  const Titulo = primeiro ? 'h1' : 'h2';

  const conteudo = (
    <>
      <Mascara>
        <span className='inline-flex items-baseline gap-2.5'>
          <span className='text-2xl font-extrabold tracking-tight text-accent'>
            {slide.nome}
          </span>
          <span className='border-l border-dashed border-[rgba(148,178,235,0.3)] pl-2.5 font-mono text-xs tracking-widest text-[#b6c5e2] uppercase'>
            {slide.categoria}
          </span>
        </span>
      </Mascara>

      <Titulo className='mt-5 text-[clamp(2.1rem,3.9vw,3.5rem)] leading-[1.06] font-extrabold tracking-tight text-white'>
        <Mascara>
          <span className='block whitespace-nowrap'>{slide.titulo[0]}</span>
        </Mascara>
        <Mascara>
          <span className='block whitespace-nowrap text-accent'>
            {slide.titulo[1]}
          </span>
        </Mascara>
      </Titulo>

      <Mascara>
        <p className='mt-4 max-w-[44ch] text-base leading-relaxed text-[#b6c5e2]'>
          {slide.descricao}
        </p>
      </Mascara>

      <Mascara>
        <span className='mt-7 flex w-fit items-stretch rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/60 max-[560px]:w-full max-[560px]:flex-col'>
          <span className='flex gap-6 px-6 py-4 max-[560px]:flex-wrap max-[560px]:gap-4'>
            {slide.specs.map((spec) => (
              <span key={spec.label} className='whitespace-nowrap'>
                <span className='block font-mono text-[1.35rem] font-semibold text-white'>
                  {spec.prefixo ? (
                    <span className='mr-1 text-xs font-normal text-[#b6c5e2]'>
                      {spec.prefixo}
                    </span>
                  ) : null}
                  {spec.valor}
                  <small className='ml-1 text-xs font-normal text-[#b6c5e2]'>
                    {spec.unidade}
                  </small>
                </span>
                <span className='mt-1 block text-[0.68rem] tracking-wider text-[#b6c5e2] uppercase'>
                  {spec.label}
                </span>
              </span>
            ))}
          </span>
          <Link
            href={slide.rota}
            className='flex items-center gap-2 rounded-r-xs bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent/90 max-[560px]:justify-center max-[560px]:rounded-b-xs max-[560px]:rounded-tr-none max-[560px]:py-3'>
            Conhecer <ArrowRight className='size-4' />
          </Link>
        </span>
      </Mascara>

      <Mascara>
        <a
          href={WHATSAPP_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#b6c5e2] transition-colors hover:text-white'>
          <WhatsAppIcon className='size-4 text-[#25d366]' />
          Falar com um especialista
        </a>
      </Mascara>
    </>
  );

  if (estatico) {
    return <div>{conteudo}</div>;
  }

  return (
    <motion.div
      variants={cascata}
      initial='inicial'
      animate='entrar'
      exit={{ opacity: 0, transition: { duration: 0.12 } }}>
      {conteudo}
    </motion.div>
  );
}
