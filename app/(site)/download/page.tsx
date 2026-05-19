import type { Metadata } from 'next';
import Image from 'next/image';

import fabricaBg from '@/lib/images/extras/FabricaRemderNew.png';

import { CatalogForm } from './_components/catalog-form/CatalogForm';
import { ExpiredBanner } from './_components/catalog-form/components/ExpiredBanner';

export const metadata: Metadata = {
  title: 'Solicitar Catálogo — Profills Brasil',
  description:
    'Receba o catálogo completo da Profills no seu email. Máquinas envasadoras, embaladoras e linhas de produção industriais.'
};

type SearchParams = Promise<{ error?: 'expired' | 'invalid' }>;

export default async function DownloadPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const validError = error === 'expired' || error === 'invalid' ? error : null;

  return (
    <main className='relative flex min-h-screen w-full items-center justify-center overflow-hidden'>
      <Image
        src={fabricaBg}
        alt=''
        fill
        priority
        placeholder='blur'
        sizes='100vw'
        className='object-cover'
      />
      <div className='absolute inset-0 bg-gradient-to-b from-slate-900/65 to-slate-950/85' />

      <div className='relative z-10 flex w-full flex-col items-center px-4 py-16 sm:py-24'>
        {validError && <ExpiredBanner reason={validError} />}
        <CatalogForm />
      </div>
    </main>
  );
}
