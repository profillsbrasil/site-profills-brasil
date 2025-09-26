import { Highlighter } from "@/components/magicui/highlighter";
import { Button } from "@/components/ui/button";
import corteLaser from "@/lib/images/extras/cortador.jpg";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ServicosPersonalizados() {
  return (
    <div className="flex w-full items-center justify-center px-4 pb-10">
      <div className="flex h-full w-full max-w-6xl flex-col gap-5 md:flex-row md:gap-5">
        <div className="flex h-64 w-full md:h-full md:w-1/2">
          <Image
            src={corteLaser}
            alt="Corte Laser"
            className="z-10 h-full w-full rounded-xs object-cover md:object-contain"
          />
        </div>
        <div className="flex min-h-full w-full flex-col items-center justify-between gap-6 md:w-1/2 md:gap-0">
          <div className="flex flex-col items-center justify-center md:h-5/6">
            <Highlighter
              action="underline"
              color="#2d62ef"
              animationDuration={4000}
              textColor="text-2xl font-bold mb-4 text-center md:text-3xl md:mb-5"
            >
              Serviços Personalizados
            </Highlighter>
            <div className="text-muted-foreground bg-background z-10 flex flex-col rounded-xs border border-dashed border-black/30 p-4 text-sm shadow-xl shadow-black/10 md:p-5 md:text-base">
              <p className="mb-3">
                Além das máquinas envasadoras, oferecemos{" "}
                <span className="text-accent font-bold">corte a laser</span> e{" "}
                <span className="text-accent font-bold">dobra em aço inox</span>
                .
              </p>
              <p>
                Unindo tecnologia de ponta e experiência em metalurgia,
                atendemos desde peças sob medida até projetos especiais, sempre
                com precisão e qualidade. Na Profills, inovação e excelência
                caminham juntas para transformar suas ideias em realidade.
              </p>
            </div>
          </div>
          <Link
            href="/servicos-personalizados"
            className="z-10 flex w-full items-end justify-center md:h-1/6"
          >
            <Button
              variant="outline"
              size="lg"
              className="group border-border !bg-background hover:border-accent/30 hover:bg-accent/10 hover:text-accent z-10 w-full rounded-xs border font-semibold shadow-md transition-all duration-300 hover:scale-[1.02] md:w-2/3"
            >
              Envie sua solicitação
              <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
