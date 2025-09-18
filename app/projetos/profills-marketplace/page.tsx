import { GridPattern } from "@/components/layout/gridPatternBg";
import Hero from "./_components/hero";
import ProblemaDigital from "./_components/problemaDigital";
import SolucaoMarketplace from "./_components/solucaoMarketplace";

export default function ProfillsMarketplace() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-16">
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Problem Section */}
      <ProblemaDigital />
      {/* Solution Section */}
      <SolucaoMarketplace />
    </div>
  );
}
