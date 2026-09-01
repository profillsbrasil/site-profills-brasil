'use client';

import { useState } from 'react';

import Image from 'next/image';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { Highlighter } from '@/components/magicui/highlighter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import imgFabricaCompleta from '@/lib/images/extras/FabricaRemderNewB.png';
import {
  type MonteFabricaFormData,
  monteFabricaFormSchema
} from '@/lib/schemas/monte-fabrica-form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { ArrowRight, Building2, Mail, Phone, User } from 'lucide-react';
import { motion } from 'motion/react';
import { Controller, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { toast } from 'sonner';

export default function FormularioMontarFabrica() {
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
      console.log('Enviando dados do formulário:', data);

      const response = await fetch('/api/monte-fabrica', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao enviar solicitação');
      }

      console.log('✅ Solicitação enviada com sucesso:', result);

      toast.success('Solicitação enviada com sucesso!', {
        description:
          'Entraremos em contato em breve para elaborar seu projeto de fábrica personalizada.',
        duration: 5000
      });

      reset();
    } catch (error) {
      console.error('❌ Erro ao enviar solicitação:', error);

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
    <div className='relative min-h-screen w-full bg-slate-900'>
      <GridPattern />

      {/* Container principal */}
      <div className='relative z-10 flex min-h-screen flex-col'>
        {/* Título principal - Responsivo */}
        <div className='absolute top-20 z-10 flex w-full justify-center px-4 md:top-28'>
          <h1 className='text-center'>
            <Highlighter
              action='underline'
              animationDuration={4000}
              textColor='text-2xl font-bold tracking-wider text-white uppercase md:text-3xl'>
              Monte sua Fábrica
            </Highlighter>
          </h1>
        </div>

        {/* Primeira seção - Layout responsivo */}
        <div className='flex w-full flex-col items-center justify-center px-4 pt-28 md:flex-row md:pt-20'>
          {/* Imagem - Mobile primeiro */}
          <div className='mb-6 h-full w-full md:mb-0 md:w-2/3'>
            <Image
              src={imgFabricaCompleta}
              loading='eager'
              alt='Monte sua fábrica'
              className='h-full w-full object-contain'
            />
          </div>

          {/* Texto explicativo - Mobile primeiro */}
          <div className='z-20 h-full w-full md:w-1/3 md:pr-10'>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='border-border/20 flex flex-col items-start justify-center rounded-xs border border-dashed bg-slate-900 p-4 shadow-xl shadow-black/10 md:p-5'>
              <h2 className='mb-3 text-xl font-bold text-white md:mb-4 md:text-3xl'>
                Como funciona?
              </h2>
              <p className='mb-2 text-xs leading-relaxed text-white md:mb-3 md:text-base'>
                Nossa equipe acompanha todo o processo: do{' '}
                <span className='text-accent font-semibold'>
                  planejamento do seu projeto
                </span>{' '}
                até a{' '}
                <span className='text-accent font-semibold'>
                  instalação das máquinas
                </span>
                .
              </p>
              <p className='text-xs leading-relaxed text-white md:text-base'>
                Fornecemos{' '}
                <span className='text-accent font-semibold'>
                  consultoria técnica
                </span>
                , <span className='text-accent font-semibold'>fabricação</span>{' '}
                e <span className='text-accent font-semibold'>suporte</span>: um
                atendimento completo e personalizado para{' '}
                <span className='text-accent font-semibold'>o seu negócio</span>
                .
              </p>
            </motion.div>
          </div>
        </div>
        {/* Segunda seção - Formulário e informações */}
        <div className='flex flex-1 items-center justify-center px-4 py-8 md:px-8 md:py-16'>
          <div className='relative mx-auto w-full max-w-7xl'>
            <div className='flex flex-col gap-6 md:flex-row md:gap-12'>
              {/* Coluna do formulário */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='w-full md:w-1/2'>
                <div className='border-border/20 flex h-full flex-col justify-between rounded-xs border border-dashed bg-slate-900/80 p-4 shadow-xl backdrop-blur md:p-6'>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-3 md:space-y-4'>
                    <div className='mb-4 flex items-center gap-2 md:mb-6 md:gap-3'>
                      <Building2 className='text-accent h-5 w-5 md:h-6 md:w-6' />
                      <h2 className='text-lg font-bold text-white md:text-2xl'>
                        Solicite seu Orçamento
                      </h2>
                    </div>
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4'>
                      <div className='space-y-1 md:space-y-2'>
                        <Label
                          htmlFor='nome'
                          className='flex items-center gap-1 text-sm text-white md:gap-2 md:text-base'>
                          <User className='h-3 w-3 md:h-4 md:w-4' />
                          Nome completo
                        </Label>
                        <Input
                          id='nome'
                          {...register('nome')}
                          className='border-border/20 focus:ring-accent/80 placeholder:text-muted-foreground h-10 rounded-xs border !bg-slate-900/80 text-sm text-white md:h-11 md:text-base'
                          placeholder='Seu nome completo'
                        />
                        {errors.nome && (
                          <p className='mt-1 text-xs text-red-400 md:text-sm'>
                            {errors.nome?.message}
                          </p>
                        )}
                      </div>

                      <div className='space-y-1 md:space-y-2'>
                        <Label
                          htmlFor='empresa'
                          className='flex items-center gap-1 text-sm text-white md:gap-2 md:text-base'>
                          <Building2 className='h-3 w-3 md:h-4 md:w-4' />
                          Empresa
                        </Label>
                        <Input
                          id='empresa'
                          {...register('empresa')}
                          className='border-border/20 focus:ring-accent/80 placeholder:text-muted-foreground h-10 rounded-xs border !bg-slate-900/80 text-sm text-white md:h-11 md:text-base'
                          placeholder='Nome da sua empresa'
                        />
                        {errors.empresa && (
                          <p className='mt-1 text-xs text-red-400 md:text-sm'>
                            {errors.empresa?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4'>
                      <div className='space-y-1 md:space-y-2'>
                        <Label
                          htmlFor='email'
                          className='flex items-center gap-1 text-sm text-white md:gap-2 md:text-base'>
                          <Mail className='h-3 w-3 md:h-4 md:w-4' />
                          E-mail
                        </Label>
                        <Input
                          id='email'
                          type='email'
                          {...register('email')}
                          className='border-border/20 focus:ring-accent/80 placeholder:text-muted-foreground h-10 rounded-xs border !bg-slate-900/80 text-sm text-white md:h-11 md:text-base'
                          placeholder='seu@email.com'
                        />
                        {errors.email && (
                          <p className='mt-1 text-xs text-red-400 md:text-sm'>
                            {errors.email?.message}
                          </p>
                        )}
                      </div>

                      <div className='space-y-1 md:space-y-2'>
                        <Label
                          htmlFor='telefone'
                          className='flex items-center gap-1 text-sm text-white md:gap-2 md:text-base'>
                          <Phone className='h-3 w-3 md:h-4 md:w-4' />
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
                              onAccept={(val: unknown) =>
                                field.onChange(String(val))
                              }
                              placeholder='(11) 99999-9999'
                              type='tel'
                              inputMode='numeric'
                              className={cn(
                                // base
                                'h-10 w-full rounded-xs border px-3 text-sm text-white md:h-11 md:text-base',
                                'placeholder:text-muted-foreground bg-slate-900/80',
                                'border-border/20',
                                // foco (ordem correta + ring com largura)
                                'focus:ring-accent/80 focus:!border-accent/80 focus:ring-0 focus:outline-none',
                                // acessibilidade (opcional, combina bem com shadcn)
                                'focus-visible:ring-accent/80 focus-visible:ring-0',
                                // erro
                                errors.telefone
                                  ? 'border-red-500 focus:!border-red-500 focus:ring-red-500/30'
                                  : ''
                              )}
                            />
                          )}
                        />

                        {errors.telefone && (
                          <p className='mt-1 text-xs text-red-400 md:text-sm'>
                            {errors.telefone?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='space-y-1 md:space-y-2'>
                      <Label
                        htmlFor='mensagem'
                        className='text-sm text-white md:text-base'>
                        Conte-nos sobre seu projeto
                      </Label>
                      <Textarea
                        id='mensagem'
                        {...register('mensagem')}
                        className='border-border/20 focus:ring-accent/80 placeholder:text-muted-foreground min-h-[80px] rounded-xs border !bg-slate-900/80 text-sm text-white md:min-h-[100px] md:text-base'
                        placeholder='Descreva o tipo de fábrica que deseja montar, produtos que irá processar, capacidade de produção desejada...'
                      />
                      {errors.mensagem && (
                        <p className='mt-1 text-xs text-red-400 md:text-sm'>
                          {errors.mensagem?.message}
                        </p>
                      )}
                    </div>
                  </form>

                  <Button
                    type='submit'
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className='bg-accent hover:bg-accent/90 mt-4 w-full py-2.5 text-sm font-semibold text-white md:mt-6 md:py-3 md:text-base'>
                    {isSubmitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        Solicitar Orçamento
                        <ArrowRight className='ml-2 h-3 w-3 md:h-4 md:w-4' />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Coluna de informações */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className='w-full space-y-4 md:w-1/2 md:space-y-6'>
                <div className='border-border/20 rounded-xs border border-dashed bg-slate-900/80 p-4 shadow-xl backdrop-blur md:p-6'>
                  <h3 className='mb-3 text-lg font-bold text-white md:mb-4 md:text-xl'>
                    Como começar?
                  </h3>
                  <div className='space-y-2 text-xs text-white/90 md:space-y-3 md:text-sm'>
                    <div className='flex items-start gap-2 md:gap-3'>
                      <div className='bg-accent/20 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full md:h-6 md:w-6'>
                        <span className='text-accent text-xs font-bold'>1</span>
                      </div>
                      <p>
                        Preencha o formulário com suas informações e
                        necessidades
                      </p>
                    </div>
                    <div className='flex items-start gap-2 md:gap-3'>
                      <div className='bg-accent/20 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full md:h-6 md:w-6'>
                        <span className='text-accent text-xs font-bold'>2</span>
                      </div>
                      <p>Nossa equipe técnica analisará seu projeto</p>
                    </div>
                    <div className='flex items-start gap-2 md:gap-3'>
                      <div className='bg-accent/20 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full md:h-6 md:w-6'>
                        <span className='text-accent text-xs font-bold'>3</span>
                      </div>
                      <p>
                        Desenvolveremos uma proposta personalizada para sua
                        fábrica
                      </p>
                    </div>
                  </div>
                </div>

                <div className='border-border/20 rounded-xs border border-dashed bg-slate-900/80 p-4 shadow-xl backdrop-blur md:p-6'>
                  <h3 className='mb-3 text-lg font-bold text-white md:mb-4 md:text-xl'>
                    O que oferecemos?
                  </h3>
                  <div className='space-y-1.5 text-xs text-white/90 md:space-y-2 md:text-sm'>
                    <p>
                      •{' '}
                      <span className='text-accent font-semibold'>
                        Consultoria técnica
                      </span>{' '}
                      especializada
                    </p>
                    <p>
                      •{' '}
                      <span className='text-accent font-semibold'>
                        Projeto personalizado
                      </span>{' '}
                      para sua necessidade
                    </p>
                    <p>
                      •{' '}
                      <span className='text-accent font-semibold'>
                        Fabricação
                      </span>{' '}
                      de máquinas sob medida
                    </p>
                    <p>
                      •{' '}
                      <span className='text-accent font-semibold'>
                        Instalação
                      </span>{' '}
                      e treinamento completo
                    </p>
                    <p>
                      •{' '}
                      <span className='text-accent font-semibold'>
                        Suporte técnico
                      </span>{' '}
                      contínuo
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
