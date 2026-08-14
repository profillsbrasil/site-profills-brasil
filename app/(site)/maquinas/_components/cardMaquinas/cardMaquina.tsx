import Link from 'next/link';

import { maquinasCatalogo } from '@/lib/data/maquinas';
import type { MaquinaCatalogo } from '@/lib/data/maquinas';

import MaquinaCard from './maquinaCard';

interface CardMaquinaProps {
  maquinas?: MaquinaCatalogo[];
  filterKey?: string; // Chave para forçar re-renderização quando filtros mudam
  filtersApplied?: boolean; // Indica se os filtros foram aplicados da URL
}

export default function CardMaquina({
  maquinas = maquinasCatalogo,
  filterKey,
  filtersApplied = false
}: CardMaquinaProps) {
  return (
    <div className='z-10 mt-8 mr-2 grid min-h-screen w-full min-w-0 grid-cols-1 gap-5 rounded-xs px-4 md:grid-cols-3 md:px-0'>
      {maquinas.map((maquina, index) => (
        <Link
          href={`/maquinas/${maquina.slug}`}
          key={`${maquina.slug}-${filterKey || 'default'}`}>
          <MaquinaCard
            key={`${maquina.slug}-${filterKey || 'default'}`}
            maquina={maquina}
            index={index}
            filtersApplied={filtersApplied}
          />
        </Link>
      ))}
    </div>
  );
}
