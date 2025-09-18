import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import imgMarketplace from "@/lib/images/projetos/marketplace.jpg";
import { Globe, Shield, Smartphone, Users } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      aria-labelledby="titulo-profills-marketplace"
      className="flex min-h-[93vh] w-full max-w-6xl flex-col items-center justify-evenly"
    >
      <AnimatedContainer className="w-full">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image
            src={imgMarketplace}
            alt="Profills Marketplace - Conexão Digital de Negócios"
            className="z-10 h-full w-full rounded-md object-contain shadow-xl"
            loading="eager"
          />
        </div>
      </AnimatedContainer>

      <div className="flex h-full w-full flex-col items-center gap-10">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-4xl font-bold"
        >
          <h1 id="titulo-profills-marketplace">Profills Marketplace</h1>
        </Highlighter>

        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          <p>
            A Profills vê nesse mercado uma{" "}
            <span className="text-accent font-semibold">
              oportunidade de colaborar
            </span>{" "}
            com o crescimento e a expansão de pequenos e grandes produtores,
            distribuidores e indústrias, fornecendo uma{" "}
            <span className="text-accent font-semibold">
              ferramenta para a negociação e venda dos insumos de forma online
            </span>
            , por meio de um marketplace exclusivo.
          </p>

          <p>
            Por ser uma empresa com uma{" "}
            <span className="text-accent font-semibold">
              carteira vasta de clientes
            </span>
            , a Profills agregará os{" "}
            <span className="text-accent font-semibold">
              melhores fornecedores e produtores
            </span>{" "}
            dos mais diversos nichos.
          </p>
        </div>

        {/* Features Cards */}
        <AnimatedContainer className="w-full">
          <div className="grid w-full grid-cols-4 gap-5">
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Globe className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Mercado Digital</h3>
                <p className="text-xs text-gray-600">Presença online</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Smartphone className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Mobile First</h3>
                <p className="text-xs text-gray-600">Compras pelo celular</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Shield className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Segurança Total</h3>
                <p className="text-xs text-gray-600">Profills Bank</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Users className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Hub de Negócios</h3>
                <p className="text-xs text-gray-600">Conexões estratégicas</p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
