import { Highlighter } from "@/components/magicui/highlighter";
import { Button } from "@/components/ui/button";
import corteLaser from "@/lib/images/extras/cortador.jpg";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CorteLaser() {
  return (
    <div className="flex w-full items-center justify-center pb-10">
      <div className="flex h-full w-full max-w-6xl gap-5">
        <div className="flex h-full w-1/2">
          <Image
            src={corteLaser}
            alt="Corte Laser"
            className="z-10 h-full w-full rounded-sm object-contain"
          />
        </div>
        <div className="flex min-h-full w-1/2 flex-col items-center justify-between">
          <div className="flex h-5/6 flex-col items-center justify-center">
            <Highlighter
              action="underline"
              color="#2d62ef"
              animationDuration={4000}
              textColor="text-3xl font-bold mb-5"
            >
              Serviços Personalizados
            </Highlighter>
            <div className="text-muted-foreground flex flex-col rounded-sm border border-dashed border-black/30 p-5 text-base">
              <p>
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
            className="z-10 flex h-1/6 w-full items-end justify-center"
          >
            <Button
              variant="outline"
              size="lg"
              className="group border-border !bg-background hover:border-accent/30 hover:bg-accent/10 hover:text-accent z-10 w-2/3 rounded-sm border font-semibold shadow-md transition-all duration-300 hover:scale-[1.02]"
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
