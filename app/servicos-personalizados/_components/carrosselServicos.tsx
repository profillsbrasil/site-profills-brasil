import corteLaser from "@/lib/images/extras/servicos/outros/corte-laser.jpg";
import dobraCnc from "@/lib/images/extras/servicos/outros/dobra-cnc.jpg";
import soldagem from "@/lib/images/extras/servicos/outros/solda.jpg";
import tornoCnc from "@/lib/images/extras/servicos/outros/torno-cnc.jpg";
import tratamento from "@/lib/images/extras/servicos/outros/tratamento.jpg";
import usinagemCnc from "@/lib/images/extras/servicos/outros/usinagem.jpg";
import Image from "next/image";

const servicos = [
  {
    title: "Corte a Laser",
    imgServico: corteLaser,
  },
  {
    title: "Dobra CNC",
    imgServico: dobraCnc,
  },
  {
    title: "Usinagem CNC",
    imgServico: usinagemCnc,
  },
  {
    title: "Torno CNC",
    imgServico: tornoCnc,
  },
  {
    title: "Soldagem",
    imgServico: soldagem,
  },
  {
    title: "Tratamento Térmico",
    imgServico: tratamento,
  },
];

export default function CarrosselServicos() {
  return (
    <div className="scrollbar-hide flex h-48 w-full flex-row items-center justify-center gap-2 overflow-x-auto px-3 md:h-96 md:gap-3">
      {servicos.map((servico) => (
        <div
          key={servico.title}
          className="relative flex min-w-24 flex-col items-center justify-center transition-all duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-black/10 md:w-1/6 md:min-w-0"
        >
          <Image
            src={servico.imgServico}
            alt={servico.title}
            className="h-48 w-full rounded-xs object-cover md:h-96"
          />
          <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm font-semibold text-white md:text-xl">
            {servico.title}
          </h3>
        </div>
      ))}
    </div>
  );
}
