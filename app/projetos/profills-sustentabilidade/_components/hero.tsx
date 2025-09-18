import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import imgSustentabilidade from "@/lib/images/projetos/Sustentabilidade.jpg";
import { GraduationCap, Heart, Leaf, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      aria-labelledby="titulo-profills-sustentabilidade"
      className="flex min-h-[93vh] w-full max-w-6xl flex-col items-center justify-evenly"
    >
      <AnimatedContainer className="w-full">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image
            src={imgSustentabilidade}
            alt="Profills Sustentabilidade - Compromisso com o Futuro"
            className="z-10 h-full w-full rounded-md object-contain shadow-xl"
            loading="eager"
          />
        </div>
      </AnimatedContainer>

      <div className="flex h-full w-full flex-col items-center gap-10">
        <Highlighter
          action="underline"
          color="#22c55e"
          animationDuration={4000}
          textColor="text-4xl font-bold"
        >
          <h1 id="titulo-profills-sustentabilidade">
            Profills Sustentabilidade
          </h1>
        </Highlighter>

        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          <p>
            Nossa missão é{" "}
            <span className="font-semibold text-green-600">
              entregar alimentação segura, nutritiva e suficiente
            </span>
            , em todos os lugares. Através da{" "}
            <span className="font-semibold text-green-600">
              educação e inovação
            </span>
            , construímos um futuro sustentável.
          </p>

          <p>
            Acreditamos que o{" "}
            <span className="font-semibold text-green-600">
              consumo consciente de alimentos
            </span>{" "}
            é a forma mais simples e eficaz para combater o desperdício,
            apresentando{" "}
            <span className="font-semibold text-green-600">
              soluções inovadoras
            </span>{" "}
            na parte de processamento e envase de alimentos.
          </p>
        </div>

        {/* Features Cards */}
        <AnimatedContainer className="w-full">
          <div className="grid w-full grid-cols-4 gap-5">
            <div className="group flex items-center gap-3 rounded-md border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Heart className="h-8 w-8 text-green-600 transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Alimentação Segura</h3>
                <p className="text-xs text-gray-600">Projeto Pocket</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <GraduationCap className="h-8 w-8 text-green-600 transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Educação</h3>
                <p className="text-xs text-gray-600">Profills School</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Leaf className="h-8 w-8 text-green-600 transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Sustentabilidade</h3>
                <p className="text-xs text-gray-600">Consumo consciente</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <TrendingUp className="h-8 w-8 text-green-600 transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Desenvolvimento</h3>
                <p className="text-xs text-gray-600">Futuro sustentável</p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
