import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { autorAtual } from '@/lib/admin/sessao';
import logo from '@/public/logo.png';

import { FormEntrar } from './form-entrar';
import { voltaSegura } from './volta';

export const metadata: Metadata = { title: 'Entrar' };

export default async function EntrarPage({
  searchParams
}: {
  searchParams: Promise<{ volta?: string | string[] }>;
}) {
  const volta = voltaSegura((await searchParams).volta);

  if (await autorAtual()) redirect(volta);

  return (
    <main className='grid min-h-dvh place-items-center bg-white px-4 text-sm text-admin-texto'>
      <div className='grid w-full max-w-sm gap-6'>
        <Image src={logo} alt='Profills' sizes='131px' className='h-6 w-auto' />
        <div className='grid gap-1'>
          <h1 className='text-lg font-semibold'>Admin do blog</h1>
          <p className='text-admin-apagado'>
            Entre com o usuário e a senha do admin.
          </p>
        </div>
        <FormEntrar volta={volta} />
      </div>
    </main>
  );
}
