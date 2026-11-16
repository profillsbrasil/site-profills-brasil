'use client';

import Link from 'next/link';

import {
  PaginaBlog,
  classeBotaoCheio,
  classeBotaoLinha,
  classeWrap
} from './_components/pagina-blog';

// A listagem e a leitura só lançam quando o banco do blog não responde.
export default function ErroBlog({
  unstable_retry
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <PaginaBlog tela='listagem'>
      <div className={`${classeWrap} py-24`}>
        <div
          role='alert'
          className='max-w-xl rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)] p-8'>
          <h1 className='text-2xl font-bold'>O blog não abriu agora</h1>
          <p className='mt-2 mb-6 text-[#b6c5e2]'>
            Os posts estão guardados, mas não conseguimos buscá-los. Tente de
            novo em alguns segundos.
          </p>
          <div className='flex flex-wrap gap-2.5'>
            <button
              type='button'
              onClick={() => unstable_retry()}
              className={classeBotaoCheio}>
              Tentar de novo
            </button>
            <Link href='/' className={classeBotaoLinha}>
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </PaginaBlog>
  );
}
