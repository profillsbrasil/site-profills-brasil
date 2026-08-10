import { cn } from '@/lib/utils';

interface HeroRingsProps {
  /** Reduced motion: só os anéis estáticos, sem giro/pulso/ping/satélite */
  estatico?: boolean;
  /** Incrementar a cada troca de slide remonta o ping (anima 1x) */
  pingKey?: number;
}

export function HeroRings({ estatico = false, pingKey = 0 }: HeroRingsProps) {
  return (
    <div
      aria-hidden='true'
      data-testid='hero-rings'
      className='absolute inset-0 grid place-items-center'>
      {/* glow central */}
      <span className='absolute aspect-square h-[66%] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16)_0%,transparent_65%)] blur-[8px]' />
      {/* anéis estáticos */}
      <span className='absolute aspect-square h-[104%] rounded-full border border-[rgba(148,178,235,0.06)]' />
      <span className='absolute aspect-square h-[86%] rounded-full border border-[rgba(148,178,235,0.14)]' />
      <span className='absolute aspect-square h-[64%] rounded-full border border-[rgba(148,178,235,0.10)]' />
      {/* anéis tracejados girando (ecoam as caixas tracejadas do site) */}
      <span
        className={cn(
          'absolute aspect-square h-[75%] rounded-full border border-dashed border-[rgba(96,148,246,0.35)]',
          !estatico && 'animate-[hero-spin_70s_linear_infinite]'
        )}
      />
      <span
        className={cn(
          'absolute aspect-square h-[96%] rounded-full border border-dashed border-[rgba(148,178,235,0.12)]',
          !estatico && 'animate-[hero-spin_110s_linear_infinite_reverse]'
        )}
      />
      {!estatico && (
        <>
          <span
            data-testid='hero-ring-pulso'
            className='absolute aspect-square h-[64%] animate-[hero-pulso_5.5s_cubic-bezier(0.16,1,0.3,1)_infinite] rounded-full border-[1.5px] border-[rgba(96,148,246,0.45)]'
          />
          <span
            data-testid='hero-ring-pulso'
            className='absolute aspect-square h-[64%] animate-[hero-pulso_5.5s_cubic-bezier(0.16,1,0.3,1)_2.75s_infinite] rounded-full border-[1.5px] border-[rgba(96,148,246,0.45)]'
          />
          <span
            key={pingKey}
            data-testid='hero-ring-ping'
            className='absolute aspect-square h-[64%] animate-[hero-ping_0.9s_cubic-bezier(0.16,1,0.3,1)_1] rounded-full border-2 border-[rgba(96,148,246,0.7)] opacity-0'
          />
          <span
            data-testid='hero-ring-satelite'
            className='absolute aspect-square h-[75%] animate-[hero-spin_26s_linear_infinite]'>
            <i className='absolute -top-[3px] left-1/2 block size-[7px] rounded-full bg-accent shadow-[0_0_12px_2px_rgba(59,130,246,0.7)]' />
          </span>
        </>
      )}
    </div>
  );
}
