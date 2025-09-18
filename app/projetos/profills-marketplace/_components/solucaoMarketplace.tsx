import { AnimatedContainer } from "@/components/AnimatedContainer";
import {
  CreditCard,
  Globe,
  Package,
  Shield,
  Smartphone,
  Star,
  Truck,
  Users,
} from "lucide-react";

export default function SolucaoMarketplace() {
  const solucoes = [
    {
      icon: Globe,
      title: "Inserção Digital",
      description:
        "Levar empreendedores e empresas para o mercado digital com facilidade",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description:
        "Transações seguras com o auxílio do Profills Bank em questões financeiras",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Smartphone,
      title: "Mobile Commerce",
      description:
        "Compras pelo celular ou computador de forma totalmente intuitiva",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Truck,
      title: "Logística Integrada",
      description:
        "Processo completo incluindo logística e entrega no prazo estipulado",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Users,
      title: "Hub de Negócios",
      description:
        "Conexões e parcerias estratégicas entre produtores, distribuidores e consumidores",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Star,
      title: "Melhores Fornecedores",
      description:
        "Carteira vasta de clientes permite agregar os melhores do mercado",
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <section className="w-full max-w-6xl pt-5 pb-10">
      <AnimatedContainer>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            A Solução:{" "}
            <span className="text-[#2d62ef]">Profills Marketplace</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Os marketplaces favorecem tanto o vendedor quanto o comprador,
            diminuindo as distâncias, inserindo empreendedores no mercado
            digital e agregando comodidade, segurança e facilidade
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solucoes.map((solucao, index) => {
            const IconComponent = solucao.icon;
            return (
              <div
                key={index}
                className="group rounded-md border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${solucao.color} transition-all duration-300 group-hover:scale-110`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {solucao.title}
                </h3>
                <p className="text-gray-600">{solucao.description}</p>
              </div>
            );
          })}
        </div>

        {/* Process Flow */}
        <div className="p-8">
          <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Como Funciona o Marketplace
          </h3>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                <Package className="h-8 w-8" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Encontre Produtos
              </h4>
              <p className="text-sm text-gray-600">
                Produtores dos mais diversos nichos em uma plataforma única
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
                <CreditCard className="h-8 w-8" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Compre Seguro
              </h4>
              <p className="text-sm text-gray-600">
                Transações protegidas pelo Profills Bank com total segurança
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white">
                <Truck className="h-8 w-8" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Receba em Casa
              </h4>
              <p className="text-sm text-gray-600">
                Logística integrada garante entrega no prazo estipulado
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-white">
                <Users className="h-8 w-8" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Construa Parcerias
              </h4>
              <p className="text-sm text-gray-600">
                Conexões estratégicas que constituem um hub de negócios
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 rounded-md bg-slate-900 p-8 text-center text-white">
          <h3 className="mb-4 text-2xl font-bold">Mais que Compra e Venda</h3>
          <p className="mb-6 text-lg">
            Profills Marketplace envolve conexões e parcerias estratégicas que
            constituirão um hub de negócios, ligando produtores locais,
            distribuidores, consumidores e comércios
          </p>
        </div>
      </AnimatedContainer>
    </section>
  );
}
