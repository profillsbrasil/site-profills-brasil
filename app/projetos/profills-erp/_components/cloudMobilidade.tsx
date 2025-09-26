import { AnimatedContainer } from "@/components/AnimatedContainer";

export default function CloudMobilidade() {
  return (
    <section
      aria-labelledby="titulo-cloud"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-8 py-8 md:gap-16 md:py-10"
    >
      {/* Final Call to Action */}
      <AnimatedContainer className="w-full">
        <div className="rounded-xs bg-slate-900 p-6 text-center text-white shadow-xl md:p-8">
          <h3 className="mb-4 text-2xl font-bold md:text-3xl">
            Controle Total do Seu Negócio
          </h3>
          <p className="mx-auto mb-6 max-w-4xl text-base leading-relaxed md:text-xl">
            Com o Profills ERP, nossos clientes poderão{" "}
            <span className="text-accent font-semibold">
              controlar suas finanças e produção
            </span>{" "}
            a qualquer momento, em qualquer lugar, através da internet.
          </p>
          <div className="rounded-xs bg-white/20 p-4 backdrop-blur-sm md:p-6">
            <p className="text-base font-medium md:text-lg">
              Um sistema de gestão integrado permite que{" "}
              <span className="text-accent font-bold">
                mais tempo seja usado no que realmente importa
              </span>
              :<br />
              <span className="font-bold">Melhores produtos, mais vendas</span>.
            </p>
          </div>
        </div>
      </AnimatedContainer>
    </section>
  );
}
