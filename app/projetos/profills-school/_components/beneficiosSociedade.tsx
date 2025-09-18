import { AnimatedContainer } from "@/components/AnimatedContainer";
import {
  Building2,
  DollarSign,
  Globe,
  Heart,
  Lightbulb,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

export default function BeneficiosSociedade() {
  const beneficios = [
    {
      icon: Users,
      title: "Impacto na Juventude",
      description:
        "Foco nas populações jovens e de baixa renda, fornecendo oportunidade de conhecimento",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: TrendingUp,
      title: "Aumento de Chances",
      description:
        "Resultando no aumento das chances de sucesso dentro do mercado de trabalho",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Building2,
      title: "Empresas Sólidas",
      description:
        "Criação de empresas fortes e competitivas que beneficiam a economia local",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Globe,
      title: "Atração de Investimentos",
      description:
        "Atraindo olhares e investimentos para o cenário nacional brasileiro",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <section className="w-full max-w-6xl">
      <AnimatedContainer>
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Benefícios para a <span className="text-[#2d62ef]">Sociedade</span>
          </h2>
          <p className="mx-auto max-w-4xl text-lg text-gray-600">
            Qual o benefício desse projeto para a sociedade? A Profills, como
            uma empresa consolidada, sabe exatamente o que é necessário para
            chegar à estabilidade no mercado
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {beneficios.map((beneficio, index) => {
            const IconComponent = beneficio.icon;
            return (
              <div
                key={index}
                className="group grid rounded-xl border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${beneficio.color} transition-all duration-300 group-hover:scale-110`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  {beneficio.title}
                </h3>
                <p className="text-sm text-gray-600">{beneficio.description}</p>
              </div>
            );
          })}
        </div>

        {/* Vision Section */}
        <div className="mb-8 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Nossa Visão de Futuro
              </h3>
              <p className="mb-4 text-lg leading-relaxed text-gray-700">
                A Profills, sendo uma{" "}
                <span className="font-semibold text-[#2d62ef]">
                  empresa inovadora
                </span>
                , enxerga a necessidade de trabalhar com a educação e o acesso à
                informação, pensando em{" "}
                <span className="font-semibold text-[#2d62ef]">
                  cenários futuros
                </span>
                .
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                A aplicação de todo esse conhecimento pode gerar{" "}
                <span className="font-semibold text-[#2d62ef]">
                  impactos significativos em mercados existentes
                </span>{" "}
                no Brasil, além da{" "}
                <span className="font-semibold text-[#2d62ef]">
                  criação de diversas novas empresas de sucesso
                </span>
                .
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  Inovação Contínua
                </h4>
                <p className="text-xs text-gray-600">
                  Pensando sempre em cenários futuros e soluções inovadoras
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                  <Star className="h-6 w-6" />
                </div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  Empresas de Sucesso
                </h4>
                <p className="text-xs text-gray-600">
                  Criação de novas empresas competitivas no mercado brasileiro
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  Impacto Econômico
                </h4>
                <p className="text-xs text-gray-600">
                  Benefícios para a economia local e nacional
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  Futuro Melhor
                </h4>
                <p className="text-xs text-gray-600">
                  Oportunidade de conhecimento e perspectiva de futuro
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Einstein Quote */}
        <div className="rounded-xl bg-slate-900 p-8 text-center text-white">
          <div className="bg-accent mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-slate-900">
            <Star className="h-8 w-8" />
          </div>
          <blockquote className="mb-4 text-xl font-medium italic">
            &ldquo;Lembre-se que as pessoas podem tirar tudo de você, menos o
            seu conhecimento.&rdquo;
          </blockquote>
          <cite className="text-accent text-lg font-semibold">
            — Albert Einstein
          </cite>
        </div>
      </AnimatedContainer>
    </section>
  );
}
