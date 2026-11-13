'use client';

import { type RefObject, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { registrarLeadIndicacao } from '@/lib/analytics/indicacao';
import {
  type SpecificationFormData,
  specificationFormSchema
} from '@/lib/schemas/specification-form';
import { logger } from '@/lib/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';

import { Controller, Resolver, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { toast } from 'sonner';

export interface SpecificationFormProps {
  maquinaSlug: string;
  maquinaNome: string;
  // O Dialog desmonta o formulário ao fechar; o rascunho guarda o que foi digitado.
  rascunho: RefObject<Partial<SpecificationFormData>>;
  onFechar: () => void;
}

export default function SpecificationForm({
  maquinaSlug,
  maquinaNome,
  rascunho,
  onFechar
}: SpecificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    getValues
  } = useForm<SpecificationFormData>({
    resolver: zodResolver(
      specificationFormSchema
    ) as Resolver<SpecificationFormData>,
    defaultValues: {
      ...rascunho.current,
      maquinaSlug,
      maquinaNome
    }
  });

  useEffect(() => {
    return () => {
      rascunho.current = getValues();
    };
  }, [rascunho, getValues]);

  const onSubmit = async (data: SpecificationFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/specifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar solicitação');
      }

      const result = await response.json().catch(() => ({}));
      registrarLeadIndicacao(
        'especificacoes',
        result?.indicacao?.codigo ?? null
      );

      toast.success(
        <p className='font-bold'>Solicitação enviada com sucesso!</p>,
        {
          description: (
            <p className=''>
              Entraremos em contato em breve com as especificações da máquina.
            </p>
          )
        }
      );

      reset({ maquinaSlug, maquinaNome });
      onFechar();
    } catch (error) {
      logger.error('Erro ao enviar especificação:', error);

      toast.error(<p className='font-bold'>Erro ao enviar solicitação</p>, {
        description: <p>Tente novamente em alguns instantes.</p>
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-1'>
          <Label htmlFor='nome' className='text-sm font-medium text-slate-700'>
            Nome Completo *
          </Label>
          <Input
            id='nome'
            {...register('nome')}
            placeholder='Seu nome completo'
            className='focus:border-accent focus:ring-accent border-slate-300'
          />
          {errors.nome && (
            <p className='text-xs text-red-600'>{errors.nome.message}</p>
          )}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='email' className='text-sm font-medium text-slate-700'>
            E-mail *
          </Label>
          <Input
            id='email'
            type='email'
            {...register('email')}
            placeholder='seu@email.com'
            className='focus:border-accent focus:ring-accent border-slate-300'
          />
          {errors.email && (
            <p className='text-xs text-red-600'>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-1'>
          <Label
            htmlFor='telefone'
            className='text-sm font-medium text-slate-700'>
            Telefone *
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
                className='focus:border-accent focus:ring-accent border-slate-300'
              />
            )}
          />
          {errors.telefone && (
            <p className='text-xs text-red-600'>{errors.telefone.message}</p>
          )}
        </div>

        <div className='space-y-1'>
          <Label
            htmlFor='empresa'
            className='text-sm font-medium text-slate-700'>
            Empresa
          </Label>
          <Input
            id='empresa'
            {...register('empresa')}
            placeholder='Nome da sua empresa'
            className='focus:border-accent focus:ring-accent border-slate-300'
          />
          {errors.empresa && (
            <p className='text-xs text-red-600'>{errors.empresa.message}</p>
          )}
        </div>
      </div>

      <div className='space-y-1'>
        <Label
          htmlFor='observacoes'
          className='text-sm font-medium text-slate-700'>
          Observações Adicionais
        </Label>
        <Textarea
          id='observacoes'
          {...register('observacoes')}
          placeholder='Informações adicionais sobre sua necessidade...'
          rows={3}
          className='focus:border-accent border-slate-300'
        />
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onFechar}
          disabled={isSubmitting}
          className='text-slate-700 hover:text-slate-900'>
          Cancelar
        </Button>
        <Button
          type='submit'
          disabled={isSubmitting}
          className='bg-accent hover:bg-accent/85 text-white disabled:opacity-50'>
          {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
        </Button>
      </div>
    </form>
  );
}
