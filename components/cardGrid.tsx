'use client';

import { cn } from '@/lib/utils';
import { Cpu, Fingerprint, Zap } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import React from 'react';

const features = [
  {
    title: 'LINHA EMBALAGENS CARTONADAS',
    icon: Zap,
    modelos: ['GT 300 - 70'],
  },
  {
    title: 'STAND-UP POUCH',
    icon: Cpu,
    modelos: ['TC 4BC MECÂNICA SPEED'],
  },
  {
    title: 'LINHA TC 4S',
    icon: Fingerprint,
    modelos: ['TC 4S 200 - 2', 'TC 4S 240 - 2', 'TC 4S 280 - 2', 'TC 4S 360 - 2', 'TC 4S - 2'],
  },
];

export default function CardGrid() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
        <AnimatedContainer
          delay={0.4}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </AnimatedContainer>
      </div>
    </section>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: React.ComponentProps<typeof motion.div>['className'];
  children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type FeatureCardProps = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  modelos: string[];
};

export type FeatureCardPorps = React.ComponentProps<'div'> & {
  feature: FeatureCardProps;
};

export function FeatureCard({ feature, className, ...props }: FeatureCardPorps) {
  const p = genRandomPattern();

  return (
    <div
      className={cn(
        'relative overflow-hidden p-6 border border-black border-dashed divide-x divide-y divide-dashed',
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="from-foreground/5 to-foreground/1 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={p}
            className="fill-foreground/5 stroke-foreground/25 absolute inset-0 h-full w-full mix-blend-overlay"
          />
        </div>
      </div>
      <feature.icon className="text-foreground/75 size-6" strokeWidth={1} aria-hidden />
      <h3 className="mt-10 text-sm md:text-base">{feature.title}</h3>
      <p className="text-muted-foreground relative z-20 mt-2 text-xs font-light">
        {feature.modelos.map((modelo) => (
          <span key={modelo}>{modelo}</span>
        ))}
      </p>
    </div>
  );
}

export function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: React.ComponentProps<'svg'> & {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
}) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index) => (
            <rect
              strokeWidth="0"
              key={index}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

export function genRandomPattern(length?: number): number[][] {
  length = length ?? 5;
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7, // random x between 7 and 10
    Math.floor(Math.random() * 6) + 1, // random y between 1 and 6
  ]);
}
