import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import { Cog, Cpu, GraduationCap, Wrench, Zap } from "lucide-react";

export default function TecnologiaFavor() {
  return (
    <section
      aria-labelledby="titulo-tecnologia"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-16 pb-5"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-4xl font-bold"
        >
          <h2 id="titulo-tecnologia">Tecnologia a Nosso Favor</h2>
        </Highlighter>
        <p className="mx-auto mt-4 max-w-4xl text-lg text-gray-600">
          No campo da tecnologia, buscamos fazer a{" "}
          <span className="text-accent font-semibold">gestão dos recursos</span>{" "}
          a fim de criar as{" "}
          <span className="text-accent font-semibold">
            melhores soluções para o mercado
          </span>
          .
        </p>
      </div>

      {/* Process Flow */}
      <div className="relative w-full">
        {/* Connection Line */}

        <div className="relative z-10 grid grid-cols-4 gap-8">
          <AnimatedContainer>
            <div className="group text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#2d62ef] bg-white shadow-lg transition-all duration-300 group-hover:scale-110">
                <GraduationCap className="h-10 w-10 text-[#2d62ef]" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">Pesquisa</h3>
              <p className="text-sm text-gray-600">
                <span className="text-accent font-semibold">
                  Obter informações
                </span>{" "}
                através de pesquisas especializadas
              </p>
            </div>
          </AnimatedContainer>

          <AnimatedContainer>
            <div className="group text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#2d62ef] bg-white shadow-lg transition-all duration-300 group-hover:scale-110">
                <Zap className="h-10 w-10 text-[#2d62ef]" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">Ideação</h3>
              <p className="text-sm text-gray-600">
                <span className="text-accent font-semibold">Novas ideias</span>{" "}
                para criação e planejamento
              </p>
            </div>
          </AnimatedContainer>

          <AnimatedContainer>
            <div className="group text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#2d62ef] bg-white shadow-lg transition-all duration-300 group-hover:scale-110">
                <Cog className="h-10 w-10 text-[#2d62ef]" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                Desenvolvimento
              </h3>
              <p className="text-sm text-gray-600">
                <span className="text-accent font-semibold">
                  Equipamentos de última geração
                </span>{" "}
                e softwares especializados
              </p>
            </div>
          </AnimatedContainer>

          <AnimatedContainer>
            <div className="group text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#2d62ef] bg-white shadow-lg transition-all duration-300 group-hover:scale-110">
                <Wrench className="h-10 w-10 text-[#2d62ef]" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                Implementação
              </h3>
              <p className="text-sm text-gray-600">
                <span className="text-accent font-semibold">
                  Automação industrial
                </span>{" "}
                e melhoria contínua
              </p>
            </div>
          </AnimatedContainer>
        </div>
      </div>

      {/* Resource Showcase */}
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
        <AnimatedContainer>
          <div className="rounded-md border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg backdrop-blur-xs transition-all duration-300 hover:shadow-xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-md bg-[#2d62ef]/10 p-3">
                <Cpu className="h-8 w-8 text-[#2d62ef]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Equipamentos</h3>
            </div>
            <p className="mb-4 text-gray-700">
              Usamos o que há de{" "}
              <span className="text-accent font-semibold">
                melhor no mercado
              </span>
              , equipamentos de última geração para desenvolvimento.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-[#2d62ef]"></div>
                <span>CNC de alta precisão</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-[#2d62ef]"></div>
                <span>Sistemas de automação</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-[#2d62ef]"></div>
                <span>Tecnologia de ponta</span>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="rounded-md border border-[#2d62ef]/20 bg-gradient-to-br from-[#2d62ef]/5 to-blue-50 p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-md bg-[#2d62ef]/10 p-3">
                <Zap className="h-8 w-8 text-[#2d62ef]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Softwares</h3>
            </div>
            <p className="mb-4 text-gray-700">
              <span className="text-accent font-semibold">
                Softwares indispensáveis
              </span>{" "}
              no processo de criação e desenvolvimento de soluções.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-[#2d62ef]"></div>
                <span>CAD/CAM avançado</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-[#2d62ef]"></div>
                <span>Simulação e análise</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-[#2d62ef]"></div>
                <span>Prototipagem digital</span>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="rounded-md border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg backdrop-blur-xs transition-all duration-300 hover:shadow-xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-md bg-[#2d62ef]/10 p-3">
                <GraduationCap className="h-8 w-8 text-[#2d62ef]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Equipe</h3>
            </div>
            <p className="mb-4 text-gray-700">
              <span className="text-accent font-semibold">
                Engenheiros, projetistas e técnicos
              </span>{" "}
              em constante aprendizado e evolução.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-[#2d62ef]"></div>
                <span>Especialização contínua</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-[#2d62ef]"></div>
                <span>Visão multidisciplinar</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-1.5 w-1.5 rounded-full bg-[#2d62ef]"></div>
                <span>Foco em inovação</span>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Final Statement */}
      <AnimatedContainer>
        <div className="max-w-6xl rounded-md bg-slate-900 p-8 text-center text-white shadow-lg">
          <h3 className="mb-4 text-2xl font-bold">Melhoria Contínua</h3>
          <p className="text-lg leading-relaxed">
            Visando o{" "}
            <span className="font-semibold text-[#2d62ef]">
              crescimento, melhoria e desempenho da produção
            </span>{" "}
            de nossos clientes, pensamos sempre na busca de soluções para o{" "}
            <span className="font-semibold text-[#2d62ef]">
              processo de automação industrial
            </span>
            .
          </p>
        </div>
      </AnimatedContainer>
    </section>
  );
}
