import { Globe } from "@/components/magicui/globe";
import { Highlighter } from "@/components/magicui/highlighter";
import logo from "@/public/logo.png";
import Image from "next/image";

export default function ProfillHistoria() {
  return (
    <section
      aria-labelledby="titulo-historia"
      className="flex h-full w-full max-w-7xl items-center justify-center gap-5 pb-10"
    >
      {/* Visual: globo + marca */}
      <div className="relative flex h-full w-1/2 select-none">
        <Globe className="absolute top-1/2 left-1/2 h-fit w-full -translate-x-1/2 -translate-y-1/2" />
        <Image
          src={logo}
          alt="Nossa História"
          className="absolute top-1/2 left-1/2 h-fit w-3/4 -translate-x-1/2 -translate-y-1/2 select-none"
        />
        <h1 className="absolute top-5 left-2/3 w-full -translate-x-1/3 text-2xl font-bold tracking-wider">
          Embalando o Mundo!
        </h1>
      </div>

      {/* Texto */}
      <div className="flex w-1/2 flex-col items-center gap-5">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-4xl font-bold"
        >
          <h2 id="titulo-historia">Nossa História</h2>
        </Highlighter>

        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          <p>
            Desde a fundação em Curitiba (PR), há mais de uma década, a{" "}
            <span className="text-accent font-semibold">Profills</span>{" "}
            desenvolve{" "}
            <span className="text-accent font-semibold">
              máquinas envasadoras
            </span>{" "}
            para produtos líquidos, pastosos e sólidos. Nascemos para oferecer
            soluções modernas de envase em um mercado que exigia{" "}
            <span className="text-accent font-semibold">
              fornecedores especializados
            </span>{" "}
            no Brasil e no exterior.
          </p>

          <p>
            Ao longo dos anos, tornamo-nos{" "}
            <span className="text-accent font-semibold">
              referência nacional
            </span>{" "}
            pela qualidade dos equipamentos e pela{" "}
            <span className="text-accent font-semibold">
              proximidade com o cliente
            </span>
            . Com engenharia e P&amp;D próprios,{" "}
            <span className="text-accent font-semibold">
              antecipamos tendências
            </span>{" "}
            em embalagens e automação, elevando eficiência, higiene e
            conformidade nas linhas de envase.
          </p>

          <p>
            Nossa trajetória é sustentada por{" "}
            <span className="text-accent font-semibold">fábrica própria</span> —
            com unidade em Cerqueira César (SP) — e por uma cultura de melhoria
            contínua. Produção interna, testes rigorosos e padronização garantem
            <span className="text-accent font-semibold">
              {" "}
              entregas confiáveis
            </span>{" "}
            e{" "}
            <span className="text-accent font-semibold">
              resultados consistentes
            </span>{" "}
            em diferentes segmentos.
          </p>

          <ul className="mt-2 flex list-disc flex-col gap-1 pl-8 marker:text-[#2d62ef]">
            <li> Inovação aplicada ao dia a dia da produção</li>
            <li> Qualidade e padronização em série</li>
            <li> Projetos sob medida para cada produto</li>
            <li> Suporte técnico próximo e contínuo</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
