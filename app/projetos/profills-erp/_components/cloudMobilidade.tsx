import { AnimatedContainer } from "@/components/AnimatedContainer";

export default function CloudMobilidade() {
  return (
    <section
      aria-labelledby="titulo-cloud"
      className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-16 py-10"
    >
      {/* Final Call to Action */}
      <AnimatedContainer className="w-full">
        <div className="rounded-md bg-slate-900 p-8 text-center text-white shadow-xl">
          <h3 className="mb-4 text-3xl font-bold">
            Controle Total do Seu Negócio
          </h3>
          <p className="mx-auto mb-6 max-w-4xl text-xl leading-relaxed">
            Com o Profills ERP, nossos clientes poderão{" "}
            <span className="text-accent font-semibold">
              controlar suas finanças e produção
            </span>{" "}
            a qualquer momento, em qualquer lugar, através da internet.
          </p>
          <div className="rounded-md bg-white/20 p-6 backdrop-blur-sm">
            <p className="text-lg font-medium">
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
