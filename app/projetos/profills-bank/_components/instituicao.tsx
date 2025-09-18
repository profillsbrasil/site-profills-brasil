import { Highlighter } from "@/components/magicui/highlighter";
export default function Instituicao() {
  return (
    <section
      aria-labelledby="titulo-regulacao"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-10 py-16"
    >
      <Highlighter
        action="underline"
        color="#2d62ef"
        animationDuration={4000}
        textColor="text-3xl font-bold text-center"
      >
        <h2 id="titulo-regulacao">
          Instituição Financeira Digital Regulamentada
        </h2>
      </Highlighter>

      <div className="flex w-full gap-10">
        <div className="text-md flex w-1/2 flex-col gap-4 leading-relaxed">
          <p>
            A Profills Bank foi desenvolvida como uma{" "}
            <span className="text-accent font-semibold">
              instituição financeira digital
            </span>{" "}
            e, por sua natureza, segue todas as{" "}
            <span className="text-accent font-semibold">
              diretrizes que regulam essas operações em aspecto global
            </span>
            .
          </p>

          <p>
            Desde o início, a preocupação foi desenvolver um{" "}
            <span className="text-accent font-semibold">
              modelo de negócios baseado nos termos de Instituições Financeiras
              Digitais
            </span>
            , tendo sido feita a estruturação das operações com base no{" "}
            <span className="text-accent font-semibold">
              atendimento inicial de pessoa jurídica (B2B)
            </span>
            , e consequentemente, da{" "}
            <span className="text-accent font-semibold">
              pessoa física atrelada a estas operações comerciais (B2C)
            </span>
            .
          </p>
        </div>

        <div className="text-md flex w-1/2 flex-col gap-4 leading-relaxed">
          <p>
            Sabemos que a{" "}
            <span className="text-accent font-semibold">
              geração de renda está diretamente ligada à geração de emprego
            </span>{" "}
            em qualquer parte do mundo, e que estes empregos são gerados pelo{" "}
            <span className="text-accent font-semibold">
              empreendedorismo, pelas empresas que acreditam naquele mercado
            </span>
            , investem em tecnologias e que fazem a ligação entre o consumidor e
            o fornecedor.
          </p>

          <p>
            Neste cenário, a Profills Bank vem para{" "}
            <span className="text-accent font-semibold">
              impulsionar estas relações entre empresa e cliente
            </span>
            , tornando os produtos e serviços{" "}
            <span className="text-accent font-semibold">
              mais acessíveis e com um custo de operação menor
            </span>
            , se comparado às instituições tradicionais.
          </p>
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="mt-8 grid w-full max-w-5xl grid-cols-3 gap-8">
        <div className="flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-3 text-center shadow-md backdrop-blur-sm">
          <div className="mb-2 text-3xl font-bold text-[#2d62ef]">100%</div>
          <div className="text-gray-600">Digital</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-3 text-center shadow-md backdrop-blur-sm">
          <div className="mb-2 text-3xl font-bold text-[#2d62ef]">
            B2B + B2C
          </div>
          <div className="text-gray-600">Atendimento</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-3 text-center shadow-md backdrop-blur-sm">
          <div className="mb-2 text-3xl font-bold text-[#2d62ef]">DBaaS</div>
          <div className="text-gray-600">Tecnologia Própria</div>
        </div>
      </div>
    </section>
  );
}
