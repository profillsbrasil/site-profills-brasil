'use client';

import { useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { Search, X } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Props = {
  query: string;
  onChange: (value: string) => void;
};

export default function SearchToggle({ query, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  const collapse = () => setExpanded(false);

  return (
    <div className='flex items-center justify-end'>
      <AnimatePresence mode='wait' initial={false}>
        {expanded ? (
          <motion.div
            key='input'
            initial={{ width: 34, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 34, opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className='relative'>
            <Search
              aria-hidden
              className='text-secondary pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2'
            />
            <input
              autoFocus
              type='text'
              value={query}
              onChange={(event) => onChange(event.target.value)}
              onBlur={collapse}
              placeholder='Buscar...'
              aria-label='Buscar cliente'
              className='border-secondary focus:ring-secondary/30 w-full rounded-md border bg-white py-1.5 pr-8 pl-8 text-sm text-foreground shadow-sm outline-none transition-shadow focus:ring-2'
            />
            {query && (
              <button
                type='button'
                aria-label='Limpar busca'
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onChange('')}
                className='text-secondary hover:text-secondary/70 absolute top-1/2 right-2 -translate-y-1/2'>
                <X className='size-4' />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.button
            key='icon'
            type='button'
            aria-label='Abrir busca'
            onClick={() => setExpanded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
            className='bg-secondary hover:bg-secondary/90 flex size-9 items-center justify-center rounded-md text-secondary-foreground shadow-md transition-colors'>
            <Search className='size-4' />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
