'use client';

import { useEffect } from 'react';

import { GridPattern } from '@/components/layout/gridPatternBg';

import CarrosselProdutos from './_components/carrosselProdutos';
import CtaAjudarEmpresa from './_components/ctaAjudarEmpresa';
import CtaMonteSuaFabrica from './_components/ctaMonteSuaFabrica';
import Gt3000 from './_components/gt3000';
import ListaEmbalagens from './_components/listaEmbalagens';
import MaquinasDestaque from './_components/maquinas-destaque/maquinasDestaque';
import ScrollExpandMedia from './_components/scrollExpansionHero';
import ServicosPersonalizados from './_components/servicosPersonalizados';

export default function Home() {
  useEffect(() => {
    // Reset suave da página
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Evento de reset personalizado.
    const resetEvent = new CustomEvent('resetSection', {
      detail: { timestamp: Date.now() }
    });
    window.dispatchEvent(resetEvent);
  }, []);
  return (
    <div className='relative h-full w-full'>
      <ScrollExpandMedia>
        <HomeContent />
      </ScrollExpandMedia>
    </div>
  );
}

const HomeContent = () => {
  return (
    <div className='h-full w-full'>
      <div className='mx-auto flex h-full w-full flex-col items-center justify-center overflow-x-hidden'>
        <GridPattern />
        <Gt3000 />
        <CtaAjudarEmpresa />
        <CtaMonteSuaFabrica />
        <MaquinasDestaque />
        <CarrosselProdutos />
        <ListaEmbalagens />
        <ServicosPersonalizados />
      </div>
    </div>
  );
};
