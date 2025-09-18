import { AnimatedContainer } from "@/components/AnimatedContainer";
import { GridPattern } from "@/components/layout/gridPatternBg";
import { Highlighter } from "@/components/magicui/highlighter";
import {
  BarChart3,
  Brain,
  Factory,
  Settings,
  Target,
  Wrench,
} from "lucide-react";

export default function SolucoesIntegradas() {
  return (
    <section
      aria-labelledby="titulo-solucoes"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-16 py-10"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-3xl font-bold"
        >
          <h2 id="titulo-solucoes">Soluções Integradas</h2>
        </Highlighter>
        <p className="mx-auto mt-4 max-w-4xl text-lg text-gray-600">
          Nossa equipe de engenharia está preparada para{" "}
          <span className="text-accent font-semibold">projetar fábricas</span>,
          fornecendo{" "}
          <span className="text-accent font-semibold">
            soluções completas em processamento de alimentos
          </span>
          .
        </p>
      </div>

      {/* Three Pillars */}
      <div className="flex w-full gap-8">
        <AnimatedContainer>
          <div className="h-full rounded-md border border-gray-100 bg-white p-8 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <div className="mx-auto mb-6 w-fit rounded-full bg-blue-100 p-4">
              <Factory className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Engenharia de Fábricas
            </h3>
            <p className="mb-6 leading-relaxed text-gray-700">
              Nossa equipe de engenharia está preparada para{" "}
              <span className="text-accent font-semibold">
                projetar fábricas
              </span>
              , fornecendo soluções completas em{" "}
              <span className="text-accent font-semibold">
                processamento de alimentos
              </span>
              .
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  Design de layout industrial
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  Equipamentos especializados
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  Otimização de processos
                </span>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="h-full rounded-md border border-[#2d62ef]/20 bg-gradient-to-br from-[#2d62ef]/10 to-blue-100 p-8 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <div className="mx-auto mb-6 w-fit rounded-full bg-[#2d62ef]/20 p-4">
              <Brain className="h-12 w-12 text-[#2d62ef]" />
            </div>
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Know-how Especializado
            </h3>
            <p className="mb-6 leading-relaxed text-gray-700">
              Fornecemos{" "}
              <span className="text-accent font-semibold">
                acesso ao conhecimento adquirido
              </span>{" "}
              ao longo de nossa jornada, juntamente com o{" "}
              <span className="text-accent font-semibold">
                know-how necessário
              </span>{" "}
              para fazer tudo funcionar.
            </p>
            <div className="rounded-md bg-white/80 p-4 text-left">
              <h4 className="mb-2 text-center font-semibold text-gray-800">
                Áreas de Especialização
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 marker:text-[#2d62ef]">
                <li> Processamento de alimentos</li>
                <li> Soluções de embalagem</li>
                <li> Controle de qualidade</li>
                <li> Segurança alimentar</li>
              </ul>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="h-full rounded-md border border-gray-100 bg-white p-8 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <div className="mx-auto mb-6 w-fit rounded-full bg-green-100 p-4">
              <BarChart3 className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Inteligência de Mercado
            </h3>
            <p className="mb-6 leading-relaxed text-gray-700">
              Além de acompanhar de perto os{" "}
              <span className="text-accent font-semibold">
                mercados brasileiros
              </span>
              , entregamos{" "}
              <span className="text-accent font-semibold">
                inteligência para facilitar as decisões estratégicas
              </span>{" "}
              em toda a nossa rede.
            </p>
            <div className="flex flex-col gap-3 text-left">
              <div className="rounded-md bg-gray-50 p-3">
                <h5 className="mb-1 text-xs font-semibold text-gray-800">
                  Análise de Mercado
                </h5>
                <p className="text-xs text-gray-600">
                  Tendências e oportunidades
                </p>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <h5 className="mb-1 text-xs font-semibold text-gray-800">
                  Decisões Estratégicas
                </h5>
                <p className="text-xs text-gray-600">Dados para crescimento</p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Connected Solutions */}
      <AnimatedContainer className="w-full">
        <div className="relative overflow-hidden rounded-md bg-slate-900 p-10 text-white">
          <GridPattern />
          <div className="relative text-center">
            <h3 className="mb-4 text-3xl font-bold">Soluções Interligadas</h3>
            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed">
              Confira as{" "}
              <span className="font-semibold text-[#2d62ef]">
                soluções interligadas
              </span>{" "}
              com as{" "}
              <span className="font-bold text-yellow-300">
                Máquinas Profills
              </span>
              .
            </p>

            {/* Integration Icons */}
            <div className="mt-8 flex items-center justify-center gap-10">
              <div className="text-center">
                <div className="mx-auto mb-2 w-fit rounded-full bg-white/20 p-3">
                  <Factory className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm">Fábricas</span>
              </div>

              <div className="text-2xl text-[#2d62ef]">⟷</div>

              <div className="text-center">
                <div className="mx-auto mb-2 w-fit rounded-full bg-white/20 p-3">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm">Máquinas</span>
              </div>

              <div className="text-2xl text-[#2d62ef]">⟷</div>

              <div className="text-center">
                <div className="mx-auto mb-2 w-fit rounded-full bg-white/20 p-3">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm">Know-how</span>
              </div>

              <div className="text-2xl text-[#2d62ef]">⟷</div>

              <div className="text-center">
                <div className="mx-auto mb-2 w-fit rounded-full bg-white/20 p-3">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm">Inteligência</span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </section>
  );
}
