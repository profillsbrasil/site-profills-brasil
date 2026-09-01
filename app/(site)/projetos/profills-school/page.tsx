import type { Metadata } from 'next';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { metadataDaPagina } from '@/lib/seo/metadata';

import BeneficiosSociedade from './_components/beneficiosSociedade';
import Hero from './_components/hero';
import ImpactoEducacao from './_components/impactoEducacao';
import MetodologiasEnsino from './_components/metodologiasEnsino';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Profills School',
  descricao:
    'Treinamento técnico em envase e operação de máquinas para funcionários, clientes e parceiros da Profills.',
  path: '/projetos/profills-school'
});

export default function ProfillsSchool() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16'>
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Education Impact Section */}
      <ImpactoEducacao />
      {/* Teaching Methodologies Section */}
      <MetodologiasEnsino />
      {/* Social Benefits Section */}
      <BeneficiosSociedade />
    </div>
  );
}
