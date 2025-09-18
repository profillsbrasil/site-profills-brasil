import { GridPattern } from "@/components/layout/gridPatternBg";
import Alimentacao from "./_components/alimentacao";
import DesenvolvimentoFuturo from "./_components/desenvolvimentoFuturo";
import Educacao from "./_components/educacao";
import Hero from "./_components/hero";
import ObjetivosODS from "./_components/objetivosODS";

export default function ProfillsSustentabilidade() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-16">
      <GridPattern />

      {/* Hero Section */}
      <Hero />

      {/* Alimentação Section */}
      <Alimentacao />

      {/* Educação Section */}
      <Educacao />

      {/* Desenvolvimento e Futuro Section */}
      <DesenvolvimentoFuturo />

      {/* Objetivos do Desenvolvimento Sustentável Section */}
      <ObjetivosODS />
    </div>
  );
}
