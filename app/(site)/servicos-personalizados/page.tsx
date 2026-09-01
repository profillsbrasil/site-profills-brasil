import type { Metadata } from 'next';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { metadataDaPagina } from '@/lib/seo/metadata';

import CarrosselServicos from './_components/carrosselServicos';
import ContactForm from './_components/contact-form/ContactForm';
import ListaServicos from './_components/listaServicos';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Serviços industriais personalizados',
  descricao:
    'Peças sob medida em inox, cortes, dobras e adaptações de linha. Conte o que a sua produção precisa e a engenharia da Profills projeta.',
  path: '/servicos-personalizados'
});

export default function ServicosPersonalizados() {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center pt-10 pb-10 md:px-0'>
      <h1 className='sr-only'>
        Serviços industriais personalizados da Profills
      </h1>
      <GridPattern />
      <video
        src='/videos/servico-personalizado.mp4'
        autoPlay
        loop
        muted
        playsInline
        className='z-10 mb-3 h-48 w-full rounded-xs object-fill md:h-full md:object-cover'
      />
      <CarrosselServicos />

      <div className='z-10 flex h-full w-full max-w-6xl flex-col items-center justify-center px-4'>
        <ListaServicos />
        <ContactForm />
      </div>
    </div>
  );
}
