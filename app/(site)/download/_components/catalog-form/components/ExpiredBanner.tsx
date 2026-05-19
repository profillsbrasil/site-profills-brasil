import { AlertTriangle, Clock } from 'lucide-react';

interface ExpiredBannerProps {
  reason: 'expired' | 'invalid';
}

const COPY = {
  expired: {
    icon: Clock,
    title: 'Seu link expirou',
    description:
      'O link de download tem validade de 7 dias. Solicite o catálogo novamente abaixo.'
  },
  invalid: {
    icon: AlertTriangle,
    title: 'Link inválido',
    description:
      'Não conseguimos validar este link. Solicite um novo catálogo abaixo.'
  }
};

export function ExpiredBanner({ reason }: ExpiredBannerProps) {
  const { icon: Icon, title, description } = COPY[reason];
  return (
    <div className='mb-6 flex w-full max-w-md items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-100 backdrop-blur-md'>
      <Icon className='mt-0.5 h-5 w-5 shrink-0 text-amber-300' />
      <div className='space-y-0.5'>
        <p className='text-sm font-semibold'>{title}</p>
        <p className='text-xs text-amber-100/85'>{description}</p>
      </div>
    </div>
  );
}
