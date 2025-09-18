import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import imgHub from "@/lib/images/projetos/HUB.jpg";
import { Building2, Globe, MapPin, Zap } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      aria-labelledby="titulo-profills-hub"
      className="flex min-h-[93vh] w-full max-w-6xl flex-col items-center justify-evenly"
    >
      <AnimatedContainer className="w-full">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image
            src={imgHub}
            alt="Profills Hub - Expansão Global e Marketplace"
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
          <h1 id="titulo-profills-hub">Profills Hub</h1>
        </Highlighter>

        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          <p>
            À medida que nossas{" "}
            <span className="text-accent font-semibold">
              operações e relacionamentos construídos nos últimos sete anos
            </span>{" "}
            se consolidam, olhamos além das fronteiras brasileiras e começamos a
            focar no{" "}
            <span className="text-accent font-semibold">
              mercado internacional
            </span>
            .
          </p>

          <p>
            Já contamos com uma{" "}
            <span className="text-accent font-semibold">
              estrutura em todo o Brasil
            </span>
            , com filiais espalhadas pelo país, e{" "}
            <span className="text-accent font-semibold">
              preparamos filiais internacionalmente
            </span>{" "}
            na Colômbia, República Dominicana, Estados Unidos e Emirados Árabes
            Unidos.
          </p>
        </div>

        {/* Features Cards */}
        <AnimatedContainer className="w-full">
          <div className="grid w-full grid-cols-4 gap-5">
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Globe className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Expansão Global</h3>
                <p className="text-xs text-gray-600">Presença mundial</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <MapPin className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Rede de Filiais</h3>
                <p className="text-xs text-gray-600">Brasil + Internacional</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Building2 className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Cadeia Suprimentos</h3>
                <p className="text-xs text-gray-600">Conexão de mercados</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Zap className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Soluções Completas</h3>
                <p className="text-xs text-gray-600">
                  Processamento + Engenharia
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
