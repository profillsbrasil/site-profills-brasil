import { GridPattern } from "@/components/layout/gridPatternBg";
import BeneficiosSociedade from "./_components/beneficiosSociedade";
import Hero from "./_components/hero";
import ImpactoEducacao from "./_components/impactoEducacao";
import MetodologiasEnsino from "./_components/metodologiasEnsino";

export default function ProfillsSchool() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-16">
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Education Impact Section */}
      <ImpactoEducacao />
      {/* Teaching Methodologies Section */}
      <MetodologiasEnsino />
      {/* Social Benefits Section */}
      <BeneficiosSociedade />
    </div>
  );
}
