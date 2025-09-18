import { AnimatedContainer } from "@/components/AnimatedContainer";
import {
  AlertTriangle,
  BarChart3,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

export default function ImpactoEducacao() {
  return (
    <section className="w-full max-w-6xl py-10">
      <AnimatedContainer>
        <div className="grid w-full gap-12 lg:grid-cols-2">
          {/* Left Content - Problem & Context */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              O Cenário do{" "}
              <span className="text-red-600">Mercado de Trabalho</span>
            </h2>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-gray-700">
                O Brasil enfrenta um desafio significativo: conseguirá{" "}
                <span className="font-semibold text-red-600">
                  impactar positivamente o mercado de trabalho brasileiro
                </span>{" "}
                que, com a pandemia, lida com cerca de{" "}
                <span className="font-semibold text-red-600">
                  14 milhões de desempregados
                </span>
                , podendo chegar a 20 milhões.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                A pandemia fez com que os{" "}
                <span className="font-semibold text-[#2d62ef]">
                  métodos de ensino à distância e os infoprodutos
                </span>{" "}
                se tornassem uma vertente consolidada na forma de aprendizado.
              </p>
            </div>

            {/* Statistics */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-md bg-red-50 p-4 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-red-600" />
                <div className="text-2xl font-bold text-red-600">14-20M</div>
                <div className="text-sm text-gray-600">
                  Desempregados no Brasil
                </div>
              </div>
              <div className="rounded-md bg-blue-50 p-4 text-center">
                <Search className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">73%</div>
                <div className="text-sm text-gray-600">
                  Aumento nas buscas por cursos online
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Educational Impact */}
          <div className="grid gap-4 sm:grid-cols-1">
            <div className="rounded-md border border-blue-500/30 bg-blue-50 p-6">
              <div className="flex items-start space-x-4">
                <TrendingUp className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    Mercado Promissor
                  </h3>
                  <p className="mt-2 text-blue-700">
                    Educação online se tornou um dos mercados mais promissores
                    no cenário brasileiro
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-green-500/30 bg-green-50 p-6">
              <div className="flex items-start space-x-4">
                <BarChart3 className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Oportunidade de Capacitação
                  </h3>
                  <p className="mt-2 text-green-700">
                    Formação de mais profissionais qualificados para o mercado
                    de trabalho e sociedade
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-purple-500/30 bg-purple-50 p-6">
              <div className="flex items-start space-x-4">
                <Users className="mt-1 h-6 w-6 flex-shrink-0 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-purple-800">
                    Democratização do Conhecimento
                  </h3>
                  <p className="mt-2 text-purple-700">
                    Acesso facilitado e prático às informações úteis e
                    necessárias para o crescimento profissional
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-orange-500/30 bg-orange-50 p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-orange-600" />
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">
                    Transformação Necessária
                  </h3>
                  <p className="mt-2 text-orange-700">
                    Métodos de ensino à distância como solução consolidada para
                    capacitação em massa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </section>
  );
}
