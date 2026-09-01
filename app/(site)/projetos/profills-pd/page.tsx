import type { Metadata } from 'next';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { metadataDaPagina } from '@/lib/seo/metadata';

import Hero from './_components/hero';
import PesquisaDesenvolvimento from './_components/pesquisaDesenvolvimento';
import TecnologiaFavor from './_components/tecnologiaFavor';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Profills P&D',
  descricao:
    'A equipe de pesquisa e desenvolvimento da Profills, que projeta as máquinas e testa produto e embalagem antes da linha entrar em produção.',
  path: '/projetos/profills-pd'
});

export default function ProfillsPD() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-16'>
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Research & Development Section */}
      <PesquisaDesenvolvimento />
      {/* Technology Section */}
      <TecnologiaFavor />
    </div>
  );
}
