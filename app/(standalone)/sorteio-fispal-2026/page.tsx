import type { Metadata } from 'next';
import Image from 'next/image';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { Button } from '@/components/ui/button';

import logoProfills from '@/public/logo-branco.png';

// ===== Placeholders — preencher quando o folder do sorteio chegar =====
const WHATSAPP_NUMERO = '5519999999999'; // TODO: número real, formato internacional
const WHATSAPP_MENSAGEM =
  'Olá! Quero participar do Sorteio FISPAL 2026.'; // TODO: mensagem final
// ======================================================================

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
  WHATSAPP_MENSAGEM
)}`;

export const metadata: Metadata = {
  title: 'Sorteio FISPAL 2026 | Profills Brasil',
  description: 'Participe do sorteio da Profills Brasil na FISPAL 2026.',
  robots: { index: false, follow: false }
};

export default function SorteioFispal2026() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-slate-900 px-4 py-16'>
      <GridPattern />

      <Image
        src={logoProfills}
        alt='Logo Profills'
        priority
        className='z-10 h-auto w-40 md:w-48'
      />

      <h1 className='z-10 text-center text-2xl font-bold text-white md:text-4xl'>
        Sorteio FISPAL 2026
      </h1>

      {/* TODO: substituir o conteúdo deste card pelo folder/regras do sorteio */}
      <div className='border-border/20 z-10 flex w-full max-w-2xl flex-col items-center justify-center gap-3 rounded-xs border bg-slate-800 p-8 text-center text-white md:p-12'>
        <p className='text-lg font-semibold'>Regras em breve</p>
        <p className='text-sm text-slate-300'>
          As informações completas do sorteio serão publicadas aqui.
        </p>
      </div>

      <Button
        asChild
        className='z-10 bg-blue-600 text-white hover:bg-blue-700'>
        <a href={whatsappUrl} target='_blank' rel='noopener noreferrer'>
          Participar pelo WhatsApp
        </a>
      </Button>

      {/* TODO: adicionar <p className='z-10 max-w-2xl text-center text-xs text-slate-400'>
          com a nota legal do sorteio quando o conteúdo chegar */}
    </div>
  );
}
