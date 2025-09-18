import { Highlighter } from "@/components/magicui/highlighter";
export default function TecnologiaDbaas() {
  return (
    <section
      aria-labelledby="titulo-tecnologia"
      className="flex h-full w-full max-w-6xl items-center justify-center gap-10 py-16"
    >
      <div className="flex w-1/2 flex-col items-start gap-6">
        <Highlighter
          action="underline"
          color="#2d62ef"
          animationDuration={4000}
          textColor="text-3xl font-bold"
        >
          <h2 id="titulo-tecnologia">Tecnologia DBaaS</h2>
        </Highlighter>

        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          <p>
            A Profills Bank possui{" "}
            <span className="text-accent font-semibold">
              tecnologia própria de sistemas DBaaS
            </span>{" "}
            (Digital Banking as a Service), sendo uma empresa provedora de{" "}
            <span className="text-accent font-semibold">
              serviços e soluções para bancos digitais
            </span>{" "}
            e plataformas financeiras.
          </p>

          <p>
            Além de criar um{" "}
            <span className="text-accent font-semibold">
              novo espaço no mercado financeiro
            </span>
            , buscamos reforçar os conceitos de{" "}
            <span className="text-accent font-semibold">
              boa experiência, segurança, agilidade, rapidez e conectividade
            </span>{" "}
            no mundo das finanças.
          </p>
        </div>

        <ul className="list-disc pl-5 text-lg marker:text-[#2d62ef]">
          <li>Digital Banking as a Service (DBaaS)</li>
          <li>Tecnologia própria e inovadora</li>
          <li>Atuação em diversos segmentos</li>
          <li>Foco em experiência e conectividade</li>
        </ul>
      </div>

      <div className="z-10 flex w-1/2 flex-col gap-6">
        <div className="rounded-md border border-[#2d62ef]/20 bg-gradient-to-br from-[#2d62ef]/10 to-blue-100 p-8 shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-[#2d62ef]">
            Nossa Missão
          </h3>
          <p className="text-lg leading-relaxed">
            Apresentar um{" "}
            <span className="text-accent font-semibold">
              serviço financeiro acessível
            </span>
            , para que os clientes não se preocupem com{" "}
            <span className="text-accent font-semibold">
              tarifas e taxas da rede bancária tradicional
            </span>
            .
          </p>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-md">
          <h4 className="mb-3 text-lg font-semibold text-gray-800 backdrop-blur-md">
            Serviços Oferecidos
          </h4>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
              Gestão de contas de pagamentos
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
              Emissões de cartões
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
              Intermediação de pagamentos
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#2d62ef]"></div>
              Soluções para pequenas empresas
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
