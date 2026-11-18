import Link from 'next/link';

import {
  PaginaBlog,
  classeBotaoCheio,
  classeWrap
} from './_components/pagina-blog';

export default function PostNaoEncontrado() {
  return (
    <PaginaBlog tela='leitura'>
      <div className={`${classeWrap} py-24`}>
        <div className='max-w-xl rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)] p-8'>
          <h1 className='text-2xl font-bold'>Este post não está no ar</h1>
          <p className='mt-2 mb-6 text-[#b6c5e2]'>
            O endereço pode ter mudado ou o post saiu do blog.
          </p>
          <Link href='/blog' className={classeBotaoCheio}>
            Ver os posts do blog
          </Link>
        </div>
      </div>
    </PaginaBlog>
  );
}
