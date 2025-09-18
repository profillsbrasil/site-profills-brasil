import { GridPattern } from "@/components/layout/gridPatternBg";
import CardFaq from "./_components/cardFaq";
import CardsPerfil from "./_components/cardsPerfil";
import MarqueeClientes from "./_components/marqueeClientes";
import ProfillHistoria from "./_components/profillHistoria";
import ProfillFabrica from "./_components/profillfabrica";
export default function Sobre() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-10">
      <GridPattern />
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <MarqueeClientes />
        <CardsPerfil />
      </div>
      <ProfillHistoria />
      <ProfillFabrica />
      <CardFaq />
    </div>
  );
}
