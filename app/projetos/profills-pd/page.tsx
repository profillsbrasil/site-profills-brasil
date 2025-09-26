import { GridPattern } from "@/components/layout/gridPatternBg";
import Hero from "./_components/hero";
import PesquisaDesenvolvimento from "./_components/pesquisaDesenvolvimento";
import TecnologiaFavor from "./_components/tecnologiaFavor";

export default function ProfillsPD() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:py-16">
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Research & Development Section */}
      <PesquisaDesenvolvimento />
      {/* Technology Section */}
      <TecnologiaFavor />
    </div>
  );
}
