'use client';

import Image from 'next/image';

import { motion } from 'motion/react';

import type { Cliente } from '@/lib/data/listaClientes';

const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

export default function ClienteCard({ cliente }: { cliente: Cliente }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
      className='flex aspect-[1.6/1] w-full items-center justify-center p-4'>
      <Image
        src={cliente.image}
        alt={cliente.name}
        sizes='(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 380px'
        className='h-full w-full object-contain'
        placeholder='blur'
      />
    </motion.div>
  );
}
