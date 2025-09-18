import { AnimatedContainer } from "@/components/AnimatedContainer";
import {
  BookOpen,
  Building2,
  Monitor,
  Presentation,
  Target,
  Users,
} from "lucide-react";

export default function MetodologiasEnsino() {
  const metodologias = [
    {
      icon: Monitor,
      title: "Cursos Online",
      description:
        "Plataforma digital com conteúdo especializado e certificações reconhecidas",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Users,
      title: "Cursos Presenciais",
      description:
        "Formação prática com hands-on em nossas instalações e laboratórios",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: BookOpen,
      title: "Materiais Didáticos",
      description:
        "Conteúdo técnico desenvolvido com base no know-how da Profills",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Presentation,
      title: "Palestras Especializadas",
      description:
        "Eventos com especialistas compartilhando conhecimentos práticos do mercado",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Building2,
      title: "Visitas Institucionais",
      description:
        "Experiência prática conhecendo de perto nossos processos e tecnologias",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Target,
      title: "Projetos Aplicados",
      description:
        "Aplicação prática do conhecimento em projetos reais e desafiadores",
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <section className="w-full max-w-6xl py-10">
      <AnimatedContainer>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Como Funciona a{" "}
            <span className="text-[#2d62ef]">Profills School</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            O projeto tem o intuito de fornecer metodologias diversas para
            colaboradores e comunidades, gerando mais profissionais qualificados
            para o mercado de trabalho
          </p>
        </div>

        {/* Methodologies Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {metodologias.map((metodologia, index) => {
            const IconComponent = metodologia.icon;
            return (
              <div
                key={index}
                className="group rounded-md border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${metodologia.color} transition-all duration-300 group-hover:scale-110`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {metodologia.title}
                </h3>
                <p className="text-gray-600">{metodologia.description}</p>
              </div>
            );
          })}
        </div>
      </AnimatedContainer>
    </section>
  );
}
