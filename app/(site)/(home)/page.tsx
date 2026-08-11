'use client';

import { GridPattern } from '@/components/layout/gridPatternBg';

import CarrosselProdutos from './_components/carrosselProdutos';
import CtaAjudarEmpresa from './_components/ctaAjudarEmpresa';
import CtaMonteSuaFabrica from './_components/ctaMonteSuaFabrica';
import Gt3000 from './_components/gt3000';
import HeroCarrossel from './_components/heroCarrossel/heroCarrossel';
import ListaEmbalagens from './_components/listaEmbalagens';
import MaquinasDestaque from './_components/maquinas-destaque/maquinasDestaque';
import ServicosPersonalizados from './_components/servicosPersonalizados';

export default function Home() {
  return (
    <div className='relative h-full w-full'>
      <HeroCarrossel />
      <section className='tema-navy relative z-20 min-h-screen border-t border-dashed border-[rgba(148,178,235,0.22)] bg-background text-foreground'>
        <HomeContent />
      </section>
    </div>
  );
}

const HomeContent = () => {
  return (
    <div className='h-full w-full'>
      <div className='mx-auto flex h-full w-full flex-col items-center justify-center overflow-x-hidden'>
        <GridPattern />
        <Gt3000 />
        {/* Faixas elevadas: um tom acima do navy base + separadores tracejados,
            criando o ritmo claro↔escuro entre as seções */}
        <div className='w-full border-y border-dashed border-[rgba(148,178,235,0.22)] bg-[oklch(0.2380_0.0430_266)]'>
          <CtaAjudarEmpresa />
        </div>
        <CtaMonteSuaFabrica />
        <MaquinasDestaque />
        <div className='w-full border-y border-dashed border-[rgba(148,178,235,0.22)] bg-[oklch(0.2380_0.0430_266)]'>
          <CarrosselProdutos />
        </div>
        <ListaEmbalagens />
        <div className='w-full border-y border-dashed border-[rgba(148,178,235,0.22)] bg-[oklch(0.2380_0.0430_266)]'>
          <ServicosPersonalizados />
        </div>
      </div>
    </div>
  );
};
