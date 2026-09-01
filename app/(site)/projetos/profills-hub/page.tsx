import type { Metadata } from 'next';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { metadataDaPagina } from '@/lib/seo/metadata';

import CadeiaSuprimentos from './_components/cadeiaSuprimentos';
import ExpansaoGlobal from './_components/expansaoGlobal';
import Hero from './_components/hero';
import SolucoesIntegradas from './_components/solucoesIntegradas';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Profills Hub',
  descricao:
    'A rede de filiais da Profills pelo Brasil e a expansão para o mercado internacional, com estrutura perto de quem produz.',
  path: '/projetos/profills-hub'
});

export default function ProfillsHub() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16'>
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Global Expansion Section */}
      <ExpansaoGlobal />
      {/* Supply Chain Section */}
      <CadeiaSuprimentos />
      {/* Integrated Solutions Section */}
      <SolucoesIntegradas />
    </div>
  );
}
