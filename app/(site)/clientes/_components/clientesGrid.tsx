'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { BlurFade } from '@/components/ui/blur-fade';
import { listaClientes, normalizeQuery } from '@/lib/data/listaClientes';

import ClienteCard from './clienteCard';
import SearchToggle from './searchToggle';

const CHUNK_SIZE = 12;

export default function ClientesGrid() {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = normalizeQuery(query);
    if (!q) return listaClientes;
    return listaClientes.filter(
      (cliente) =>
        cliente.slug.includes(q) || normalizeQuery(cliente.name).includes(q)
    );
  }, [query]);

  // Query nova reinicia a paginação. Ajuste de estado durante o render em
  // vez de effect: evita um render extra com a contagem antiga.
  const [queryAnterior, setQueryAnterior] = useState(query);
  if (query !== queryAnterior) {
    setQueryAnterior(query);
    setVisibleCount(CHUNK_SIZE);
  }

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= filtered.length) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + CHUNK_SIZE, filtered.length)
          );
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visibleCount, filtered.length]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className='relative z-10 w-full'>
      <div className='pointer-events-none sticky top-20 z-20 mx-auto flex w-full max-w-7xl justify-end px-4 md:px-6'>
        <div className='pointer-events-auto'>
          <SearchToggle query={query} onChange={setQuery} />
        </div>
      </div>

      <div className='mx-auto w-full max-w-7xl px-4 pt-2 pb-8 md:px-6'>
        {filtered.length === 0 ? (
          <BlurFade key={`empty-${query}`} delay={0.05} direction='up' inView>
            <div className='border-border/40 mx-auto mt-10 max-w-md rounded-md border border-dashed bg-background/60 p-6 text-center'>
              <p className='text-sm text-muted-foreground'>
                Nenhum cliente encontrado para{' '}
                <span className='text-foreground font-medium'>“{query}”</span>.
              </p>
            </div>
          </BlurFade>
        ) : (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6'>
            {visible.map((cliente, index) => {
              const positionInChunk = index % CHUNK_SIZE;
              const delay = Math.min(positionInChunk * 0.04, 0.4);
              return (
                <BlurFade
                  key={`${query}-${cliente.id}`}
                  delay={delay}
                  direction='up'
                  inView
                  inViewMargin='-20px'>
                  <ClienteCard cliente={cliente} />
                </BlurFade>
              );
            })}
          </div>
        )}

        <div ref={sentinelRef} aria-hidden className='h-10 w-full' />
      </div>
    </div>
  );
}
