import { GridPattern } from "@/components/layout/gridPatternBg";
import CardFaq from "./_components/cardFaq";
import CardsPerfil from "./_components/cardsPerfil";
import MarqueeClientes from "./_components/marqueeClientes";
import ProfillHistoria from "./_components/profillHistoria";
import ProfillFabrica from "./_components/profillfabrica";
export default function Sobre() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:py-10">
      <GridPattern />
      <div className="flex min-h-screen w-full flex-col items-center justify-center md:h-screen">
        <MarqueeClientes />
        <CardsPerfil />
      </div>
      <ProfillHistoria />
      <ProfillFabrica />
      <CardFaq />
    </div>
  );
}
