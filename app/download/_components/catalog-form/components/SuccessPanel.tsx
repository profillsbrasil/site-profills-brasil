'use client';

import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessPanelProps {
  email: string;
  onRestart: () => void;
}

export function SuccessPanel({ email, onRestart }: SuccessPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className='flex w-full flex-col items-center gap-5 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40'>
        <CheckCircle2
          className='h-9 w-9 text-emerald-300'
          strokeWidth={1.8}
        />
      </div>

      <div className='space-y-2'>
        <h2 className='text-2xl font-bold text-white sm:text-3xl'>
          Catálogo enviado!
        </h2>
        <p className='text-sm text-slate-200'>
          Enviamos o link de download para
          <br />
          <span className='font-semibold text-white'>{email}</span>.
        </p>
        <p className='text-xs text-slate-400'>
          Não encontrou na caixa de entrada? Verifique a pasta de spam. Link
          válido por 7 dias.
        </p>
      </div>

      <button
        type='button'
        onClick={onRestart}
        className='text-xs font-medium text-blue-300 underline-offset-4 hover:underline'>
        Solicitar para outro email
      </button>
    </motion.div>
  );
}
