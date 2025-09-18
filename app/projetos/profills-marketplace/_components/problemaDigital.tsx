import { AnimatedContainer } from "@/components/AnimatedContainer";
import {
  AlertTriangle,
  BarChart3,
  MapPin,
  TrendingDown,
  Users,
  Wifi,
} from "lucide-react";

export default function ProblemaDigital() {
  return (
    <section className="h-full w-full max-w-6xl pt-16 pb-10">
      <AnimatedContainer>
        <div className="grid h-full w-full gap-12 lg:grid-cols-2">
          {/* Left Content - Problem Description */}
          <div className="flex h-full flex-col justify-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              O Desafio das{" "}
              <span className="text-red-600">Empresas de Pequeno Porte</span>
            </h2>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-gray-700">
                Empresas de pequeno porte e produtores que vivem na{" "}
                <span className="font-semibold text-red-600">
                  informalidade sofrem
                </span>{" "}
                com a dificuldade de impulsionar seus negócios devido à{" "}
                <span className="font-semibold text-red-600">
                  falta de presença no mercado online
                </span>
                .
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                Isso os limita a conexões com{" "}
                <span className="font-semibold">clientes próximos</span>,
                causando insegurança nas vendas e gerando{" "}
                <span className="font-semibold text-red-600">
                  obstáculos para a expansão
                </span>
                .
              </p>
            </div>

            {/* Statistics */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-md bg-red-50 p-4 text-center">
                <BarChart3 className="mx-auto mb-2 h-8 w-8 text-red-600" />
                <div className="text-2xl font-bold text-red-600">95%</div>
                <div className="text-sm text-gray-600">
                  Compras online via marketplace (2019)
                </div>
              </div>
              <div className="rounded-md bg-blue-50 p-4 text-center">
                <Wifi className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">46%</div>
                <div className="text-sm text-gray-600">
                  Vendas pelo celular (2020)
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Problem Points */}
          <div className="grid gap-4 sm:grid-cols-1">
            <div className="rounded-md border border-red-500/30 bg-red-50 p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    Falta de Presença Online
                  </h3>
                  <p className="mt-2 text-red-700">
                    Ausência no mercado digital impede o crescimento e limita
                    oportunidades
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-orange-500/30 bg-orange-50 p-6">
              <div className="flex items-start space-x-4">
                <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-orange-600" />
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">
                    Conexões Limitadas
                  </h3>
                  <p className="mt-2 text-orange-700">
                    Relacionamento restrito apenas a clientes próximos
                    geograficamente
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-yellow-500/30 bg-yellow-50 p-6">
              <div className="flex items-start space-x-4">
                <TrendingDown className="mt-1 h-6 w-6 flex-shrink-0 text-yellow-600" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Insegurança nas Vendas
                  </h3>
                  <p className="mt-2 text-yellow-700">
                    Falta de ferramentas digitais gera incerteza nos processos
                    comerciais
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-red-500/30 bg-red-50 p-6">
              <div className="flex items-start space-x-4">
                <Users className="mt-1 h-6 w-6 flex-shrink-0 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    Obstáculos à Expansão
                  </h3>
                  <p className="mt-2 text-red-700">
                    Barreiras tecnológicas impedem o crescimento sustentável do
                    negócio
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
