'use client';

import { useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import type { SpecificationFormData } from '@/lib/schemas/specification-form';
import { cn } from '@/lib/utils';

// zod, react-hook-form e a máscara só baixam quando o visitante mostra
// intenção de abrir o modal (hover ou foco no botão) ou quando ele abre.
const carregarFormulario = () => import('./specificationForm');
const SpecificationForm = dynamic(() => import('./specificationForm'), {
  // Reserva a altura do formulário enquanto o chunk não chega.
  loading: () => <div aria-busy='true' className='h-[450px] md:h-[308px]' />
});

interface SpecificationModalProps {
  maquinaSlug: string;
  maquinaNome: string;
  triggerClassName?: string;
}

export default function SpecificationModal({
  maquinaSlug,
  maquinaNome,
  triggerClassName
}: SpecificationModalProps) {
  const [open, setOpen] = useState(false);
  const rascunho = useRef<Partial<SpecificationFormData>>({});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onPointerEnter={() => void carregarFormulario()}
          onFocus={() => void carregarFormulario()}
          className={cn(
            'bg-accent hover:bg-accent/85 h-12 rounded-xs px-6 font-semibold text-white',
            triggerClassName
          )}>
          Solicitar proposta técnica e comercial
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-900'>
            Solicitar proposta técnica e comercial
          </DialogTitle>
          <DialogDescription className='text-slate-600'>
            Preencha os dados abaixo para receber a proposta da máquina{' '}
            <span className='text-accent font-semibold'>{maquinaNome}</span>
          </DialogDescription>
        </DialogHeader>

        <SpecificationForm
          maquinaSlug={maquinaSlug}
          maquinaNome={maquinaNome}
          rascunho={rascunho}
          onFechar={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
