import type { Metadata } from 'next';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { metadataDaPagina } from '@/lib/seo/metadata';

import Hero from './_components/hero';
import ProblemaDigital from './_components/problemaDigital';
import SolucaoMarketplace from './_components/solucaoMarketplace';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Profills Marketplace',
  descricao:
    'Marketplace de insumos que liga produtores, distribuidores e indústrias, com negociação e venda online.',
  path: '/projetos/profills-marketplace'
});

export default function ProfillsMarketplace() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center px-4 pt-16'>
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Problem Section */}
      <ProblemaDigital />
      {/* Solution Section */}
      <SolucaoMarketplace />
    </div>
  );
}
