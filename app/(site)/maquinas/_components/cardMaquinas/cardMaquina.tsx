import Link from 'next/link';

import MaquinaCard from './maquinaCard';
import { maquinasData } from './maquinasData';

interface CardMaquinaProps {
  maquinas?: typeof maquinasData;
  filterKey?: string; // Chave para forçar re-renderização quando filtros mudam
  filtersApplied?: boolean; // Indica se os filtros foram aplicados da URL
}

export default function CardMaquina({
  maquinas = maquinasData,
  filterKey,
  filtersApplied = false
}: CardMaquinaProps) {
  return (
    <div className='z-10 mt-8 mr-2 grid min-h-screen w-full grid-cols-1 gap-5 rounded-xs px-4 md:max-w-5/6 md:grid-cols-3 md:px-0'>
      {maquinas.map((maquina, index) => (
        <Link
          href={`/maquinas/${maquina.id}`}
          key={`${maquina.id}-${filterKey || 'default'}`}>
          <MaquinaCard
            key={`${maquina.id}-${filterKey || 'default'}`}
            maquina={maquina}
            index={index}
            filtersApplied={filtersApplied}
          />
        </Link>
      ))}
    </div>
  );
}
