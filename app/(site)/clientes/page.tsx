import type { Metadata } from 'next';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { metadataDaPagina } from '@/lib/seo/metadata';

import ClientesGrid from './_components/clientesGrid';
import HeroClientes from './_components/heroClientes';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Clientes',
  descricao:
    'Marcas e indústrias que confiam na Profills para suas linhas de envase, embalagem e automação.',
  path: '/clientes'
});

export default function Clientes() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center pb-16'>
      <GridPattern />
      <HeroClientes />
      <ClientesGrid />
    </div>
  );
}
