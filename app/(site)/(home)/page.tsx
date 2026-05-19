'use client';

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
