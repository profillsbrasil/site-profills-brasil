'use client';

import { createContext, useContext, useState } from 'react';

import './proto.css';

const VarianteContext = createContext(0);

export function VarianteProvider({
  v,
  children
}: {
  v: number;
  children: React.ReactNode;
}) {
  return <VarianteContext value={v}>{children}</VarianteContext>;
}

export function useVariante() {
  return useContext(VarianteContext);
}

export function SeletorVariante({
  titulo,
  rotulos
}: {
  titulo: string;
  rotulos: string[];
}) {
  const ativa = useVariante();
  const [aberto, setAberto] = useState(false);

  const ir = (n: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('v', String(n));
    window.location.href = url.toString();
  };

  return (
    <div
      data-proto-seletor
      data-proto-ativa={ativa}
      className='fixed right-3 bottom-3 z-[100] w-[min(360px,calc(100vw-24px))] rounded-md border border-white/15 bg-slate-950/92 p-2 text-white shadow-2xl backdrop-blur'>
      <div className='mb-1.5 flex items-center justify-between gap-2 px-1'>
        <p className='font-mono text-[10px] tracking-widest text-slate-400 uppercase'>
          Protótipo · {titulo}
        </p>
        <button
          type='button'
          onClick={() => setAberto((a) => !a)}
          className='rounded-sm border border-white/20 px-1.5 py-0.5 text-[10px] text-slate-200 hover:bg-white/15'>
          {aberto ? 'fechar' : 'ver nomes'}
        </button>
      </div>
      {aberto ? (
        <div className='grid grid-cols-1 gap-1'>
          {rotulos.map((r, i) => (
            <button
              key={r}
              type='button'
              onClick={() => ir(i)}
              aria-pressed={ativa === i}
              className={
                'rounded-sm px-2 py-1.5 text-left text-xs leading-tight transition-colors ' +
                (ativa === i
                  ? 'bg-accent font-semibold text-white'
                  : 'bg-white/5 text-slate-200 hover:bg-white/15')
              }>
              {i} {r}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className='grid grid-cols-7 gap-1'>
            {rotulos.map((r, i) => (
              <button
                key={r}
                type='button'
                title={`${i} ${r}`}
                aria-label={`${i} ${r}`}
                onClick={() => ir(i)}
                aria-pressed={ativa === i}
                className={
                  'rounded-sm py-1.5 text-xs font-semibold transition-colors ' +
                  (ativa === i
                    ? 'bg-accent text-white'
                    : 'bg-white/5 text-slate-200 hover:bg-white/15')
                }>
                {i === 0 ? '0 atual' : i}
              </button>
            ))}
          </div>
          <p className='mt-1.5 px-1 text-xs leading-snug text-slate-200'>
            <b className='text-white'>{ativa}</b> {rotulos[ativa]}
          </p>
        </>
      )}
    </div>
  );
}
