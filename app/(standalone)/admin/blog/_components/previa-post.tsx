import { ConteudoPost } from '@/components/blog/conteudo-post';
import { type Post, assuntos } from '@/lib/blog/tipos';

export type Dispositivo = 'computador' | 'celular';

const vazio = (texto: string) => (
  <span className='text-[#b6c5e2] italic opacity-70'>{texto}</span>
);

const fundoGrade = {
  backgroundImage:
    'linear-gradient(rgba(148,163,184,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.1) 1px,transparent 1px)',
  backgroundSize: '20px 20px'
};

export function PreviaPost({
  post,
  dispositivo
}: {
  post: Post;
  dispositivo: Dispositivo;
}) {
  const celular = dispositivo === 'celular';

  return (
    <article
      data-previa={dispositivo}
      className='overflow-hidden rounded-xs bg-[#0f172b] text-[15px] leading-relaxed text-white'
      style={fundoGrade}>
      <header
        className={`grid items-center gap-6 border-b border-dashed border-[rgba(148,178,235,0.22)] bg-[#172038] px-6 pt-7 pb-13 ${post.capa && !celular ? 'grid-cols-[1.2fr_1fr]' : 'grid-cols-1'}`}>
        <div>
          <h1 className='text-[clamp(1.4rem,3vw,2.2rem)] leading-[1.08] font-extrabold tracking-tight text-balance'>
            {post.titulo || vazio('Título do post')}
          </h1>
          <p className='mt-3 text-base leading-normal text-[#b6c5e2]'>
            {post.resumo || vazio('Resumo')}
          </p>
          <div className='mt-3.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.66rem] tracking-wider text-[#b6c5e2] uppercase'>
            <b className='flex items-center gap-1.5 font-normal text-white'>
              <span aria-hidden='true' className='size-1.5 bg-[#3b80f6]' />
              {assuntos[post.assunto].nome}
            </b>
            <span>15 nov 2026</span>
          </div>
        </div>
        {post.capa ? (
          // O caminho público serve o original; a prévia não passa pelo otimizador.
          // oxlint-disable-next-line nextjs/no-img-element
          <img
            src={post.capa}
            alt=''
            className='aspect-[4/3] w-full object-contain'
          />
        ) : null}
      </header>
      <div
        className={`-mt-8 mb-6 flex flex-col gap-4 border border-dashed border-[rgba(148,178,235,0.3)] bg-[#0d1424] text-[#d9e1f2] ${celular ? 'mx-2.5 p-4' : 'mx-5 p-6'}`}>
        {post.linhas.length === 0
          ? vazio('O post ainda não tem conteúdo.')
          : null}
        <ConteudoPost linhas={post.linhas} modo='previa' celular={celular} />
      </div>
    </article>
  );
}
