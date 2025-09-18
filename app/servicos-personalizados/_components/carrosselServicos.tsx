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
    <div className="flex h-96 w-full flex-row items-center justify-center gap-3 px-3">
      {servicos.map((servico) => (
        <div
          key={servico.title}
          className="relative flex w-1/6 flex-col items-center justify-center transition-all duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-black/10"
        >
          <Image
            src={servico.imgServico}
            alt={servico.title}
            className="h-96 w-full rounded-sm object-cover"
          />
          <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xl font-semibold text-white">
            {servico.title}
          </h3>
        </div>
      ))}
    </div>
  );
}
