import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import imgErp from "@/lib/images/projetos/ERP.jpg";
import { AlertTriangle, BarChart3, Cloud, Users } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      aria-labelledby="titulo-profills-erp"
      className="flex min-h-[70vh] w-full max-w-6xl flex-col items-center justify-evenly gap-6 md:min-h-[93vh] md:gap-0"
    >
      <div className="flex h-full w-full flex-col items-center justify-center pt-5 md:pt-0">
        <Image
          src={imgErp}
          loading="eager"
          alt="Profills ERP - Gestão Integrada em Nuvem"
          className="z-10 h-full w-full rounded-xs object-contain shadow-xl"
        />
      </div>
      <div className="flex h-full w-full flex-col items-center gap-6 md:gap-10">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-2xl font-bold md:text-4xl"
        >
          <h1 id="titulo-profills-erp">Profills ERP</h1>
        </Highlighter>

        <div className="flex flex-col gap-4 text-sm leading-relaxed md:text-lg">
          <p>
            As pequenas empresas no Brasil{" "}
            <span className="text-accent font-semibold">
              carecem de inclusão digital
            </span>
            , com um grande número de produtores dependendo de terceiros para
            atividades básicas, como a{" "}
            <span className="text-accent font-semibold">
              emissão de notas fiscais
            </span>
            .
          </p>

          <p>
            A Profills fornecerá uma{" "}
            <span className="text-accent font-semibold">
              solução abrangente e acessível
            </span>
            , permitindo que os negócios sejam executados{" "}
            <span className="text-accent font-semibold">sem esforço</span>: o{" "}
            <span className="text-accent font-semibold">Profills ERP</span>.
          </p>
        </div>

        {/* Features Cards */}
        <AnimatedContainer className="w-full">
          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            <div className="group flex items-center gap-3 rounded-xs border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <BarChart3 className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">
                  Relatórios Inteligentes
                </h3>
                <p className="text-xs text-gray-600">Fáceis de gerar</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-xs border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Cloud className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Baseado em Nuvem</h3>
                <p className="text-xs text-gray-600">Mobilidade total</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-xs border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Users className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Integração Total</h3>
                <p className="text-xs text-gray-600">Gestão unificada</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-xs border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <AlertTriangle className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Menos Erros</h3>
                <p className="text-xs text-gray-600">Automação segura</p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
