import Image from 'next/image';

import { Marquee } from '@/components/magicui/marquee';
import { listaClientes } from '@/lib/data/listaClientes';

const ClienteCard = ({ cliente }: { cliente: (typeof listaClientes)[number] }) => (
  <div className='group flex h-20 w-32 items-center justify-center transition-all duration-300 hover:scale-105'>
    <Image
      src={cliente.image}
      alt={cliente.name}
      className='z-10 h-full w-auto object-contain'
    />
  </div>
);

export default function MarqueeClientes() {
  const meio = Math.ceil(listaClientes.length / 2);
  const grupo1 = listaClientes.slice(0, meio);
  const grupo2 = listaClientes.slice(meio);

  return (
    <section className='relative flex h-auto w-full flex-col items-center justify-start overflow-hidden py-6 md:h-1/3'>
      <div className='relative w-full'>
        <Marquee pauseOnHover className='[--duration:60s] md:[--duration:50s]'>
          {grupo1.map((cliente) => (
            <ClienteCard key={cliente.id} cliente={cliente} />
          ))}
        </Marquee>
        <div className='from-background pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r to-transparent md:w-20'></div>
        <div className='from-background pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent md:w-20'></div>
      </div>

      <div className='relative w-full'>
        <Marquee
          reverse
          pauseOnHover
          className='[--duration:60s] md:[--duration:50s]'>
          {grupo2.map((cliente) => (
            <ClienteCard key={cliente.id} cliente={cliente} />
          ))}
        </Marquee>
        <div className='from-background pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r to-transparent md:w-20'></div>
        <div className='from-background pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent md:w-20'></div>
      </div>
    </section>
  );
}
