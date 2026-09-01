import type { Metadata } from 'next';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { metadataDaPagina } from '@/lib/seo/metadata';

import BeneficiosGestao from './_components/beneficiosGestao';
import CloudMobilidade from './_components/cloudMobilidade';
import Hero from './_components/hero';
import SolucaoERP from './_components/solucaoERP';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Profills ERP',
  descricao:
    'Sistema de gestão acessível para pequenos produtores, com emissão de nota fiscal e relatórios sem depender de terceiros.',
  path: '/projetos/profills-erp'
});

export default function ProfillsERP() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16'>
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* ERP Solution Section */}
      <SolucaoERP />
      {/* Benefits & Management Section */}
      <BeneficiosGestao />
      {/* Cloud & Mobility Section */}
      <CloudMobilidade />
    </div>
  );
}
