'use client';

import { Button } from '@/components/ui/button';

import { classeBotaoCheio } from './blog/_components/estilos';

export default function ErroAdmin({
  unstable_retry
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className='grid min-h-dvh place-items-center bg-white px-4 text-sm text-admin-texto'>
      <div role='alert' className='grid max-w-sm gap-3'>
        <h1 className='text-lg font-semibold'>O banco do blog não respondeu</h1>
        <p className='text-admin-apagado'>
          Nada foi perdido do que já estava salvo. Tente de novo em alguns
          segundos.
        </p>
        <Button
          type='button'
          onClick={() => unstable_retry()}
          className={`justify-self-start ${classeBotaoCheio}`}>
          Tentar de novo
        </Button>
      </div>
    </main>
  );
}
