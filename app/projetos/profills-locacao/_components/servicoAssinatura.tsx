import { AnimatedContainer } from "@/components/AnimatedContainer";
import { BookOpen, Factory, Shield, Users } from "lucide-react";

export default function ServicoAssinatura() {
  return (
    <section className="w-full max-w-6xl py-10">
      <AnimatedContainer>
        <div className="grid w-full gap-8 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Sua Empresa Dispondo de um{" "}
              <span className="text-[#2d62ef]">Serviço por Assinatura</span>
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Trata-se de{" "}
              <span className="font-semibold text-[#2d62ef]">
                sucesso garantido
              </span>{" "}
              para as empresas em expansão e um{" "}
              <span className="font-semibold text-[#2d62ef]">
                ambiente seguro
              </span>
              , um ponto de entrada fácil no mercado, para aqueles que estão em
              sua primeira empreitada,{" "}
              <span className="font-semibold text-[#2d62ef]">
                reduzindo os riscos inerentes a esse primeiro passo
              </span>
              .
            </p>
          </div>

          {/* Right Content - Benefits Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="group rounded-md border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <Factory className="mb-4 h-12 w-12 text-[#2d62ef] transition-all duration-300 group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Máquinas Confiáveis
              </h3>
              <p className="text-gray-600">
                Equipamentos de última geração com toda a qualidade Profills
              </p>
            </div>

            <div className="group rounded-md border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <Users className="mb-4 h-12 w-12 text-[#2d62ef] transition-all duration-300 group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Soluções Profills Hub
              </h3>
              <p className="text-gray-600">
                Acesso completo ao ecossistema integrado de soluções
              </p>
            </div>

            <div className="group rounded-md border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <BookOpen className="mb-4 h-12 w-12 text-[#2d62ef] transition-all duration-300 group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Capacitação Incluída
              </h3>
              <p className="text-gray-600">
                Instruções sobre processamento de alimentos e boas práticas
              </p>
            </div>

            <div className="group rounded-md border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <Shield className="mb-4 h-12 w-12 text-[#2d62ef] transition-all duration-300 group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Redução de Riscos
              </h3>
              <p className="text-gray-600">
                Ambiente seguro para empreendedores iniciantes e empresas em
                expansão
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </section>
  );
}
