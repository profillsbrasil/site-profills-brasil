import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Shield,
  UserCheck,
  Workflow,
} from "lucide-react";

export default function BeneficiosGestao() {
  return (
    <section
      aria-labelledby="titulo-beneficios"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-5 py-10"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-3xl font-bold"
        >
          <h2 id="titulo-beneficios">Boas Práticas Incorporadas</h2>
        </Highlighter>
        <p className="mx-auto mt-2 max-w-4xl text-lg text-gray-600">
          <span className="text-accent font-semibold">
            Boas práticas de negócios
          </span>{" "}
          serão incorporadas através do{" "}
          <span className="text-accent font-semibold">
            fluxo de trabalho fixado ao ERP
          </span>
          .
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid w-full grid-cols-2 gap-6 lg:grid-cols-3">
        <AnimatedContainer>
          <div className="group relative overflow-hidden rounded-md border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-blue-100 to-blue-200 opacity-50"></div>
            <div className="relative">
              <div className="mb-4 w-fit rounded-md bg-blue-100 p-3 transition-transform duration-300 group-hover:scale-110">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                Redução de Tempo
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Reduz o tempo necessário para{" "}
                <span className="text-accent font-semibold">
                  treinar adequadamente novos funcionários
                </span>
              </p>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="group relative overflow-hidden rounded-md border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-green-100 to-green-200 opacity-50"></div>
            <div className="relative">
              <div className="mb-4 w-fit rounded-md bg-green-100 p-3 transition-transform duration-300 group-hover:scale-110">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                Compliance
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Facilita o{" "}
                <span className="text-accent font-semibold">compliance</span> e
                traz{" "}
                <span className="text-accent font-semibold">
                  segurança aos clientes
                </span>
              </p>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="group relative overflow-hidden rounded-md border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-purple-100 to-purple-200 opacity-50"></div>
            <div className="relative">
              <div className="mb-4 w-fit rounded-md bg-purple-100 p-3 transition-transform duration-300 group-hover:scale-110">
                <Workflow className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                Fluxo Padronizado
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                <span className="text-accent font-semibold">
                  Fluxo de trabalho fixado
                </span>{" "}
                garante consistência nos processos
              </p>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="group relative overflow-hidden rounded-md border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-orange-100 to-orange-200 opacity-50"></div>
            <div className="relative">
              <div className="mb-4 w-fit rounded-md bg-orange-100 p-3 transition-transform duration-300 group-hover:scale-110">
                <UserCheck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                Treinamento Eficiente
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Interface intuitiva acelera a{" "}
                <span className="text-accent font-semibold">
                  capacitação da equipe
                </span>
              </p>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="group relative overflow-hidden rounded-md border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-red-100 to-red-200 opacity-50"></div>
            <div className="relative">
              <div className="mb-4 w-fit rounded-md bg-red-100 p-3 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                Menos Erros
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Automação reduz significativamente{" "}
                <span className="text-accent font-semibold">erros manuais</span>
              </p>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="group relative overflow-hidden rounded-md border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-indigo-100 to-indigo-200 opacity-50"></div>
            <div className="relative">
              <div className="mb-4 w-fit rounded-md bg-indigo-100 p-3 transition-transform duration-300 group-hover:scale-110">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                Boas Práticas
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Sistema incorpora{" "}
                <span className="text-accent font-semibold">
                  melhores práticas de mercado
                </span>
              </p>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Process Flow */}
      <AnimatedContainer className="w-full">
        <div className="p-8">
          <h3 className="mb-8 text-center text-2xl font-bold text-gray-800">
            Fluxo de Implementação
          </h3>
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-8 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#2d62ef] to-transparent"></div>

            <div className="relative grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#2d62ef] shadow-lg">
                  <span className="text-lg font-bold text-white">1</span>
                </div>
                <h4 className="mb-1 font-semibold text-gray-800">Análise</h4>
                <p className="text-xs text-gray-600">
                  Identificação de necessidades
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#2d62ef] shadow-lg">
                  <span className="text-lg font-bold text-white">2</span>
                </div>
                <h4 className="mb-1 font-semibold text-gray-800">
                  Configuração
                </h4>
                <p className="text-xs text-gray-600">
                  Personalização do sistema
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#2d62ef] shadow-lg">
                  <span className="text-lg font-bold text-white">3</span>
                </div>
                <h4 className="mb-1 font-semibold text-gray-800">
                  Treinamento
                </h4>
                <p className="text-xs text-gray-600">Capacitação da equipe</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#2d62ef] shadow-lg">
                  <span className="text-lg font-bold text-white">4</span>
                </div>
                <h4 className="mb-1 font-semibold text-gray-800">Go-Live</h4>
                <p className="text-xs text-gray-600">Início das operações</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </section>
  );
}
