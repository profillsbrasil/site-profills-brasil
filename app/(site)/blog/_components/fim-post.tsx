import Image from 'next/image';
import Link from 'next/link';

import { Moldura } from '@/components/blog/moldura';
import { BotaoEspecialista } from '@/components/indicacao/botaoEspecialista';
import { primeiraMaquina } from '@/lib/blog/apresentacao';
import {
  type PostPublicado,
  type ResumoPublicado,
  assuntos
} from '@/lib/blog/tipos';
import { CONTATO_PADRAO } from '@/lib/data/contatos';
import { getMaquinaBySlug } from '@/lib/data/maquinas';
import { waLink } from '@/lib/utils/whatsapp';

import { CartaoPost } from './cartao-post';
import { classeBotaoCheio, classeBotaoLinha } from './pagina-blog';
import { ArrowRight } from 'lucide-react';

const classePlaca =
  'rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,42,0.72)] p-5';

function ChamadaMaquina({ guardado }: { guardado: PostPublicado }) {
  const slug = primeiraMaquina(guardado.post);
  const maquina = slug ? getMaquinaBySlug(slug) : undefined;

  const mensagem = maquina
    ? `Olá! Li no blog da Profills sobre a ${maquina.nome} e quero saber mais.`
    : 'Olá! Li um post no blog da Profills e quero falar sobre máquinas.';

  return (
    <div
      className={`${classePlaca} grid items-center gap-5 ${maquina?.imagens ? 'sm:grid-cols-[9rem_1fr]' : ''}`}>
      {maquina?.imagens ? (
        <Moldura className='aspect-video sm:aspect-square'>
          <Image
            src={maquina.imagens.maquina}
            alt=''
            fill
            sizes='(min-width: 640px) 144px, 100vw'
            className='object-contain p-[5%]'
          />
        </Moldura>
      ) : null}
      <div>
        <h2 className='text-xl leading-tight font-bold'>
          {maquina ? maquina.seo.titulo : 'Conheça as máquinas da Profills'}
        </h2>
        <p className='mt-1.5 mb-4 text-[0.9rem] text-[#b6c5e2]'>
          {maquina
            ? 'Veja a ficha completa, os opcionais e o modelo 3D da máquina.'
            : 'Envasadoras, embaladoras e linhas completas, com ficha técnica.'}
        </p>
        <div className='flex flex-wrap gap-2.5'>
          <Link
            href={maquina ? `/maquinas/${maquina.slug}` : '/maquinas'}
            className={classeBotaoCheio}>
            {maquina ? 'Ver a máquina' : 'Ver as máquinas'}
            <ArrowRight aria-hidden='true' className='size-3.5' />
          </Link>
          <BotaoEspecialista mensagem={mensagem} className={classeBotaoLinha} />
        </div>
      </div>
    </div>
  );
}

function ChamadaContato() {
  return (
    <div className={classePlaca}>
      <h2 className='text-xl leading-tight font-bold'>Fale com a Profills</h2>
      <p className='mt-1.5 mb-4 text-[0.9rem] text-[#b6c5e2]'>
        O suporte técnico e o time de vendas atendem pelo WhatsApp.
      </p>
      <div className='flex flex-wrap gap-2.5'>
        <a
          href={waLink(
            CONTATO_PADRAO.suporte.telefone,
            'Olá! Vim pelo blog da Profills e preciso de suporte técnico.'
          )}
          target='_blank'
          rel='noopener noreferrer'
          className={classeBotaoCheio}>
          Falar com o suporte
          <ArrowRight aria-hidden='true' className='size-3.5' />
        </a>
        <BotaoEspecialista
          mensagem='Olá! Vim pelo blog da Profills e quero falar com vendas.'
          className={classeBotaoLinha}
        />
      </div>
    </div>
  );
}

/** O fim depende do assunto: máquina leva à máquina e ao especialista, aviso aos contatos, e todo post a outros posts. */
export function FimPost({
  guardado,
  outros
}: {
  guardado: PostPublicado;
  outros: ResumoPublicado[];
}) {
  const fim = assuntos[guardado.post.assunto].fim;

  if (fim === 'leitura' && outros.length === 0) return null;

  return (
    <div className='mt-12 grid gap-8 border-t border-dashed border-[rgba(148,178,235,0.22)] pt-8'>
      {fim === 'maquina' ? <ChamadaMaquina guardado={guardado} /> : null}
      {fim === 'contato' ? <ChamadaContato /> : null}
      {outros.length > 0 ? (
        <section aria-labelledby='outros-posts'>
          <h2 id='outros-posts' className='mb-4 text-xl font-bold'>
            {fim === 'leitura' ? 'Continue lendo' : 'Leia também'}
          </h2>
          <div className='grid gap-5 sm:grid-cols-2 md:grid-cols-3'>
            {outros.map((p) => (
              <CartaoPost key={p.slug} post={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
