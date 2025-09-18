import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import { Building, Flag, Globe, MapPin } from "lucide-react";

export default function ExpansaoGlobal() {
  return (
    <section
      aria-labelledby="titulo-expansao"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-8 py-10"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-3xl font-bold"
        >
          <h2 id="titulo-expansao">Expansão Global</h2>
        </Highlighter>
        <p className="mx-auto mt-4 max-w-4xl text-lg text-gray-600">
          Uma estrutura consolidada no Brasil que se expande para{" "}
          <span className="text-accent font-semibold">
            mercados internacionais estratégicos
          </span>
          .
        </p>
      </div>

      {/* Map-like Layout */}
      <div className="grid w-full grid-cols-2 gap-12">
        {/* Brasil */}
        <AnimatedContainer>
          <div className="rounded-md border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-green-500 p-3">
                <Flag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Brasil - Base Consolidada
              </h3>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              Já contamos com uma{" "}
              <span className="text-accent font-semibold">
                estrutura em todo o Brasil
              </span>
              , com filiais espalhadas pelo país, nos estados do{" "}
              <span className="text-accent font-semibold">
                Pará, Paraná, São Paulo
              </span>
              , uma nova unidade na{" "}
              <span className="text-accent font-semibold">Bahia</span>, e muito
              mais está por vir.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md border border-green-100 bg-white/80 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-800">Pará</span>
                </div>
                <p className="text-sm text-gray-600">Região Norte</p>
              </div>

              <div className="rounded-md border border-green-100 bg-white/80 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-800">Paraná</span>
                </div>
                <p className="text-sm text-gray-600">Região Sul</p>
              </div>

              <div className="rounded-md border border-green-100 bg-white/80 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-800">São Paulo</span>
                </div>
                <p className="text-sm text-gray-600">Região Sudeste</p>
              </div>

              <div className="rounded-md border border-green-100 bg-white/80 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-800">Bahia</span>
                </div>
                <p className="text-sm text-gray-600">Região Nordeste</p>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Internacional */}
        <AnimatedContainer>
          <div className="rounded-md border border-[#2d62ef]/20 bg-gradient-to-br from-[#2d62ef]/10 to-blue-100 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-[#2d62ef] p-3">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Expansão Internacional
              </h3>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              Internacionalmente, preparamos filiais na{" "}
              <span className="text-accent font-semibold">
                Colômbia, República Dominicana, Estados Unidos
              </span>{" "}
              e nos{" "}
              <span className="text-accent font-semibold">
                Emirados Árabes Unidos
              </span>
              .
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="w-full rounded-md border border-blue-100 bg-white/80 p-4">
                <div className="flex h-full w-full items-center justify-between backdrop-blur-sm">
                  <div className="flex flex-col backdrop-blur-sm">
                    <h4 className="font-semibold text-gray-800">Colômbia</h4>
                    <p className="text-sm text-gray-600">América do Sul</p>
                  </div>
                  <Building className="h-6 w-6 text-[#2d62ef]" />
                </div>
              </div>

              <div className="w-full rounded-md border border-blue-100 bg-white/80 p-4">
                <div className="flex h-full w-full items-center justify-between backdrop-blur-sm">
                  <div className="flex flex-col backdrop-blur-sm">
                    <h4 className="font-semibold text-gray-800">
                      República Dominicana
                    </h4>
                    <p className="text-sm text-gray-600">Caribe</p>
                  </div>
                  <Building className="h-6 w-6 text-[#2d62ef]" />
                </div>
              </div>

              <div className="w-full rounded-md border border-blue-100 bg-white/80 p-4">
                <div className="flex h-full w-full items-center justify-between backdrop-blur-sm">
                  <div className="flex flex-col backdrop-blur-sm">
                    <h4 className="font-semibold text-gray-800">
                      Estados Unidos
                    </h4>
                    <p className="text-sm text-gray-600">América do Norte</p>
                  </div>
                  <Building className="h-6 w-6 text-[#2d62ef]" />
                </div>
              </div>

              <div className="w-full rounded-md border border-blue-100 bg-white/80 p-4">
                <div className="flex h-full w-full items-center justify-between backdrop-blur-sm">
                  <div className="flex flex-col backdrop-blur-sm">
                    <h4 className="font-semibold text-gray-800">
                      Emirados Árabes Unidos
                    </h4>
                    <p className="text-sm text-gray-600">Oriente Médio</p>
                  </div>
                  <Building className="h-6 w-6 text-[#2d62ef]" />
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Impact Stats */}
      <AnimatedContainer className="w-full">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-6">
          <div className="rounded-md border border-gray-100 bg-white p-6 text-center shadow-md backdrop-blur-sm">
            <div className="mb-2 text-3xl font-bold text-[#2d62ef]">10+</div>
            <div className="text-gray-600">Anos de Experiência</div>
          </div>
          <div className="rounded-md border border-gray-100 bg-white p-6 text-center shadow-md backdrop-blur-sm">
            <div className="mb-2 text-3xl font-bold text-[#2d62ef]">4</div>
            <div className="text-gray-600">Estados no Brasil</div>
          </div>
          <div className="rounded-md border border-gray-100 bg-white p-6 text-center shadow-md backdrop-blur-sm">
            <div className="mb-2 text-3xl font-bold text-[#2d62ef]">4</div>
            <div className="text-gray-600">Países Internacionais</div>
          </div>
          <div className="rounded-md border border-gray-100 bg-white p-6 text-center shadow-md">
            <div className="mb-2 text-3xl font-bold text-[#2d62ef]">3</div>
            <div className="text-gray-600">Continentes</div>
          </div>
        </div>
      </AnimatedContainer>
    </section>
  );
}
