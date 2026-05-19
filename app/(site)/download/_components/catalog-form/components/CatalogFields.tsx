'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type CatalogRequestData } from '@/lib/schemas/catalog-request';
import { cn } from '@/lib/utils';

import { motion } from 'motion/react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { IMaskInput } from 'react-imask';

interface CatalogFieldsProps {
  control: Control<CatalogRequestData>;
  errors: FieldErrors<CatalogRequestData>;
}

const fieldClass =
  '!bg-white/5 !border-white/15 !text-slate-100 placeholder:!text-slate-400 focus-visible:!ring-2 focus-visible:!ring-blue-400/40';

const maskedInputClass =
  'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm';

export function CatalogFields({ control, errors }: CatalogFieldsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className='w-full space-y-5'>
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-bold text-white sm:text-3xl'>
          Catálogo Profills
        </h1>
        <p className='text-sm text-slate-300'>
          Preencha seus dados e receba o catálogo completo no seu email.
        </p>
      </div>

      <div className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='name' className='text-slate-200'>
            Nome ou Empresa *
          </Label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id='name'
                placeholder='João Silva ou Indústria XYZ Ltda'
                className={cn(
                  fieldClass,
                  errors.name && '!border-red-400/70'
                )}
              />
            )}
          />
          {errors.name && (
            <p className='text-xs text-red-300'>{errors.name.message}</p>
          )}
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='document' className='text-slate-200'>
            CPF ou CNPJ *
          </Label>
          <Controller
            name='document'
            control={control}
            render={({ field }) => (
              <IMaskInput
                id='document'
                mask={[
                  { mask: '000.000.000-00', maxLength: 11 },
                  { mask: '00.000.000/0000-00' }
                ]}
                value={field.value as unknown as string}
                onAccept={(val: unknown) => field.onChange(String(val))}
                placeholder='000.000.000-00 ou 00.000.000/0000-00'
                inputMode='numeric'
                className={cn(
                  maskedInputClass,
                  fieldClass,
                  errors.document && '!border-red-400/70'
                )}
              />
            )}
          />
          {errors.document && (
            <p className='text-xs text-red-300'>{errors.document.message}</p>
          )}
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='phone' className='text-slate-200'>
            Telefone *
          </Label>
          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <IMaskInput
                id='phone'
                mask={['(00) 0000-0000', '(00) 00000-0000']}
                value={field.value as unknown as string}
                onAccept={(val: unknown) => field.onChange(String(val))}
                placeholder='(11) 99999-9999'
                type='tel'
                inputMode='numeric'
                className={cn(
                  maskedInputClass,
                  fieldClass,
                  errors.phone && '!border-red-400/70'
                )}
              />
            )}
          />
          {errors.phone && (
            <p className='text-xs text-red-300'>{errors.phone.message}</p>
          )}
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='email' className='text-slate-200'>
            E-mail *
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id='email'
                type='email'
                placeholder='seu@email.com'
                className={cn(
                  fieldClass,
                  errors.email && '!border-red-400/70'
                )}
              />
            )}
          />
          {errors.email && (
            <p className='text-xs text-red-300'>{errors.email.message}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
