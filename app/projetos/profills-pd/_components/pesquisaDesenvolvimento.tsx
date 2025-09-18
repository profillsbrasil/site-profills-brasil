import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import { Brain, Lightbulb, Target, Users } from "lucide-react";

export default function PesquisaDesenvolvimento() {
  return (
    <section
      aria-labelledby="titulo-pesquisa"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-12 py-20"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-4xl font-bold"
        >
          <h2 id="titulo-pesquisa">Pesquisa & Desenvolvimento</h2>
        </Highlighter>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
          Diversas práticas vêm sendo adotadas a fim de{" "}
          <span className="text-accent font-semibold">
            melhorar os processos, projetos e desenvolvimento dos equipamentos
          </span>
          .
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid w-full grid-cols-2 gap-8">
        <AnimatedContainer>
          <div className="h-full rounded-md border border-gray-100 bg-white p-8 shadow-lg backdrop-blur-xs">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-[#2d62ef]/10 p-3">
                <Brain className="h-8 w-8 text-[#2d62ef]" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Inteligência Aplicada
              </h3>
            </div>
            <p className="leading-relaxed text-gray-700">
              Todos os nossos serviços em pesquisas{" "}
              <span className="text-accent font-semibold">
                vão além da automação
              </span>
              , eles tendem a aproveitar o máximo da capacidade da{" "}
              <span className="text-accent font-semibold">
                inteligência artificial – IA
              </span>
              , unindo a{" "}
              <span className="text-accent font-semibold">
                conectividade, indústria 4.0, inteligência analítica da web
              </span>{" "}
              e muito mais.
            </p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="h-full rounded-md border border-[#2d62ef]/20 bg-gradient-to-br from-[#2d62ef]/10 to-blue-100 p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-white/20 p-3">
                <Target className="h-8 w-8 text-[#2d62ef]" />
              </div>
              <h3 className="text-2xl font-semibold">Nossos Objetivos</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
                <span>Mais vida útil aos equipamentos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
                <span>Menos falhas operacionais</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
                <span>Menor tempo de parada</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
                <span>Análise preditiva avançada</span>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Bottom Cards */}
      <div className="grid w-full grid-cols-4 gap-6">
        <AnimatedContainer>
          <div className="rounded-md border border-gray-100 bg-white p-6 text-center shadow-md backdrop-blur-xs transition-all duration-300 hover:shadow-lg">
            <div className="mx-auto mb-4 w-fit rounded-full bg-[#2d62ef]/10 p-3">
              <Users className="h-8 w-8 text-[#2d62ef]" />
            </div>
            <h4 className="mb-2 font-semibold text-gray-800">
              Equipe Multifuncional
            </h4>
            <p className="text-sm text-gray-600">Especializada e integrada</p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="rounded-md border border-gray-100 bg-white p-6 text-center shadow-md backdrop-blur-xs transition-all duration-300 hover:shadow-lg">
            <div className="mx-auto mb-4 w-fit rounded-full bg-[#2d62ef]/10 p-3">
              <Lightbulb className="h-8 w-8 text-[#2d62ef]" />
            </div>
            <h4 className="mb-2 font-semibold text-gray-800">
              Inovação Constante
            </h4>
            <p className="text-sm text-gray-600">Pesquisa e desenvolvimento</p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="rounded-md border border-gray-100 bg-white p-6 text-center shadow-md backdrop-blur-xs transition-all duration-300 hover:shadow-lg">
            <div className="mx-auto mb-4 w-fit rounded-full bg-[#2d62ef]/10 p-3">
              <Brain className="h-8 w-8 text-[#2d62ef]" />
            </div>
            <h4 className="mb-2 font-semibold text-gray-800">IA Aplicada</h4>
            <p className="text-sm text-gray-600">Inteligência artificial</p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="rounded-md border border-gray-100 bg-white p-6 text-center shadow-md backdrop-blur-xs transition-all duration-300 hover:shadow-lg">
            <div className="mx-auto mb-4 w-fit rounded-full bg-[#2d62ef]/10 p-3">
              <Target className="h-8 w-8 text-[#2d62ef]" />
            </div>
            <h4 className="mb-2 font-semibold text-gray-800">
              Diálogo Entre Áreas
            </h4>
            <p className="text-sm text-gray-600">Comunicação eficiente</p>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
