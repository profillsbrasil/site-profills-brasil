import Image from 'next/image';

import { cn } from '@/lib/utils';

interface Model3DFallbackProps {
  className?: string;
  imageSrc?: string;
  label: string;
  loading?: boolean;
  minHeight?: number | string;
  subtitle?: string;
}

export function Model3DFallback({
  className,
  imageSrc,
  label,
  loading = false,
  minHeight = 250,
  subtitle
}: Model3DFallbackProps) {
  return (
    <div
      className={cn(
        'relative isolate flex h-full w-full items-center justify-center overflow-hidden rounded-xs border border-white/10 bg-slate-950 text-white',
        className
      )}
      style={{ minHeight }}>
      <div className='absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950/80' />
      <div className='absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:26px_26px]' />

      {imageSrc ? (
        <div className='relative h-full w-full max-w-[18rem]'>
          <Image
            src={imageSrc}
            alt={label}
            fill
            sizes='(max-width: 768px) 50vw, 35vw'
            className='object-contain p-6'
          />
        </div>
      ) : (
        <div className='relative flex h-24 w-24 items-center justify-center rounded-full border border-blue-400/35 bg-blue-500/10 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100'>
          3D
        </div>
      )}

      <div className='absolute inset-x-3 bottom-3 rounded-xs border border-white/10 bg-slate-950/75 px-3 py-2 backdrop-blur-sm'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-200'>
          {loading ? 'Carregando' : 'Prévia 3D'}
        </p>
        <p className='text-sm font-medium text-white'>{label}</p>
        {subtitle ? <p className='text-xs text-slate-300'>{subtitle}</p> : null}
      </div>

      {loading ? (
        <div className='absolute right-3 top-3 h-7 w-7 animate-spin rounded-full border-2 border-blue-300/70 border-t-transparent' />
      ) : null}
    </div>
  );
}
