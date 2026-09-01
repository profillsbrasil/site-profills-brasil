import type { Metadata } from 'next';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { metadataDaPagina } from '@/lib/seo/metadata';

import Hero from './_components/hero';
import Instituicao from './_components/instituicao';
import TecnologiaDbaas from './_components/tecnologiaDbaas';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Profills Bank',
  descricao:
    'Serviços financeiros digitais com gestão de contas de pagamento, intermediados por parceiros homologados no Banco Central.',
  path: '/projetos/profills-bank'
});

export default function ProfillsBank() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16'>
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Technology Section */}
      <TecnologiaDbaas />
      {/* Regulation & Impact Section */}
      <Instituicao />
    </div>
  );
}
