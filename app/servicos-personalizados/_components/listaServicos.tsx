import { GridPattern } from "@/components/layout/gridPatternBg";
import { Highlighter } from "@/components/magicui/highlighter";
import brindesCorporativos from "@/lib/images/extras/servicos/brindes-inox.jpg";
import cutelariaInox from "@/lib/images/extras/servicos/cutelaria-inox.jpg";
import pecasSobMedida from "@/lib/images/extras/servicos/especiais-02.jpg";
import projetosArquitetonicos from "@/lib/images/extras/servicos/outros-inox.jpg";
import Image from "next/image";

const listaServicos = [
  {
    id: "cutelaria-inox",
    image: cutelariaInox,
    title: "Cutelaria em Inox",
    description:
      "Cortes e dobras de alta precisão para produção de facas artesanais. Garantimos matéria-prima de qualidade e acabamento impecável, proporcionando peças funcionais, duráveis e com estética refinada.",
  },
  {
    id: "brindes-corporativos",
    image: brindesCorporativos,
    title: "Brindes Corporativos",
    description:
      "Personalize chaveiros, marcadores, suportes e outros itens exclusivos em inox. Brindes resistentes, elegantes e feitos sob medida para valorizar sua marca e encantar clientes e parceiros.",
  },
  {
    id: "projetos-arquitetonicos",
    image: pecasSobMedida,
    title: "Projetos Arquitetônicos",
    description:
      "Soluções em inox para transformar ambientes com modernidade e sofisticação. Realizamos desde detalhes estruturais até móveis personalizados, unindo design, precisão técnica e durabilidade.",
  },
  {
    id: "pecas-sob-medida",
    image: projetosArquitetonicos,
    title: "Peças Sob Medida",
    description:
      "Desenvolvemos peças personalizadas em inox para usos industriais, comerciais e decorativos. Cortes, dobras e soldas realizados com excelência, oferecendo versatilidade e qualidade em cada projeto.",
  },
];

export default function ListaServicos() {
  return (
    <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-4 py-8 md:gap-5 md:py-10">
      <div className="flex w-full flex-col items-start justify-start">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-2xl font-bold mb-3 md:text-3xl md:mb-2"
        >
          O que podemos fazer?
        </Highlighter>
        <p className="text-muted-foreground text-sm md:text-base">
          Conheça alguns dos nossos serviços personalizados
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {listaServicos.map((servico) => (
          <div
            id={servico.id}
            key={servico.id}
            className="bg-muted group z-10 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xs border border-black/10 p-4 shadow-xl shadow-black/10 transition-all duration-300 hover:bg-slate-50 hover:shadow-2xl md:gap-5 md:p-5"
          >
            <div className="relative flex h-48 w-full md:h-full">
              <GridPattern />
              <Image
                src={servico.image}
                alt={servico.title}
                className="z-10 h-full w-full rounded-xs object-fill transition-all duration-300 md:object-cover"
              />
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="mb-2 text-xl font-bold md:text-2xl">
                {servico.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                {servico.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
