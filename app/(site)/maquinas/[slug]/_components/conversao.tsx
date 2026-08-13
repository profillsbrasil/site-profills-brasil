import { AnimatedContainer } from '@/components/AnimatedContainer';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';
import { WHATSAPP_VENDAS, waLink } from '@/lib/utils/whatsapp';

import SpecificationModal from './specificationModal';

export function Conversao({ maquina }: { maquina: MaquinaCatalogo }) {
  const mensagem = `Olá! Tenho interesse na ${maquina.nome} (${maquina.nomeCompleto}).`;

  return (
    <section id='contato' className='scroll-mt-28 py-12 text-center md:py-16'>
      <AnimatedContainer>
        <h2 className='text-xl font-bold text-white md:text-2xl'>
          Pronto para dimensionar a {maquina.nome} na sua operação?
        </h2>
        <p className='text-muted-foreground mt-2'>
          Fale com o time técnico-comercial da Profills.
        </p>
        <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
          <SpecificationModal
            // TODO(fase 2/3): máquinas sem legacyId ficam com maquinaId=0 até o
            // payload migrar para slug (schema hoje exige maquinaId numérico min(1)).
            maquinaId={maquina.legacyId ?? 0}
            maquinaNome={maquina.nome}
          />
          <a
            href={waLink(WHATSAPP_VENDAS, mensagem)}
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground rounded-xs border border-[rgba(148,178,235,0.4)] px-6 py-3 font-semibold transition-colors'>
            Falar com um especialista
          </a>
        </div>
      </AnimatedContainer>
    </section>
  );
}
