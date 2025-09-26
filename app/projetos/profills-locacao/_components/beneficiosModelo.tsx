import { AnimatedContainer } from "@/components/AnimatedContainer";
import {
  Calculator,
  Cog,
  DollarSign,
  HandHeart,
  Rocket,
  TrendingUp,
} from "lucide-react";

export default function BeneficiosModelo() {
  const beneficios = [
    {
      icon: DollarSign,
      title: "Investimento Reduzido",
      description:
        "Acesso às melhores máquinas sem grandes investimentos iniciais",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Cog,
      title: "Manutenção Incluída",
      description:
        "Suporte técnico completo e manutenção preventiva sem custos extras",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Escalabilidade",
      description:
        "Cresça seu negócio conforme a demanda, com flexibilidade total",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: HandHeart,
      title: "Experiência Profills",
      description:
        "Todo o conhecimento e expertise de líder de mercado ao seu dispor",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Calculator,
      title: "Previsibilidade Financeira",
      description:
        "Controle total dos custos com mensalidades fixas e transparentes",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Rocket,
      title: "Entrada Facilitada",
      description:
        "Ponto de entrada fácil no mercado para novos empreendedores",
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <section className="w-full max-w-6xl py-10">
      <AnimatedContainer>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
            Vantagens do{" "}
            <span className="text-[#2d62ef]">Modelo por Assinatura</span>
          </h2>
          <p className="mx-auto max-w-3xl text-sm text-gray-600 md:text-lg">
            Uma nova forma de acessar tecnologia de ponta, reduzindo riscos e
            maximizando oportunidades para seu negócio
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {beneficios.map((beneficio, index) => {
            const IconComponent = beneficio.icon;
            return (
              <div
                key={index}
                className="group rounded-xs border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${beneficio.color} transition-all duration-300 group-hover:scale-110`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900 md:text-xl">
                  {beneficio.title}
                </h3>
                <p className="text-gray-600">{beneficio.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-xs bg-slate-900 p-8 text-center text-white">
          <h3 className="mb-4 text-xl font-bold md:text-2xl">
            Pronto para Revolucionar seu Negócio?
          </h3>
          <p className="mb-6 text-sm md:text-lg">
            Junte-se à revolução do mercado de envase no Brasil com o modelo
            mais inovador e seguro do setor
          </p>
        </div>
      </AnimatedContainer>
    </section>
  );
}
