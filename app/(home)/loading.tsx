export default function Loading() {
  return (
    <div className='relative min-h-screen w-full bg-secondary'>
      {/* Mobile skeleton */}
      <div className='flex min-h-screen w-full flex-col justify-evenly px-6 py-16 md:hidden'>
        <div>
          <div className='h-8 w-3/4 animate-pulse rounded bg-white/10' />
          <div className='mt-3 h-5 w-1/2 animate-pulse rounded bg-white/10' />
          <div className='mt-6 h-12 w-2/3 animate-pulse rounded bg-white/10' />
        </div>
        <div className='mx-auto h-[320px] w-full animate-pulse rounded-xl bg-white/5' />
      </div>

      {/* Desktop skeleton */}
      <div className='hidden min-h-screen w-full items-center justify-center md:flex'>
        <div className='mx-auto flex w-full max-w-[70vw] flex-row items-center'>
          <div className='flex w-1/2 flex-col gap-4'>
            <div className='h-10 w-3/4 animate-pulse rounded bg-white/10' />
            <div className='h-6 w-1/2 animate-pulse rounded bg-white/10' />
            <div className='mt-4 h-16 w-2/3 animate-pulse rounded bg-white/10' />
          </div>
          <div className='flex w-1/2 items-center justify-center'>
            <div className='h-[70vh] w-1/2 animate-pulse rounded-xl bg-white/5' />
          </div>
        </div>
      </div>
    </div>
  );
}
