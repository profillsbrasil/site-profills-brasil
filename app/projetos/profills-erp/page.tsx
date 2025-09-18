import { GridPattern } from "@/components/layout/gridPatternBg";
import BeneficiosGestao from "./_components/beneficiosGestao";
import CloudMobilidade from "./_components/cloudMobilidade";
import Hero from "./_components/hero";
import SolucaoERP from "./_components/solucaoERP";

export default function ProfillsERP() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-16">
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* ERP Solution Section */}
      <SolucaoERP />
      {/* Benefits & Management Section */}
      <BeneficiosGestao />
      {/* Cloud & Mobility Section */}
      <CloudMobilidade />
    </div>
  );
}
