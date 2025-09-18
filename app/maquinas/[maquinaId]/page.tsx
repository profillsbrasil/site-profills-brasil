import { GridPattern } from "@/components/layout/gridPatternBg";
import { Highlighter } from "@/components/magicui/highlighter";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import { maquinasData } from "../_components/cardMaquinas/maquinasData";
import SpecificationModal from "./_components/specificationModal";

interface MaquinaPageProps {
  params: {
    maquinaId: string;
  };
}

export default async function Maquina({ params }: MaquinaPageProps) {
  const { maquinaId } = await params;
  const maquina = maquinasData.find(
    (maquina) => maquina.id === parseInt(maquinaId),
  );

  if (!maquina) {
    notFound();
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-900 pt-10 md:pt-10">
      <GridPattern />
      <div className="relative flex h-full w-full max-w-7xl flex-col-reverse items-center justify-center gap-0 text-white md:h-[83vh] md:flex-row md:gap-10">
        <div className="flex h-5/6 w-full flex-col items-center justify-center gap-5 md:w-1/2 md:gap-20">
          <div className="relative flex h-1/2 flex-col items-center justify-center px-4 md:items-start md:px-0">
            <Highlighter
              action="underline"
              color="#2d62ef"
              animationDuration={maquina.unidadeMaxima}
              textColor="z-10 text-3xl  mb-5 md:mb-8 font-bold tracking-wider text-white text-center md:text-left uppercase"
            >
              {maquina.name}
            </Highlighter>
            <p className="border-border/30 border-x border-t border-dashed bg-slate-900 p-2 px-4 text-xl leading-relaxed tracking-wide">
              {maquina.descricao}
            </p>
            <p className="border-border/30 border border-dashed bg-slate-900 p-4 text-center md:text-left">
              {maquina.about}
            </p>
            <ProducaoMaxima
              maquina={maquina}
              className="flex h-fit w-1/2 md:hidden"
            />
          </div>
          <div className="relative flex h-1/2 flex-col items-start justify-center">
            <ProducaoMaxima
              maquina={maquina}
              className="absolute top-0 right-0 hidden md:flex"
            />
            <div className="hidden h-1/3 flex-col items-start justify-center md:flex">
              <Image
                src={maquina.imgEmbalagem}
                alt="Embalagem"
                className="h-auto w-3/5 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="flex h-full w-full md:w-1/2">
          <Image
            src={maquina.imgMaquina}
            alt="Máquina"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      <div className="flex h-1/6 w-full justify-center">
        <div className="z-10">
          <SpecificationModal maquina={maquina} />
        </div>
      </div>
    </div>
  );
}

function ProducaoMaxima({
  maquina,
  className,
}: {
  maquina: (typeof maquinasData)[0];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border/30 flex flex-col items-center justify-center border-x border-b border-dashed bg-slate-900 px-5 py-2 md:border",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-muted text-xl font-semibold md:text-3xl">Até</h2>
        <NumberTicker
          value={maquina.unidadeMaxima || 0}
          startValue={Math.floor((maquina.unidadeMaxima || 0) * 0.5)}
          decimalPlaces={0}
          className="text-2xl font-bold md:text-4xl"
        />
      </div>
      <p className="text-muted text-xl font-light tracking-wide italic">
        Unidades/hora
      </p>
    </div>
  );
}
