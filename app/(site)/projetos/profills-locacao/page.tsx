import type { Metadata } from 'next';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { metadataDaPagina } from '@/lib/seo/metadata';

import BeneficiosModelo from './_components/beneficiosModelo';
import Hero from './_components/hero';
import ServicoAssinatura from './_components/servicoAssinatura';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Profills Locação',
  descricao:
    'Máquinas envasadoras por mensalidade, para quem está começando ou quer expandir a produção sem imobilizar capital no equipamento.',
  path: '/projetos/profills-locacao'
});

export default function ProfillsLocacao() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16'>
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Service Section */}
      <ServicoAssinatura />
      {/* Benefits Section */}
      <BeneficiosModelo />
    </div>
  );
}
