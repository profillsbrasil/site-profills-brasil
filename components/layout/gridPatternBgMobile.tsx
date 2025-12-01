import { useId } from 'react';

import { cn } from '@/lib/utils';

interface GridPatternMobileProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[x: number, y: number]>;
  strokeDasharray?: string;
  className?: string;
  [key: string]: unknown;
}

export function GridPatternMobile({
  width = 20,
  height = 20,
  x = -1,
  y = -1,
  strokeDasharray = '0',
  squares,
  className,
  ...props
}: GridPatternMobileProps) {
  const id = useId();

  return (
    <svg
      aria-hidden='true'
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-white/30 stroke-slate-400 bg-background',
        className
      )}
      {...props}>
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits='userSpaceOnUse'
          x={x}
          y={y}>
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill='none'
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width='100%' height='100%' strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className='overflow-visible'>
          {squares.map(([x, y]) => (
            <rect
              strokeWidth='0'
              key={`${x}-${y}`}
              width={width - 1}
              height={height - 1}
              x={x * width + 1}
              y={y * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
