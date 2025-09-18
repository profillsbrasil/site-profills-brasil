import { AnimatedContainer } from "@/components/AnimatedContainer";
import { Highlighter } from "@/components/magicui/highlighter";
import { OptimizedEmbalagem3d } from "@/components/modelo3d/optimizedEmbalagem3d";

const listaDeEmbalagens = [
  {
    title: "Gable Top",
    description:
      "Sustentável, prática e ideal para diferentes tipos de produtos.",
    modelSrc: "/caixa-teste-3d.glb", // Futuramente: "/models/gable-top.glb"
    cameraOrbit: "40deg 75deg 100%",
  },
  {
    title: "Stand-Up Pouch",
    description:
      "Resistente, versátil e com múltiplas opções de personalização.",
    modelSrc: "/caixa-teste-3d.glb", // Futuramente: "/models/stand-up-pouch.glb"
    cameraOrbit: "30deg 80deg 100%",
  },
  {
    title: "Especiais",
    description: "Formatos exclusivos criados sob medida para o seu negócio.",
    modelSrc: "/caixa-teste-3d.glb", // Futuramente: "/models/especiais.glb"
    cameraOrbit: "50deg 70deg 100%",
  },
  {
    title: "Sache",
    description: "Prático, seguro e disponível na versão 4 soldas Profills.",
    modelSrc: "/caixa-teste-3d.glb", // Futuramente: "/models/sache.glb"
    cameraOrbit: "20deg 85deg 100%",
  },
  {
    title: "Garrafas",
    description: "Diversos tamanhos, perfeitas para o envase de líquidos.",
    modelSrc: "/caixa-teste-3d.glb", // Futuramente: "/models/garrafas.glb"
    cameraOrbit: "45deg 75deg 100%",
  },
  {
    title: "Frascos",
    description: "Seguros e resistentes, ideais para armazenar fluidos.",
    modelSrc: "/caixa-teste-3d.glb", // Futuramente: "/models/frascos.glb"
    cameraOrbit: "35deg 80deg 100%",
  },
  {
    title: "Fardo",
    description: "Flexível e eficiente para agrupar produtos embalados.",
    modelSrc: "/caixa-teste-3d.glb", // Futuramente: "/models/fardo.glb"
    cameraOrbit: "60deg 65deg 100%",
  },
  {
    title: "Potes",
    description: "Praticidade no envase e consumo de alimentos variados.",
    modelSrc: "/caixa-teste-3d.glb", // Futuramente: "/models/potes.glb"
    cameraOrbit: "25deg 85deg 100%",
  },
];

export default function ListaEmbalagens() {
  return (
    <section className="relative z-10 py-5">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="items-left mb-5 flex flex-col text-left">
          <h2 className="mb-4 flex gap-2 text-3xl leading-tight font-bold">
            <Highlighter
              action="underline"
              color="#2d62ef"
              animationDuration={4000}
              textColor="text-3xl font-bold"
            >
              Conheça Algumas das Nossas Embalagens
            </Highlighter>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Soluções para todos os tipos de produtos
          </p>
        </div>

        {/* Benefits listaDeEmbalagens */}
        <AnimatedContainer delay={0.3}>
          <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-4">
            {listaDeEmbalagens.map((card, index) => (
              <div
                key={index}
                className="group bg-background hover:bg-muted flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-sm border border-black/10 shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="relative p-5">
                  <div className="mb-2 flex flex-col gap-4">
                    <div className="bg-background rounded-sm p-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-black/10">
                      <OptimizedEmbalagem3d
                        modelSrc={card.modelSrc}
                        alt={`Modelo 3D - ${card.title}`}
                        cameraOrbit={card.cameraOrbit}
                        autoRotate={true}
                      />
                    </div>
                    <h3 className="flex-1 text-base font-semibold">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
