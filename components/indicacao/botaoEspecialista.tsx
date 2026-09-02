'use client';

import { useContatoComercial } from './useContatoComercial';

/**
 * "Falar com um especialista" das fichas de máquina. Client Component para
 * que a página (SSG) continue estática e só este link troque com a Indicação.
 */
export function BotaoEspecialista({
  mensagem,
  className
}: {
  mensagem: string;
  className: string;
}) {
  const comercial = useContatoComercial();

  return (
    <a
      href={comercial.pronto ? comercial.whatsapp(mensagem) : undefined}
      aria-disabled={!comercial.pronto || undefined}
      {...(comercial.pronto && {
        target: '_blank',
        rel: 'noopener noreferrer'
      })}
      className={className}>
      Falar com um especialista
    </a>
  );
}
