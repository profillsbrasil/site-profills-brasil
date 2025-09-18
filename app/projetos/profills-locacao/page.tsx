import { GridPattern } from "@/components/layout/gridPatternBg";
import BeneficiosModelo from "./_components/beneficiosModelo";
import Hero from "./_components/hero";
import ServicoAssinatura from "./_components/servicoAssinatura";

export default function ProfillsLocacao() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-16">
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Service Section */}
      <ServicoAssinatura />
      {/* Benefits Section */}
      <BeneficiosModelo />
    </div>
  );
}
