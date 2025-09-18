import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import { BookOpen, Brain, Globe, Users } from "lucide-react";

export default function Educacao() {
  return (
    <section
      aria-labelledby="titulo-educacao"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-8 py-5"
    >
      <div className="text-center">
        <Highlighter
          action="underline"
          color="#3b82f6"
          animationDuration={4000}
          textColor="text-3xl font-bold"
        >
          <h2 id="titulo-educacao">Educação para o Futuro</h2>
        </Highlighter>
        <p className="mx-auto mt-4 max-w-4xl text-lg text-gray-600">
          Acreditamos que a{" "}
          <span className="font-semibold text-blue-600">
            educação é a base de uma sociedade promissora
          </span>
          , por isso nos comprometemos em promover o crescimento e
          desenvolvimento para todos.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-10">
        {/* Nossa Filosofia */}
        <AnimatedContainer className="flex h-full w-full">
          <div className="flex h-full w-full flex-col rounded-md border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-blue-500 p-3">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Nossa Filosofia
              </h3>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              Não exigimos experiência na maioria de nossos processos seletivos,
              mas sim, uma{" "}
              <span className="font-semibold text-blue-600">
                mente aberta e disposta a absorver conhecimento
              </span>
              .
            </p>

            <div className="space-y-4">
              <div className="rounded-md border border-blue-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Treinamento Completo
                </h4>
                <p className="text-sm text-gray-600">
                  Treinamos colaboradores para diversas funções
                </p>
              </div>
              <div className="rounded-md border border-blue-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Rotatividade de Setores
                </h4>
                <p className="text-sm text-gray-600">
                  Estimulamos aprendizado contínuo em áreas diferentes
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Profills School */}
        <AnimatedContainer className="flex h-full w-full">
          <div className="h-full w-full rounded-md border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-full bg-emerald-500 p-3">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Profills School
              </h3>
            </div>

            <p className="mb-6 leading-relaxed text-gray-700">
              Oferece{" "}
              <span className="font-semibold text-emerald-600">
                cursos e treinamentos
              </span>{" "}
              para colaboradores, clientes, parceiros e interessados, com o
              objetivo de inserir conhecimento relevante sobre indústria,
              comércio e consumo consciente.
            </p>

            <div className="space-y-4">
              <div className="rounded-md border border-emerald-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Palestras Didáticas
                </h4>
                <p className="text-sm text-gray-600">
                  Conteúdo educativo e envolvente
                </p>
              </div>
              <div className="rounded-md border border-emerald-100 bg-white/80 p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Cursos Online e Presenciais
                </h4>
                <p className="text-sm text-gray-600">
                  Flexibilidade no aprendizado
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Público Alvo e Temas */}
      <AnimatedContainer className="w-full">
        <div className="grid w-full grid-cols-2 gap-8">
          {/* Público Alvo */}
          <div className="w-full rounded-md border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 p-6">
            <div className="mb-6 flex items-center gap-3">
              <Users className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">
                Quem Pode Participar
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-purple-100 bg-white/80 p-3 text-center backdrop-blur-sm">
                <span className="text-sm font-semibold text-gray-800">
                  Colaboradores
                </span>
              </div>
              <div className="rounded-md border border-purple-100 bg-white/80 p-3 text-center backdrop-blur-sm">
                <span className="text-sm font-semibold text-gray-800">
                  Clientes
                </span>
              </div>
              <div className="rounded-md border border-purple-100 bg-white/80 p-3 text-center backdrop-blur-sm">
                <span className="text-sm font-semibold text-gray-800">
                  Parceiros
                </span>
              </div>
              <div className="rounded-md border border-purple-100 bg-white/80 p-3 text-center backdrop-blur-sm">
                <span className="text-sm font-semibold text-gray-800">
                  Interessados
                </span>
              </div>
            </div>
          </div>

          {/* Temas */}
          <div className="w-full rounded-md border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 p-6">
            <div className="mb-6 flex items-center gap-3">
              <Globe className="h-6 w-6 text-amber-600" />
              <h3 className="text-xl font-bold text-gray-800">
                Temas Abordados
              </h3>
            </div>

            <div className="space-y-3">
              <div className="rounded-md border border-amber-100 bg-white/80 p-3 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">Indústria</h4>
                <p className="text-xs text-gray-600">Processos e tecnologias</p>
              </div>
              <div className="rounded-md border border-amber-100 bg-white/80 p-3 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">Comércio</h4>
                <p className="text-xs text-gray-600">Estratégias de mercado</p>
              </div>
              <div className="rounded-md border border-amber-100 bg-white/80 p-3 backdrop-blur-sm">
                <h4 className="font-semibold text-gray-800">
                  Consumo Consciente
                </h4>
                <p className="text-xs text-gray-600">
                  Sustentabilidade e responsabilidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Impacto Educacional */}
      <AnimatedContainer className="w-full">
        <div className="rounded-md border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-8 text-center">
          <h3 className="mb-4 text-2xl font-bold text-gray-800">
            Impacto Educacional da Profills School
          </h3>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700">
            Nossa ideia é capacitar pessoas através de{" "}
            <span className="font-semibold text-indigo-600">
              profissionais qualificados
            </span>
            , criando uma rede de conhecimento que impacta diretamente e
            indiretamente todos aqueles que são tocados pelas nossas máquinas e
            soluções.
          </p>
        </div>
      </AnimatedContainer>
    </section>
  );
}
