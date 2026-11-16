import { FundoBlog, type TelaBlog } from './fundo-blog';

/** Casca navy das telas do blog: grade de 20 px, sketches atrás e o conteúdo por cima. */
export function PaginaBlog({
  tela,
  children
}: {
  tela: TelaBlog;
  children: React.ReactNode;
}) {
  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-[#0f172b] bg-[linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-size-[20px_20px] pt-16 text-white'>
      <FundoBlog tela={tela} />
      <div className='relative z-10'>{children}</div>
    </div>
  );
}

export const classeWrap = 'mx-auto w-full max-w-[72rem] px-4';

export const classeBotaoCheio =
  'inline-flex items-center gap-2 rounded-xs bg-white px-4 py-2.5 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#dbe6fb] focus-visible:bg-[#dbe6fb] focus-visible:outline-none';

export const classeBotaoLinha =
  'inline-flex items-center gap-2 rounded-xs border border-dashed border-[rgba(148,178,235,0.55)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-solid hover:border-accent focus-visible:border-solid focus-visible:border-accent focus-visible:outline-none aria-disabled:opacity-60';
