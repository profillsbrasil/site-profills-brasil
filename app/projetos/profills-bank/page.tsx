import { GridPattern } from "@/components/layout/gridPatternBg";
import Hero from "./_components/hero";
import Instituicao from "./_components/instituicao";
import TecnologiaDbaas from "./_components/tecnologiaDbaas";

export default function ProfillsBank() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-16">
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Technology Section */}
      <TecnologiaDbaas />
      {/* Regulation & Impact Section */}
      <Instituicao />
    </div>
  );
}
