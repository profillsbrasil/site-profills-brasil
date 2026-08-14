'use client';

interface SubNavMaquinaProps {
  nome: string;
  secoes: { id: string; rotulo: string }[];
  children?: React.ReactNode;
}

export function SubNavMaquina({ nome, secoes, children }: SubNavMaquinaProps) {
  return (
    <nav
      aria-label='Seções da página'
      className='sticky top-0 z-40 -mx-4 border-b border-dashed border-[rgba(148,178,235,0.3)] bg-slate-900/95 backdrop-blur-sm md:top-16 md:-mx-8'>
      <div className='mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-2 md:gap-6 md:px-8'>
        <span className='shrink-0 font-mono text-sm font-bold text-white'>
          {nome}
        </span>
        <span className='h-4 w-px shrink-0 bg-[rgba(148,178,235,0.25)]' />
        {secoes.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className='text-muted-foreground hover:text-foreground shrink-0 font-mono text-xs tracking-wider uppercase transition-colors'>
            {s.rotulo}
          </a>
        ))}
        <div className='ml-auto shrink-0'>{children}</div>
      </div>
    </nav>
  );
}
