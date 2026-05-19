import { Box } from 'lucide-react';

interface WebGLFallbackProps {
  className?: string;
  variant?: 'dark' | 'light';
}

const variantStyles = {
  dark: {
    card: 'border-white/10 bg-white/5',
    iconWrap: 'border-accent/30 bg-accent/10',
    icon: 'text-accent',
    title: 'text-white',
    text: 'text-white/60',
  },
  light: {
    card: 'border-border bg-muted',
    iconWrap: 'border-border bg-background',
    icon: 'text-muted-foreground',
    title: 'text-foreground',
    text: 'text-muted-foreground',
  },
} as const;

export function WebGLFallback({
  className = '',
  variant = 'light',
}: WebGLFallbackProps) {
  const s = variantStyles[variant];

  return (
    <div
      data-testid='webgl-fallback'
      className={`flex min-h-[220px] w-full max-w-sm flex-col items-center justify-center rounded-3xl border px-6 py-8 text-center backdrop-blur-sm ${s.card} ${className}`}>
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full border ${s.iconWrap}`}>
        <Box className={`h-7 w-7 ${s.icon}`} />
      </div>
      <span className={`mt-4 text-sm font-semibold tracking-wide ${s.title}`}>
        Visualização 3D indisponível
      </span>
      <span className={`mt-2 text-xs leading-relaxed ${s.text}`}>
        Seu navegador está com a aceleração de hardware (WebGL) desativada.
      </span>
      <span className={`mt-1 text-xs leading-relaxed ${s.text}`}>
        Ative a aceleração de gráficos nas configurações do navegador para ver o
        modelo em 3D.
      </span>
    </div>
  );
}
