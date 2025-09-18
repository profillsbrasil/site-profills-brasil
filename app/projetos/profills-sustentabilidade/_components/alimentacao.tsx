import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import { Package, Shield, Target, Users } from "lucide-react";

export default function Alimentacao() {
  return (
    <section
      aria-labelledby="titulo-alimentacao"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-8 py-16"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#f59e0b"
          animationDuration={4000}
          textColor="text-3xl font-bold"
        >
          <h2 id="titulo-alimentacao">Alimentação Consciente</h2>
        </Highlighter>
        <p className="mx-auto mt-4 max-w-4xl text-lg text-gray-600">
          Nosso comprometimento com o mundo é{" "}
          <span className="font-semibold text-orange-500">
            entregar alimentação segura, nutritiva e suficiente
          </span>
          , em todos os lugares.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-12">
        {/* Problema */}
        <AnimatedContainer>
          <div className="rounded-md border border-red-200 bg-gradient-to-br from-red-50 to-pink-100 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-red-500 p-3">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                O Desafio do Desperdício
              </h3>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              O{" "}
              <span className="font-semibold text-red-600">
                desperdício de alimentos
              </span>{" "}
              é resultado direto do manejo indevido dos alimentos em toda a
              cadeia produtiva. Por isso, acreditamos que o{" "}
              <span className="font-semibold text-red-600">
                consumo consciente
              </span>{" "}
              é a forma mais simples e eficaz para combater esse problema.
            </p>

            <div className="space-y-4">
              <div className="rounded-md border border-red-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Manejo Inadequado
                </h4>
                <p className="text-sm text-gray-600">
                  Perdas ao longo da cadeia produtiva
                </p>
              </div>
              <div className="rounded-md border border-red-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Porções Incorretas
                </h4>
                <p className="text-sm text-gray-600">
                  Falta de fracionamento adequado
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Solução */}
        <AnimatedContainer>
          <div className="rounded-md border border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-100 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-orange-500 p-3">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Projeto &quot;Pocket&quot;
              </h3>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              Uma{" "}
              <span className="font-semibold text-orange-600">
                cesta básica compacta
              </span>
              , com os principais ingredientes para uma alimentação saudável e
              nutritiva, em uma{" "}
              <span className="font-semibold text-orange-600">
                porção na medida certa
              </span>{" "}
              e de valor acessível.
            </p>

            <div className="space-y-4">
              <div className="rounded-md border border-orange-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">Porção Correta</h4>
                <p className="text-sm text-gray-600">
                  Nutrientes e valor energético balanceados
                </p>
              </div>
              <div className="rounded-md border border-orange-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">Valor Acessível</h4>
                <p className="text-sm text-gray-600">
                  Alimentação de qualidade para todos
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Impacto */}
      <AnimatedContainer className="w-full">
        <div className="rounded-md border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-8">
          <div className="mb-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-gray-800">
              Nosso Impacto na Alimentação
            </h3>
            <p className="text-gray-700">
              Fracionando com a porção correta de nutrientes e valor energético,
              contribuímos para a qualidade de vida dos indivíduos, que passam a
              ter uma{" "}
              <span className="font-semibold text-green-600">
                alimentação balanceada, acessível e protegida
              </span>
              .
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-green-500 p-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-800">
                Processamento Inovador
              </h4>
              <p className="text-sm text-gray-600">
                Soluções tecnológicas para envase
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-green-500 p-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-800">
                Proteção Alimentar
              </h4>
              <p className="text-sm text-gray-600">
                Preservação e segurança dos alimentos
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-green-500 p-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-800">
                Fracionamento Inteligente
              </h4>
              <p className="text-sm text-gray-600">
                Porções adequadas para cada necessidade
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-green-500 p-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-800">
                Qualidade de Vida
              </h4>
              <p className="text-sm text-gray-600">
                Alimentação balanceada para todos
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </section>
  );
}
