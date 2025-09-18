import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import { Building2, Globe, HandHeart, TrendingUp } from "lucide-react";

export default function DesenvolvimentoFuturo() {
  return (
    <section
      aria-labelledby="titulo-desenvolvimento"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-8 py-10"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#8b5cf6"
          animationDuration={4000}
          textColor="text-3xl font-bold"
        >
          <h2 id="titulo-desenvolvimento">Desenvolvimento e Futuro</h2>
        </Highlighter>
        <p className="mx-auto mt-4 max-w-4xl text-lg text-gray-600">
          Para enfrentarmos os{" "}
          <span className="font-semibold text-purple-600">
            desafios ambientais, sociais e econômicos
          </span>
          , é necessário trabalhar nos indivíduos através da educação, saúde e
          oportunidades.
        </p>
      </div>

      {/* Pilares do Desenvolviment */}
      <AnimatedContainer className="w-full">
        <div className="grid grid-cols-4 gap-6">
          <div className="rounded-md border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-blue-500 p-3">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="mb-2 font-bold text-gray-800">
              Acesso à Informação
            </h3>
            <p className="text-sm text-gray-600">Através da educação</p>
          </div>

          <div className="rounded-md border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-500 p-3">
                <HandHeart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="mb-2 font-bold text-gray-800">
              Contribuir para Saúde
            </h3>
            <p className="text-sm text-gray-600">Proteção do alimento</p>
          </div>

          <div className="rounded-md border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-purple-500 p-3">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="mb-2 font-bold text-gray-800">Qualidade de Vida</h3>
            <p className="text-sm text-gray-600">Empregos e treinamentos</p>
          </div>

          <div className="rounded-md border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-orange-500 p-3">
                <Globe className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="mb-2 font-bold text-gray-800">
              Reduzir Desperdício
            </h3>
            <p className="text-sm text-gray-600">Fracionamento inteligente</p>
          </div>
        </div>
      </AnimatedContainer>

      <div className="grid w-full grid-cols-2 gap-12">
        {/* Grandes Corporações e Pequenos Produtores */}
        <AnimatedContainer>
          <div className="rounded-md border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-indigo-500 p-3">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Soluções Inclusivas
              </h3>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              Apresentamos soluções tanto para{" "}
              <span className="font-semibold text-indigo-600">
                grandes corporações
              </span>{" "}
              quanto para o{" "}
              <span className="font-semibold text-indigo-600">
                pequeno produtor
              </span>
              , que tem sua renda hoje limitada ao comércio local.
            </p>

            <div className="space-y-4">
              <div className="rounded-md border border-indigo-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Agregação de Valor
                </h4>
                <p className="text-sm text-gray-600">
                  Aumentamos o valor dos produtos através da tecnologia
                </p>
              </div>
              <div className="rounded-md border border-indigo-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Shelf Life Extendido
                </h4>
                <p className="text-sm text-gray-600">
                  Embalagens que preservam por mais tempo
                </p>
              </div>
              <div className="rounded-md border border-indigo-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Conexão de Mercados
                </h4>
                <p className="text-sm text-gray-600">
                  Plataforma de e-commerce para ampliar alcance
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Expansão Internacional Sustentável */}
        <AnimatedContainer>
          <div className="rounded-md border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-emerald-500 p-3">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Impacto Global
              </h3>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              Queremos introduzir nossas{" "}
              <span className="font-semibold text-emerald-600">
                Máquinas de Envase
              </span>{" "}
              em países subdesenvolvidos, onde o acesso à alimentação segura e
              nutritiva é limitado.
            </p>

            <div className="space-y-4">
              <div className="rounded-md border border-emerald-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Melhorar Distribuição
                </h4>
                <p className="text-sm text-gray-600">
                  Sistemas eficientes de distribuição de alimentos
                </p>
              </div>
              <div className="rounded-md border border-emerald-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Apoiar Produtores Locais
                </h4>
                <p className="text-sm text-gray-600">
                  Fortalecimento da economia local
                </p>
              </div>
              <div className="rounded-md border border-emerald-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Gerar Empregos de Qualidade
                </h4>
                <p className="text-sm text-gray-600">
                  Oportunidades de trabalho sustentáveis
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
