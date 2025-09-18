import Image from "next/image";
import { useState } from "react";
import { useInView } from "../hooks/useInView";
import { MaquinaData } from "./maquinasData";

interface MaquinaCardProps {
  maquina: MaquinaData;
}

export default function MaquinaCard({ maquina }: MaquinaCardProps) {
  // Padronização: todos os cards com mesmas dimensões externas
  // e mesma proporção de conteúdo/rodapé para evitar desalinhamentos

  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "250px" });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [pkgLoaded, setPkgLoaded] = useState(false);

  return (
    <div
      ref={ref}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "512px 512px",
      }}
      className={`border-border/20 group hover:border-accent/30 flex h-[28rem] w-full flex-col overflow-hidden rounded-xs border bg-slate-900 text-white md:h-[32rem]`}
    >
      <div className={`relative h-[86%] w-full px-2`}>
        {inView && (
          <>
            <Image
              src={maquina.imgMaquina}
              alt="Máquina"
              onLoadingComplete={() => setImgLoaded(true)}
              className={`${
                maquina.imgMaquinaClassName || "h-full w-full object-contain"
              } transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
            <Image
              src={maquina.imgEmbalagem}
              alt="Embalagem"
              onLoadingComplete={() => setPkgLoaded(true)}
              className={`${
                maquina.imgEmbalagemClassName ||
                "absolute right-3 bottom-0 h-1/2 w-1/2 object-cover"
              } transition-opacity duration-300 ${pkgLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        )}
      </div>
      <div
        className={`flex h-[14%] w-full flex-col items-center justify-center bg-slate-800`}
      >
        <h1 className="group-hover:text-accent text-base font-bold md:text-lg">
          {maquina.name}
        </h1>
        <p className="text-xs font-light md:text-sm">{maquina.descricao}</p>
      </div>
    </div>
  );
}
