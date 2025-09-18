import { AnimatedContainer } from "@/components/AnimatedContainer";
import imgBank from "@/lib/images/projetos/Bank.jpg";
import { Building2, CreditCard, Globe, Shield } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      aria-labelledby="titulo-profills-bank"
      className="flex min-h-[93vh] w-full max-w-6xl flex-col items-center justify-evenly"
    >
      {" "}
      <AnimatedContainer className="w-full">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image
            src={imgBank}
            loading="eager"
            alt="Profills Bank - Soluções Financeiras Digitais"
            className="z-10 h-full w-full rounded-md object-contain shadow-xl"
          />
        </div>
      </AnimatedContainer>
      <div className="flex h-full w-full flex-col items-center gap-10">
        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          <p>
            A <span className="text-accent font-semibold">Profills Bank</span> é
            uma empresa privada que atua na comercialização de{" "}
            <span className="text-accent font-semibold">
              serviços financeiros digitais
            </span>
            , buscando ser mais acessível em relação aos serviços bancários
            tradicionais.
          </p>

          <p>
            Atuamos como{" "}
            <span className="text-accent font-semibold">
              intermediadora com parceiros homologados
            </span>{" "}
            perante o Banco Central, fornecendo sistemas e serviços financeiros
            para a{" "}
            <span className="text-accent font-semibold">
              gestão de contas de pagamentos
            </span>
            .
          </p>
        </div>

        {/* Features Cards */}
        <AnimatedContainer className="w-full">
          <div className="grid w-full grid-cols-4 gap-5">
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Shield className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Segurança</h3>
                <p className="text-xs text-gray-600">Proteção de dados</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Globe className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Digital</h3>
                <p className="text-xs text-gray-600">Banco 100% digital</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <CreditCard className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">Pagamentos</h3>
                <p className="text-xs text-gray-600">Gestão completa</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 rounded-md border border-gray-200 bg-white/80 p-4 shadow-xl backdrop-blur-md hover:shadow-md">
              <Building2 className="h-8 w-8 text-[#2d62ef] transition-all duration-300 group-hover:scale-105" />
              <div>
                <h3 className="text-sm font-semibold">B2B & B2C</h3>
                <p className="text-xs text-gray-600">Empresas e pessoas</p>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
