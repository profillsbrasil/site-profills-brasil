import { GridPattern } from "@/components/layout/gridPatternBg";
import CadeiaSuprimentos from "./_components/cadeiaSuprimentos";
import ExpansaoGlobal from "./_components/expansaoGlobal";
import Hero from "./_components/hero";
import SolucoesIntegradas from "./_components/solucoesIntegradas";

export default function ProfillsHub() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-16">
      <GridPattern />

      {/* Hero Section */}
      <Hero />
      {/* Global Expansion Section */}
      <ExpansaoGlobal />
      {/* Supply Chain Section */}
      <CadeiaSuprimentos />
      {/* Integrated Solutions Section */}
      <SolucoesIntegradas />
    </div>
  );
}
