import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import {
  Apple,
  ArrowRight,
  Droplets,
  Network,
  Package,
  Users,
} from "lucide-react";

export default function CadeiaSuprimentos() {
  return (
    <section
      aria-labelledby="titulo-cadeia"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-12 py-10"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-3xl font-bold"
        >
          <h2 id="titulo-cadeia"> Conectando Mercados Globalmente</h2>
        </Highlighter>
        <p className="mx-auto mt-4 max-w-4xl text-lg text-gray-600">
          Desde nossa fundação, trabalhamos na{" "}
          <span className="text-accent font-semibold">
            cadeia de suprimentos brasileira
          </span>
          , conectando pequenas empresas aos{" "}
          <span className="text-accent font-semibold">
            maiores players do mercado
          </span>
          .
        </p>
      </div>

      {/* Supply Chain Flow */}
      <AnimatedContainer className="w-full">
        <div className="px-10 pb-5">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-orange-100 p-4 backdrop-blur-sm">
                <Users className="h-10 w-10 text-orange-600" />
              </div>
              <h4 className="mb-2 font-bold text-gray-800">
                Pequenas Empresas
              </h4>
              <p className="text-sm text-gray-600">
                Produtores individuais e empresas locais
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-[#2d62ef]" />

            <div className="text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-green-100 p-4 backdrop-blur-sm">
                <Package className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="mb-2 font-bold text-gray-800">Processamento</h4>
              <p className="text-sm text-gray-600">
                Soluções de embalagem e processamento
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-[#2d62ef]" />

            <div className="text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-blue-100 p-4 backdrop-blur-sm">
                <Network className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="mb-2 font-bold text-gray-800">Distribuição</h4>
              <p className="text-sm text-gray-600">
                Rede global de distribuição
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-[#2d62ef]" />

            <div className="text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-purple-100 p-4 backdrop-blur-sm">
                <Apple className="h-10 w-10 text-purple-600" />
              </div>
              <h4 className="mb-2 font-bold text-gray-800">Mercado Global</h4>
              <p className="text-sm text-gray-600">
                Consumidores internacionais
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Value Proposition */}
      <div className="grid w-full grid-cols-2 gap-8">
        <AnimatedContainer>
          <div className="h-full rounded-md border border-gray-100 bg-white p-8 shadow-lg backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-[#2d62ef]/10 p-3 backdrop-blur-sm">
                <Droplets className="h-8 w-8 text-[#2d62ef]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Especialização em Polpa de Fruta
              </h3>
            </div>
            <p className="mb-4 leading-relaxed text-gray-700">
              Atendemos tanto{" "}
              <span className="text-accent font-semibold">
                pequenas empresas e produtores individuais
              </span>
              , quanto os{" "}
              <span className="text-accent font-semibold">
                maiores players do ramo de polpa de fruta
              </span>
              , entre outros produtos.
            </p>
            <p className="leading-relaxed text-gray-700">
              Entendemos que é possível{" "}
              <span className="text-accent font-semibold">
                construir mais valor
              </span>{" "}
              em cima dessa base e continuar expandindo o mercado para nossos
              clientes.
            </p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="h-full rounded-md border border-[#2d62ef]/20 bg-gradient-to-br from-[#2d62ef]/10 to-blue-100 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-[#2d62ef]/20 p-3 backdrop-blur-sm">
                <Network className="h-8 w-8 text-[#2d62ef]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Ponto de Contato Global
              </h3>
            </div>
            <p className="mb-4 leading-relaxed text-gray-700">
              Somos capazes de agir como um{" "}
              <span className="text-accent font-semibold">
                ponto de contato entre os mercados
              </span>{" "}
              e nossas outras bases em todo o mundo.
            </p>
            <p className="leading-relaxed text-gray-700">
              Fornecemos{" "}
              <span className="text-accent font-semibold">
                acesso ao conhecimento adquirido
              </span>{" "}
              ao longo de nossa jornada, proporcionando{" "}
              <span className="text-accent font-semibold">
                soluções de embalagem
              </span>{" "}
              aos parceiros no exterior.
            </p>
          </div>
        </AnimatedContainer>
      </div>

      {/* Product Promise */}
      <AnimatedContainer className="w-full">
        <div className="rounded-md bg-slate-900 p-8 text-center text-white shadow-xl">
          <h3 className="mb-4 text-2xl font-bold">Nossa Promessa Global</h3>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed">
            Entregamos{" "}
            <span className="text-accent font-semibold">
              porções seguras, bem embaladas, atraentes e precisamente dosadas
            </span>{" "}
            de alimentos e bebidas para o{" "}
            <span className="text-accent font-bold">mundo todo</span>.
          </p>
        </div>
      </AnimatedContainer>
    </section>
  );
}
