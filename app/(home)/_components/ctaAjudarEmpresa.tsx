import { AnimatedContainer } from "@/components/AnimatedContainer";
import { GridPattern } from "@/components/layout/gridPatternBg";
import { Highlighter } from "@/components/magicui/highlighter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import logoAutonics from "@/lib/images/fornecedores/Autonics.png";
import logoFesto from "@/lib/images/fornecedores/Festo.png";
import logoNetzsch from "@/lib/images/fornecedores/Netzsch.png";
import logoOmron from "@/lib/images/fornecedores/Omron.png";
import logoPanasonic from "@/lib/images/fornecedores/Panasonic.png";
import logoSewEurodrive from "@/lib/images/fornecedores/SEWeurodrive.png";
import logoSmc from "@/lib/images/fornecedores/SMC.png";
import logoWeg from "@/lib/images/fornecedores/weg.png";
import { ArrowRight, Clock, Settings, Shield } from "lucide-react";
import Image from "next/image";

const fornecedores = [
  {
    logo: logoAutonics,
    alt: "Autonics",
  },

  {
    logo: logoFesto,
    alt: "Festo",
  },

  {
    logo: logoNetzsch,
    alt: "Netzsch",
  },
  {
    logo: logoOmron,
    alt: "Omron",
  },
  {
    logo: logoPanasonic,
    alt: "Panasonic",
  },
  {
    logo: logoSewEurodrive,
    alt: "Sew Eurodrive",
  },
  {
    logo: logoSmc,
    alt: "SMC",
  },
  {
    logo: logoWeg,
    alt: "Weg",
  },
];

const cards = [
  {
    title: "Conformidade garantida",
    description:
      "Adequação da operação a um processo de envase higiênico, nos padrões da Anvisa, impedindo o contato do produto com micro-organismos.",
    icon: <Shield className="h-5 w-5 text-white" />,
    badge: "Conformidade garantida",
  },
  {
    title: "Otimização de tempo",
    description:
      "Tempo para dedicar-se a outras áreas do seu negócio, a exemplo das vendas e abertura de novos mercados.",
    icon: <Clock className="h-5 w-5 text-white" />,
    badge: "Mais produtividade",
  },
  {
    title: "Automatização completa",
    description:
      "Automatização do processo de envase, evitando desperdícios, otimizando a produção com aumento em volume de envase.",
    icon: <Settings className="h-5 w-5 text-white" />,
    badge: "Retorno de investimento",
  },
];

export default function CtaAjudarEmpresa() {
  return (
    <section className="relative z-10 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-5 flex flex-col items-center text-center">
          <h2 className="mb-4 flex gap-2 text-3xl leading-tight font-bold">
            Como podemos
            <Highlighter
              action="underline"
              color="#2d62ef"
              animationDuration={4000}
              textColor="text-3xl font-bold text-accent"
            >
              ajudar sua empresa?
            </Highlighter>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Descubra como nossas soluções podem revolucionar seus processos e
            impulsionar seus resultados de forma mensurável e sustentável
          </p>
        </div>

        {/* Benefits Cards */}
        <AnimatedContainer delay={0.3}>
          <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {cards.map((card, index) => (
              <div
                key={index}
                className="group relative flex flex-col overflow-hidden rounded-sm bg-slate-900 text-white shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-2xl"
              >
                <GridPattern />
                <div className="relative p-6 transition-all duration-300">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="rounded-sm border border-white/30 bg-slate-900 p-3 transition-transform duration-300 group-hover:scale-105">
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-base font-semibold">
                        {card.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className="border border-white/30 bg-slate-900 px-3 py-1 text-xs font-medium text-white"
                      >
                        {card.badge}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedContainer>

        <div className="w-full max-w-6xl pb-2">
          <div className="text-center">
            <p className="text-muted-foreground">
              Acreditamo que a qualidade comeca na escolha dos melhores
              componentes
            </p>
            <h2 className="text-muted-foreground text-2xl font-semibold">
              Por isto usamos as melhores marcas!
            </h2>
          </div>
          <div className="flex w-full gap-4">
            {fornecedores.map((fornecedor) => (
              <div
                key={fornecedor.alt}
                className="maxk h-20 w-1/6 scale-115 transition-all duration-300 hover:scale-110"
              >
                <Image
                  src={fornecedor.logo}
                  alt={fornecedor.alt}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="group border-border !bg-background hover:border-accent/30 hover:bg-accent/10 hover:text-accent rounded-sm border px-8 py-4 font-semibold shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            Comece agora mesmo!
            <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
