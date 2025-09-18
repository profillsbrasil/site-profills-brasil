import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import imagePd from "@/lib/images/projetos/PeD.jpg";
import { Brain, Cpu, Factory, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      aria-labelledby="titulo-profills-pd"
      className="flex min-h-[93vh] w-full max-w-6xl flex-col items-center justify-evenly"
    >
      <AnimatedContainer className="w-full">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image
            src={imagePd}
            alt="Profills P&D - Pesquisa e Desenvolvimento"
            className="z-10 h-full w-full rounded-md object-contain shadow-xl"
            loading="eager"
          />
        </div>
      </AnimatedContainer>

      <div className="flex h-full w-full flex-col items-center gap-10">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-4xl font-bold"
        >
          <h1 id="titulo-profills-pd">Profills P&D</h1>
        </Highlighter>

        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          <p>
            Vive-se um momento em que as{" "}
            <span className="text-accent font-semibold">
              mudanças são rápidas e necessárias
            </span>{" "}
            em uma sociedade que almeja evoluir. Para acompanhar essa evolução,
            a maneira como administramos os{" "}
            <span className="text-accent font-semibold">
              projetos e pesquisas vêm mudando
            </span>
            .
          </p>

          <p>
            Sendo{" "}
            <span className="text-accent font-semibold">
              líder de mercado no segmento de Máquinas Envasadoras
            </span>
            , a Profills conta com uma{" "}
            <span className="text-accent font-semibold">
              equipe de P&D multifuncional
            </span>{" "}
            e que mantém diálogo constante com as outras áreas do negócio.
          </p>
        </div>

        {/* Features Cards */}
        <AnimatedContainer className="w-full">
          <div className="grid w-full grid-cols-4 gap-5">
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Brain className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">
                  Inteligência Artificial
                </h3>
                <p className="text-xs text-gray-600">IA aplicada</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Factory className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Indústria 4.0</h3>
                <p className="text-xs text-gray-600">Conectividade total</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Cpu className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Automação</h3>
                <p className="text-xs text-gray-600">Processos otimizados</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <TrendingUp className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Melhoria Contínua</h3>
                <p className="text-xs text-gray-600">Evolução constante</p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
