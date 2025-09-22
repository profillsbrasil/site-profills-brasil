import imgFabricaCompleta from "@/lib/images/extras/FabricaCompleta.png";
import Image from "next/image";

export default function MonteSuaFabrica() {
  return (
    <div className="relative flex h-[90vh] min-h-[90vh] w-full items-center justify-center pt-10">
      <div className="h-full w-full">
        <Image
          src={imgFabricaCompleta}
          alt="Monte sua fábrica"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="absolute top-0 right-0 h-full w-1/4">
        <h1>Monte sua fábrica</h1>
      </div>
    </div>
  );
}
