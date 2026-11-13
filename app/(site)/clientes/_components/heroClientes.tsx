import { EntradaTopo } from '@/components/entradaTopo';

export default function HeroClientes() {
  return (
    <section className='relative z-10 flex w-full flex-col items-center justify-center px-4 pt-24 pb-10 text-center md:pt-28 md:pb-14'>
      <EntradaTopo>
        <h1 className='text-3xl font-bold tracking-tight text-foreground md:text-5xl'>
          Nossos Clientes
        </h1>
      </EntradaTopo>
      <EntradaTopo ordem={2}>
        <p className='mt-4 max-w-xl text-sm text-muted-foreground md:text-base'>
          As marcas que confiam na engenharia Profills para suas linhas de
          produção.
        </p>
      </EntradaTopo>
    </section>
  );
}
