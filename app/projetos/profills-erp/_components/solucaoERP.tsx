import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import {
  Database,
  FileText,
  Shield,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";

export default function SolucaoERP() {
  return (
    <section
      aria-labelledby="titulo-solucao"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-12 py-10"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-3xl font-bold"
        >
          <h2 id="titulo-solucao">Solução ERP Completa</h2>
        </Highlighter>
        <p className="mx-auto mt-4 max-w-4xl text-lg text-gray-600">
          A solução inclui{" "}
          <span className="text-accent font-semibold">
            relatórios fáceis de compreender e gerar
          </span>
          , que ajudam na tomada de{" "}
          <span className="text-accent font-semibold">
            decisões estratégicas
          </span>
          .
        </p>
      </div>

      {/* Dashboard Mockup */}
      <AnimatedContainer className="w-full">
        <div className="rounded-md border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="font-semibold text-white">
              Profills ERP Dashboard
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="rounded-md border border-gray-700 bg-gray-800 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">
                    Relatórios
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-gray-700"></div>
                  <div className="h-2 w-4/5 rounded-full bg-gray-700"></div>
                  <div className="h-2 w-3/5 rounded-full bg-gray-700"></div>
                </div>
              </div>

              <div className="rounded-md border border-gray-700 bg-gray-800 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Database className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-white">
                    Estoque
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-4/5 rounded-full bg-green-600"></div>
                  <div className="h-2 w-2/5 rounded-full bg-yellow-500"></div>
                  <div className="h-2 w-1/5 rounded-full bg-red-500"></div>
                </div>
              </div>
            </div>

            {/* Center Column */}
            <div className="space-y-4">
              <div className="rounded-md border border-gray-700 bg-gray-800 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium text-white">
                    Analytics
                  </span>
                </div>
                <div className="flex h-20 items-end justify-around rounded bg-gray-700 p-2">
                  <div className="h-8 w-3 rounded-t bg-[#2d62ef]"></div>
                  <div className="h-12 w-3 rounded-t bg-[#2d62ef]"></div>
                  <div className="h-6 w-3 rounded-t bg-[#2d62ef]"></div>
                  <div className="h-16 w-3 rounded-t bg-[#2d62ef]"></div>
                  <div className="h-10 w-3 rounded-t bg-[#2d62ef]"></div>
                </div>
              </div>

              <div className="rounded-md border border-gray-700 bg-gray-800 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Workflow className="h-5 w-5 text-orange-400" />
                  <span className="text-sm font-medium text-white">
                    Fluxo de Trabalho
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                  <div className="mx-2 h-0.5 flex-1 bg-gray-600"></div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2d62ef]">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                  <div className="mx-2 h-0.5 flex-1 bg-gray-600"></div>
                  <div className="h-8 w-8 rounded-full bg-gray-600"></div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="rounded-md border border-gray-700 bg-gray-800 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-medium text-white">
                    Automação
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-300">Notas Fiscais</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-300">
                      Controle Contábil
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-xs text-gray-300">Lead Time</span>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-gray-700 bg-gray-800 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-indigo-400" />
                  <span className="text-sm font-medium text-white">
                    Compliance
                  </span>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-green-400">
                    Seguro & Confiável
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Core Benefits */}
      <div className="grid w-full grid-cols-2 gap-8">
        <AnimatedContainer>
          <div className="h-full rounded-md border border-gray-100 bg-white p-6 shadow-lg backdrop-blur-xs">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Melhor Fluxo de Informações
            </h3>
            <p className="mb-4 leading-relaxed text-gray-700">
              Reduzindo a necessidade de{" "}
              <span className="text-accent font-semibold">
                interface manual
              </span>
              , as empresas contarão com{" "}
              <span className="text-accent font-semibold">
                informações mais confiáveis
              </span>{" "}
              e uma{" "}
              <span className="text-accent font-semibold">
                carga de trabalho mais inteligente
              </span>
              .
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
                <span className="text-sm text-gray-600">
                  Eliminação de redundâncias
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
                <span className="text-sm text-gray-600">
                  Automatização de tarefas repetitivas
                </span>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="h-full rounded-md border border-[#2d62ef]/20 bg-gradient-to-br from-[#2d62ef]/10 to-blue-100 p-6">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Gestão de Custos Inteligente
            </h3>
            <p className="mb-4 leading-relaxed text-gray-700">
              A gestão de custos será beneficiada por meio de um{" "}
              <span className="text-accent font-semibold">
                melhor controle de estoque
              </span>{" "}
              e redução de incertezas com relação ao{" "}
              <span className="text-accent font-semibold">
                prazo de entrega (lead time)
              </span>
              .
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
                <span className="text-sm text-gray-600">
                  Controle de estoque otimizado
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
                <span className="text-sm text-gray-600">
                  Previsibilidade de entregas
                </span>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
