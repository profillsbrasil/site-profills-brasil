'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  type MonteFabricaFormData,
  monteFabricaFormSchema
} from '@/lib/schemas/monte-fabrica-form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { ArrowRight } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { toast } from 'sonner';

const campoClasses =
  'h-11 rounded-xs border border-[rgba(148,178,235,0.25)] bg-slate-900/60 text-base text-white placeholder:text-muted-foreground/60 focus-visible:border-accent/80 focus-visible:ring-0';

const labelClasses =
  'font-mono text-[13px] tracking-wider text-muted-foreground/70 uppercase';

export function FormOrcamento() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<MonteFabricaFormData>({
    resolver: zodResolver(monteFabricaFormSchema)
  });

  const onSubmit = async (data: MonteFabricaFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/monte-fabrica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao enviar solicitação');
      }

      toast.success('Solicitação enviada com sucesso!', {
        description:
          'Entraremos em contato em breve para elaborar seu projeto de fábrica personalizada.',
        duration: 5000
      });

      reset();
    } catch (error) {
      toast.error('Erro ao enviar solicitação', {
        description:
          error instanceof Error
            ? error.message
            : 'Tente novamente em alguns instantes.',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-1.5'>
          <Label htmlFor='nome' className={labelClasses}>
            Nome completo
          </Label>
          <Input
            id='nome'
            {...register('nome')}
            className={campoClasses}
            placeholder='Seu nome completo'
          />
          {errors.nome && (
            <p className='text-sm text-red-400'>{errors.nome?.message}</p>
          )}
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='empresa' className={labelClasses}>
            Empresa
          </Label>
          <Input
            id='empresa'
            {...register('empresa')}
            className={campoClasses}
            placeholder='Nome da sua empresa'
          />
          {errors.empresa && (
            <p className='text-sm text-red-400'>{errors.empresa?.message}</p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-1.5'>
          <Label htmlFor='email' className={labelClasses}>
            E-mail
          </Label>
          <Input
            id='email'
            type='email'
            {...register('email')}
            className={campoClasses}
            placeholder='seu@email.com'
          />
          {errors.email && (
            <p className='text-sm text-red-400'>{errors.email?.message}</p>
          )}
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='telefone' className={labelClasses}>
            Telefone
          </Label>
          <Controller
            name='telefone'
            control={control}
            render={({ field }) => (
              <IMaskInput
                id='telefone'
                mask={['(00) 0000-0000', '(00) 00000-0000']}
                value={field.value as unknown as string}
                onAccept={(val: unknown) => field.onChange(String(val))}
                placeholder='(11) 99999-9999'
                type='tel'
                inputMode='numeric'
                className={cn(
                  'w-full px-3 focus:outline-none',
                  campoClasses,
                  errors.telefone && 'border-red-500'
                )}
              />
            )}
          />
          {errors.telefone && (
            <p className='text-sm text-red-400'>{errors.telefone?.message}</p>
          )}
        </div>
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='mensagem' className={labelClasses}>
          Conte-nos sobre seu projeto
        </Label>
        <Textarea
          id='mensagem'
          {...register('mensagem')}
          className={cn(campoClasses, 'h-auto min-h-[110px]')}
          placeholder='Descreva o tipo de fábrica que deseja montar, produtos que irá processar, capacidade de produção desejada...'
        />
        {errors.mensagem && (
          <p className='text-sm text-red-400'>{errors.mensagem?.message}</p>
        )}
      </div>

      <Button
        type='submit'
        disabled={isSubmitting}
        className='bg-accent hover:bg-accent/85 h-12 w-full rounded-xs text-base font-semibold text-white'>
        {isSubmitting ? (
          'Enviando...'
        ) : (
          <>
            Solicitar orçamento
            <ArrowRight className='ml-2 h-4 w-4' />
          </>
        )}
      </Button>
    </form>
  );
}
