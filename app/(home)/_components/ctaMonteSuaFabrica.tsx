import { GridPattern } from "@/components/layout/gridPatternBg";
import { Highlighter } from "@/components/magicui/highlighter";
import { Button } from "@/components/ui/button";
import CollabBro from "@/lib/images/extras/Collab-bro.png";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CtaMonteSuaFabrica() {
  return (
    <div className="flex w-full items-center justify-center py-10">
      <div className="relative flex h-full min-h-96 w-full max-w-6xl flex-col items-center justify-center gap-5 rounded-sm bg-slate-900">
        <GridPattern />
        <Image
          src={CollabBro}
          alt="Monte sua fábrica"
          className="absolute inset-0 top-0 left-5 h-full w-fit -rotate-20 object-contain opacity-20"
        />
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="z-10 text-3xl font-bold tracking-wider text-white uppercase"
        >
          Monte sua fábrica
        </Highlighter>
        <p className="z-10 w-full max-w-2xl text-center text-base text-white">
          Personalize nossas soluções para atender às necessidades específicas
          da sua empresa, garantindo o máximo desempenho e eficiência em cada
          etapa do processo.
        </p>
        <Link
          className="cursor-pointer"
          href="/servicos-personalizados#entre-em-contato"
        >
          <Button
            size="lg"
            className="group border-border !bg-background hover:border-accent/30 group hover:bg-accent hover:text-accent z-10 rounded-sm border font-semibold text-black shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            Ver catálogo completo
            <ArrowRight className="group-hover:text-accent ml-2 h-6 w-6 text-black transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
