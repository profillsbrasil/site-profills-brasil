'use client';

import { useEffect, useRef } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContactFormData } from '@/lib/schemas/contact-form';
import { cn } from '@/lib/utils';

import { motion } from 'motion/react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface FormStep2Props {
  control: Control<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
}

export function FormStep2({ control, errors }: FormStep2Props) {
  const numberInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus no campo número quando o componente é montado
  useEffect(() => {
    const timer = setTimeout(() => {
      numberInputRef.current?.focus();
    }, 300); // Pequeno delay para garantir que a animação termine

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='z-10 space-y-6'>
      <div className='space-y-2 text-center'>
        <h2 className='text-3xl font-bold'>Endereço</h2>
        <p className='text-muted-foreground'>
          Complete os dados do seu endereço
        </p>
      </div>

      <div className='z-10 w-full space-y-4 md:min-w-[450px]'>
        {/* Rua */}
        <div className='z-10 space-y-2'>
          <Label htmlFor='street'>Rua/Logradouro</Label>
          <Controller
            name='street'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id='street'
                placeholder='Rua das Flores'
                disabled
                className='!bg-muted text-muted-foreground disabled:opacity-80'
              />
            )}
          />
        </div>

        {/* Número e Complemento */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='number'>Número *</Label>
            <Controller
              name='number'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  ref={numberInputRef}
                  id='number'
                  type='number'
                  placeholder='Digite o número'
                  className={cn(
                    '!bg-muted',
                    errors.number
                      ? 'border-red-500 focus-visible:ring-red-500/20'
                      : ''
                  )}
                />
              )}
            />
            {errors.number && (
              <p className='text-sm text-red-500'>{errors.number.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='complement'>Complemento</Label>
            <Controller
              name='complement'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id='complement'
                  placeholder='Digite o complemento'
                  className='!bg-muted'
                />
              )}
            />
          </div>
        </div>

        {/* Bairro */}
        <div className='space-y-2'>
          <Label htmlFor='neighborhood'>Bairro</Label>
          <Controller
            name='neighborhood'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id='neighborhood'
                placeholder='Centro'
                disabled
                className='!bg-muted text-muted-foreground disabled:opacity-80'
              />
            )}
          />
        </div>

        {/* Cidade e Estado */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='city'>Cidade *</Label>
            <Controller
              name='city'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id='city'
                  placeholder='São Paulo'
                  disabled
                  className={cn(
                    '!bg-muted text-muted-foreground disabled:opacity-80',
                    errors.city
                      ? 'border-red-500 focus-visible:ring-red-500/20'
                      : ''
                  )}
                />
              )}
            />
            {errors.city && (
              <p className='text-sm text-red-500'>{errors.city.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='state'>Estado *</Label>
            <Controller
              name='state'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id='state'
                  placeholder='SP'
                  disabled
                  className={cn(
                    '!bg-muted text-muted-foreground disabled:opacity-80',
                    errors.state
                      ? 'border-red-500 focus-visible:ring-red-500/20'
                      : ''
                  )}
                />
              )}
            />
            {errors.state && (
              <p className='text-sm text-red-500'>{errors.state.message}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
