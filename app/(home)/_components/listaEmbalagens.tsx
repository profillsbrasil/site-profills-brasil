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
    <section className="relative z-10 px-4 py-5">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="items-left mb-6 flex flex-col text-left md:mb-5">
          <Highlighter
            action="underline"
            color="#2d62ef"
            animationDuration={4000}
            textColor="text-2xl mb-3 hidden md:flex gap-2 leading-tight font-bold md:text-3xl md:mb-2"
          >
            Nossas Embalagens
          </Highlighter>

          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Soluções para todos os tipos de produtos
          </p>
        </div>

        {/* Benefits listaDeEmbalagens */}
        <AnimatedContainer delay={0.3}>
          <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {listaDeEmbalagens.map((card, index) => (
              <div
                key={index}
                className="group bg-background hover:bg-muted flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xs border border-black/30 shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="relative">
                  <div className="bg-background rounded-xs p-3 group-hover:shadow-md group-hover:shadow-black/10 md:p-5">
                    <OptimizedEmbalagem3d
                      modelSrc={card.modelSrc}
                      alt={`Modelo 3D - ${card.title}`}
                      cameraOrbit={card.cameraOrbit}
                      autoRotate={true}
                    />
                  </div>
                  <div className="flex flex-col gap-1 border-t border-black/30 px-3 py-2 md:gap-2 md:px-5">
                    <h3 className="flex-1 text-sm font-semibold md:text-base">
                      {card.title}
                    </h3>
                    <p className="pb-1 text-xs leading-relaxed md:pb-2 md:text-sm">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
