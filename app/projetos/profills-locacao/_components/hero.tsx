import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import imgLocacao from "@/lib/images/projetos/Locacao.jpg";
import { Calendar, CreditCard, Settings, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      aria-labelledby="titulo-profills-locacao"
      className="flex min-h-[93vh] w-full max-w-6xl flex-col items-center justify-evenly"
    >
      <AnimatedContainer className="w-full">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image
            src={imgLocacao}
            alt="Profills Locação - Máquinas por Assinatura"
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
          <h1 id="titulo-profills-locacao">Profills Locação</h1>
        </Highlighter>

        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          <p>
            Em um{" "}
            <span className="text-accent font-semibold">
              modelo de negócio único
            </span>
            , planejamos revolucionar o mercado de envase no Brasil oferecendo
            uma nova linha de{" "}
            <span className="text-accent font-semibold">
              Máquinas por mensalidade
            </span>
            , para atender empreendedores que estão começando seus negócios ou
            empresas consolidadas interessadas em{" "}
            <span className="text-accent font-semibold">
              soluções menos onerosas
            </span>{" "}
            para expandir suas operações.
          </p>

          <p>
            Os clientes terão à sua disposição todo o{" "}
            <span className="text-accent font-semibold">
              conhecimento e experiência da Profills
            </span>
            , Máquinas confiáveis, soluções da Profills Hub, bem como instruções
            acerca do processamento de alimentos e boas práticas.
          </p>
        </div>

        {/* Features Cards */}
        <AnimatedContainer className="w-full">
          <div className="grid w-full grid-cols-4 gap-5">
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Calendar className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Mensalidade Flexível</h3>
                <p className="text-xs text-gray-600">Pagamento facilitado</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <CreditCard className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Baixo Investimento</h3>
                <p className="text-xs text-gray-600">Acesso facilitado</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Settings className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Manutenção Incluída</h3>
                <p className="text-xs text-gray-600">Suporte completo</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <TrendingUp className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Crescimento Seguro</h3>
                <p className="text-xs text-gray-600">Redução de riscos</p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
