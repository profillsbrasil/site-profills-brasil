import { Highlighter } from "@/components/magicui/highlighter";
import fabrica from "@/lib/images/carousel/sobre/fabrica.png";
import Image from "next/image";

export default function ProfillFabrica() {
  return (
    <section
      aria-labelledby="titulo-estrutura"
      className="flex h-full max-w-7xl flex-col items-center justify-center gap-6 py-12 md:flex-row-reverse md:gap-10 md:py-20"
    >
      <Image
        src={fabrica}
        alt="Fábrica da Profills: parque industrial com CNC, corte e dobra de precisão"
        className="h-48 w-full rounded-xs object-cover object-bottom md:h-auto md:w-1/2 md:object-contain"
        sizes="(min-width: 768px) 50vw, 100vw"
        priority
      />

      <div className="flex w-full flex-col items-center gap-4 md:w-1/2 md:gap-5">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-2xl font-bold md:text-4xl"
        >
          <h2 id="titulo-estrutura">Conheça a Nossa Estrutura</h2>
        </Highlighter>

        <div className="flex flex-col gap-3 text-left leading-relaxed">
          <p className="text-sm md:text-lg">
            Para garantir{" "}
            <span className="text-accent font-semibold">
              qualidade e inovação
            </span>{" "}
            , a Profills possui fábrica própria. A matriz está em{" "}
            <span className="text-accent font-semibold">Curitiba (PR)</span> e a
            unidade fabril em{" "}
            <span className="text-accent font-semibold">
              Cerqueira César (SP)
            </span>
            . Cerqueira César (SP).
          </p>

          <p className="text-sm md:text-lg">
            Nosso{" "}
            <span className="text-accent font-semibold">
              parque industrial{" "}
            </span>{" "}
            reúne CNC de corte e dobra e usinagem de precisão para aço inox e
            outros materiais. A engenharia de produto atua integrada à produção,
            acelerando{" "}
            <span className="text-accent font-semibold">
              protótipos, testes e validações
            </span>
            .
          </p>

          <p className="text-sm md:text-lg">
            Produzimos internamente grande parte dos componentes e estruturas
            das máquinas, com controle de qualidade e{" "}
            <span className="text-accent font-semibold">
              mais consistência e padronização no resultado final
            </span>
            .
          </p>

          <ul className="list-disc pl-5 text-sm marker:text-[#2d62ef] md:text-lg">
            <li>CNC de corte e dobra de alta precisão</li>
            <li>Usinagem e processos para aço inox e outros materiais</li>
            <li>Produção interna de componentes e estruturas</li>
            <li>Projetos e layouts especiais sob medida</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
