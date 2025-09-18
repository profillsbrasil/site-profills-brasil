import { Highlighter } from "@/components/magicui/highlighter";
import fabrica from "@/lib/images/carousel/sobre/fabrica.png";
import Image from "next/image";

export default function ProfillFabrica() {
  return (
    <section
      aria-labelledby="titulo-estrutura"
      className="flex h-full max-w-7xl flex-row-reverse items-center justify-center gap-10 py-20"
    >
      <Image
        src={fabrica}
        alt="Fábrica da Profills: parque industrial com CNC, corte e dobra de precisão"
        className="w-full rounded-sm lg:w-1/2"
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority
      />

      <div className="flex w-1/2 flex-col items-center gap-5">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-4xl font-bold"
        >
          <h2 id="titulo-estrutura">Conheça a Nossa Estrutura</h2>
        </Highlighter>

        <div className="flex flex-col gap-3 text-left leading-relaxed">
          <p className="text-lg">
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

          <p className="text-lg">
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

          <p className="text-lg">
            Produzimos internamente grande parte dos componentes e estruturas
            das máquinas, com controle de qualidade e{" "}
            <span className="text-accent font-semibold">
              mais consistência e padronização no resultado final
            </span>
            .
          </p>

          <ul className="list-disc pl-5 text-lg marker:text-[#2d62ef]">
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
