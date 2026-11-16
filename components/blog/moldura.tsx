import { cn } from '@/lib/utils';

/** Caixa tracejada com as duas cotas de canto em azul (traço 1 do protótipo). */
export function Moldura({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-xs border border-dashed border-[rgba(148,178,235,0.3)] bg-[rgba(15,23,43,0.82)] transition-colors duration-300 before:absolute before:-top-px before:-left-px before:z-10 before:size-2 before:border-t before:border-l before:border-accent before:content-[''] after:absolute after:-right-px after:-bottom-px after:z-10 after:size-2 after:border-r after:border-b after:border-accent after:content-['']",
        className
      )}>
      {children}
    </div>
  );
}
