import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { type AdminBlog, abrirAdminBlog } from '@/lib/blog/admin';
import { tamanhoDoArquivo } from '@/lib/blog/apresentacao';
import type { UsoImagem } from '@/lib/blog/tipos';
import { logger } from '@/lib/utils/logger';

import { enderecoDeEntrada } from '../../entrar/volta';
import { dataPorExtenso } from '../_components/datas';
import { Lateral } from '../_components/lateral';

export const metadata: Metadata = { title: 'Imagens' };

const colunas =
  'grid grid-cols-[44px_minmax(0,1fr)_15rem_6.5rem_5rem_11rem] items-center gap-4 px-4';

const selos: Record<UsoImagem, { rotulo: string; classe: string }> = {
  capa: { rotulo: 'Capa', classe: 'bg-[#e3f3ea] text-[#1f7a4d]' },
  texto: { rotulo: 'No texto', classe: 'bg-[#eceef2] text-[#5a6172]' },
  semUso: { rotulo: 'Sem uso', classe: 'bg-[#fbeee0] text-[#9a4f12]' }
};

/** null quando o armazém não respondeu: a tela mostra o aviso e a lateral fica sem número. */
async function imagensOuAviso(admin: AdminBlog) {
  try {
    return await admin.listarImagens();
  } catch (erro) {
    logger.warn('O armazém não respondeu à lista de imagens', erro);

    return null;
  }
}

export default async function ImagensPage() {
  const admin = await abrirAdminBlog();

  if (!admin) redirect(enderecoDeEntrada('/admin/blog/imagens'));

  const [posts, imagens] = await Promise.all([
    admin.listar(),
    imagensOuAviso(admin)
  ]);

  return (
    <div className='grid h-dvh grid-cols-[auto_minmax(0,1fr)] bg-[#0f172b] text-sm'>
      <Lateral
        atual='imagens'
        totais={{ posts: posts.length, imagens: imagens?.length ?? null }}
      />

      <main className='my-2 mr-2 flex min-h-0 flex-col overflow-hidden rounded-xs bg-[#f3f4f6] text-[#1b1c1f]'>
        <header className='flex min-h-14 items-center gap-3 border-b border-[#dfe2e8] bg-white px-5 py-3'>
          <h1 className='text-lg font-semibold'>Imagens</h1>
        </header>

        <div className='min-h-0 flex-1 overflow-y-auto p-5'>
          {imagens === null ? (
            <div className='grid justify-items-center gap-3 rounded-xs border border-dashed border-[#8a90a0] bg-white p-10 text-center'>
              <h2 className='text-base font-semibold'>
                O armazém de imagens não respondeu
              </h2>
              <p className='max-w-sm text-xs text-[#5a6172]'>
                A lista não carregou agora. Os posts e o editor continuam
                abertos; recarregue esta página em alguns minutos.
              </p>
            </div>
          ) : imagens.length === 0 ? (
            <div className='grid justify-items-center gap-3 rounded-xs border border-dashed border-[#8a90a0] bg-white p-10 text-center'>
              <h2 className='text-base font-semibold'>Nenhuma imagem ainda</h2>
              <p className='max-w-sm text-xs text-[#5a6172]'>
                As imagens aparecem aqui quando você envia uma capa ou um bloco
                de imagem no editor de um post.
              </p>
            </div>
          ) : (
            <div className='overflow-hidden rounded-xs border border-[#dfe2e8] bg-white'>
              <div
                aria-hidden='true'
                className={`${colunas} border-b border-[#dfe2e8] bg-[#f7f8fa] py-2 text-xs font-medium text-[#5a6172]`}>
                <span />
                <span>Arquivo</span>
                <span>Post</span>
                <span>Uso</span>
                <span className='text-right'>Tamanho</span>
                <span>Enviada em</span>
              </div>
              <ul>
                {imagens.map(
                  ({
                    caminho,
                    arquivo,
                    slug,
                    tituloDoPost,
                    uso,
                    tamanho,
                    enviadaEm
                  }) => (
                    <li
                      key={caminho}
                      className='border-b border-[#eceef2] last:border-b-0'>
                      <a
                        href={caminho}
                        target='_blank'
                        rel='noreferrer'
                        className={`${colunas} py-2 transition-colors outline-none hover:bg-[#f7f8fa] focus-visible:bg-[#f7f8fa] motion-reduce:transition-none`}>
                        <Image
                          src={caminho}
                          alt=''
                          width={44}
                          height={33}
                          className='h-[33px] w-11 rounded-xs bg-[#d9dde4] object-cover'
                        />
                        <span className='truncate font-mono text-xs'>
                          {arquivo}
                        </span>
                        <span className='truncate text-[#5a6172]'>
                          {tituloDoPost === null
                            ? slug
                            : tituloDoPost || 'Sem título'}
                        </span>
                        <span
                          className={`justify-self-start rounded-xs px-2 py-0.5 text-xs font-medium whitespace-nowrap ${selos[uso].classe}`}>
                          {selos[uso].rotulo}
                        </span>
                        <span className='text-right font-mono text-xs text-[#5a6172]'>
                          {tamanhoDoArquivo(tamanho)}
                        </span>
                        <span className='text-[#5a6172]'>
                          {dataPorExtenso(enviadaEm)}
                        </span>
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
