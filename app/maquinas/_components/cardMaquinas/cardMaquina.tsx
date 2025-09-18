import Link from "next/link";
import MaquinaCard from "./maquinaCard";
import { maquinasData } from "./maquinasData";
interface CardMaquinaProps {
  maquinas?: typeof maquinasData;
}

export default function CardMaquina({
  maquinas = maquinasData,
}: CardMaquinaProps) {
  return (
    <div className="z-10 mt-8 mr-2 grid min-h-screen w-full grid-cols-1 gap-5 rounded-xs px-4 md:max-w-5/6 md:grid-cols-3 md:px-0">
      {maquinas.map((maquina) => (
        <Link href={`/maquinas/${maquina.id}`} key={maquina.id}>
          <MaquinaCard key={maquina.id} maquina={maquina} />
        </Link>
      ))}
    </div>
  );
}
