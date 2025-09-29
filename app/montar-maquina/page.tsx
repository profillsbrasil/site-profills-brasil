'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { Highlighter } from '@/components/magicui/highlighter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Importar imagens das embalagens
import embalagemEspeciais from '@/lib/images/embalagensPequenas/especiais.png';
import embalagemFardo from '@/lib/images/embalagensPequenas/fardo.png';
import embalagemFrasco from '@/lib/images/embalagensPequenas/frasco.png';
import embalagemGabletop from '@/lib/images/embalagensPequenas/gabletop.png';
import embalagemGarrafa from '@/lib/images/embalagensPequenas/garrafa.png';
// Importar imagens dos tipos de produto
import produtoGranular from '@/lib/images/embalagensPequenas/granular.png';
import produtoLiquido from '@/lib/images/embalagensPequenas/liquido-fino.png';
import produtoPastoso from '@/lib/images/embalagensPequenas/liquido-medio.png';
import produtoViscoso from '@/lib/images/embalagensPequenas/liquido-viscoso.png';
import produtoPo from '@/lib/images/embalagensPequenas/pos.png';
import embalagemPote from '@/lib/images/embalagensPequenas/pote.png';
import embalagemPouch from '@/lib/images/embalagensPequenas/pouch.png';
import embalagemSache from '@/lib/images/embalagensPequenas/sache.png';
import produtoSolido from '@/lib/images/embalagensPequenas/solidos.png';
import { cn } from '@/lib/utils';

import {
  type ContactFormData,
  type MachineRecommendation,
  getBestMachineRecommendation,
  initialContactFormData
} from './_components/combinacaoMaquinas';
import { motion } from 'framer-motion';
import { Drill } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { toast } from 'sonner';

const packagingOptions = [
  { id: 'cartonada', name: 'Cartonada', image: embalagemGabletop },
  { id: 'pouch', name: 'Pouch', image: embalagemPouch },
  { id: 'especiais', name: 'Especiais', image: embalagemEspeciais },
  { id: 'sache', name: 'Sachê', image: embalagemSache },
  { id: 'garrafa', name: 'Garrafa', image: embalagemGarrafa },
  { id: 'frasco', name: 'Frasco', image: embalagemFrasco },
  { id: 'fardo', name: 'Fardo', image: embalagemFardo },
  { id: 'pote', name: 'Pote', image: embalagemPote }
];

const productTypes = [
  { id: 'liquidos', name: 'Líquidos', image: produtoLiquido },
  { id: 'viscoso', name: 'Viscoso', image: produtoViscoso },
  { id: 'pastoso', name: 'Pastoso', image: produtoPastoso },
  { id: 'po', name: 'Pó', image: produtoPo },
  { id: 'granular', name: 'Granular', image: produtoGranular },
  { id: 'solido', name: 'Sólido', image: produtoSolido }
];

export default function MachineBuilder() {
  const [selectedPackaging, setSelectedPackaging] = useState<string>('');
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  const [recommendation, setRecommendation] =
    useState<MachineRecommendation | null>(null);
  const [contactForm, setContactForm] = useState<ContactFormData>(
    initialContactFormData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar compatibilidade quando seleções mudarem
  useEffect(() => {
    if (selectedPackaging && selectedProductType) {
      const bestRecommendation = getBestMachineRecommendation(
        selectedPackaging,
        selectedProductType
      );
      setRecommendation(bestRecommendation);
    } else {
      setRecommendation(null);
    }
  }, [selectedPackaging, selectedProductType]);

  const handleContactFormChange = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setContactForm((prev: ContactFormData) => ({ ...prev, [field]: value }));
  };

  const handleContactFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        nome: contactForm.nome,
        email: contactForm.email,
        empresa: contactForm.empresa,
        contato: contactForm.contato,
        detalhes: contactForm.detalhes,
        selectedPackaging,
        selectedProductType
      };

      const response = await fetch('/api/montar-maquina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Erro ao enviar solicitação');
      }

      toast.success('Solicitação enviada com sucesso!', {
        description:
          'Entraremos em contato em breve para elaborar sua solução personalizada.',
        duration: 5000
      });

      setContactForm(initialContactFormData);
    } catch (error) {
      console.error('Erro ao enviar solicitação Montar Máquina:', error);
      toast.error('Erro ao enviar solicitação', {
        description:
          error instanceof Error
            ? error.message
            : 'Tente novamente em instantes.',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // TODO: Tornar Funcional o envio do formulário
  // TODO: Melhorar o Botão de Solicitar Orçamento Personalizado

  return (
    <div className='relative min-h-screen w-full bg-slate-900 pt-12'>
      <GridPattern />

      <div className='relative z-10 mx-auto max-w-6xl px-4 py-6 md:pt-12'>
        {/* Header */}
        <div className='text-center'>
          <Highlighter
            action='underline'
            color='#2d62ef'
            animationDuration={4000}
            textColor='mb-3 text-2xl font-bold text-white md:mb-4 md:text-5xl'>
            Monte sua Máquina
          </Highlighter>{' '}
        </div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='pb-6 text-center md:pb-12'>
          <p className='mx-auto max-w-3xl text-sm text-pretty text-slate-300 md:text-xl'>
            Preencha os dados abaixo e descubra qual a máquina ideal para o seu
            produto.
          </p>
        </motion.div>

        {/* Selection Sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-8 grid gap-6 md:mb-12 md:grid-cols-2 md:gap-8'>
          {/* Packaging Selection */}
          <div>
            <div className='mb-4 rounded-t-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-center text-white shadow-lg md:mb-6 md:py-4'>
              <h2 className='text-sm font-semibold md:text-lg'>
                Selecione uma embalagem
              </h2>
            </div>

            <div className='grid grid-cols-2 gap-2 md:gap-4'>
              {packagingOptions.map((option, index) => {
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}>
                    <Card
                      className={`cursor-pointer rounded-xs border-2 py-1 transition-all duration-300 hover:scale-105 hover:shadow-lg md:py-2 ${
                        selectedPackaging === option.id
                          ? 'border-dashed border-blue-500 bg-blue-50/20 shadow-blue-500/20 backdrop-blur'
                          : 'border-slate-600 bg-slate-800/50 backdrop-blur hover:border-slate-500 hover:bg-slate-700/50'
                      }`}
                      onClick={() => setSelectedPackaging(option.id)}>
                      <div className='flex flex-col items-center space-y-2 text-center md:space-y-3'>
                        <Image
                          src={option.image}
                          alt={option.name}
                          className='h-16 w-16 object-contain md:h-32 md:w-32'
                        />
                        <span
                          className={`text-xs font-medium transition-colors md:text-sm ${
                            selectedPackaging === option.id
                              ? 'text-blue-400'
                              : 'text-slate-200'
                          }`}>
                          {option.name}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Product Type Selection */}
          <div>
            <div className='mb-4 rounded-t-lg bg-gradient-to-r from-purple-600 to-purple-700 py-3 text-center text-white shadow-lg md:mb-6 md:py-4'>
              <h2 className='text-sm font-semibold md:text-lg'>
                Selecione um tipo de produto
              </h2>
            </div>

            <div className='grid grid-cols-2 gap-2 md:gap-4'>
              {productTypes.map((type, index) => {
                return (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}>
                    <Card
                      className={`cursor-pointer rounded-xs border-2 p-2 transition-all duration-300 hover:scale-105 hover:shadow-lg md:p-4 ${
                        selectedProductType === type.id
                          ? 'border-dashed border-purple-500 bg-purple-50/20 shadow-purple-500/20 backdrop-blur'
                          : 'border-slate-600 bg-slate-800/50 backdrop-blur hover:border-slate-500 hover:bg-slate-700/50'
                      }`}
                      onClick={() => setSelectedProductType(type.id)}>
                      <div className='flex flex-col items-center space-y-2 text-center md:space-y-3'>
                        <div
                          className={`rounded-full p-2 transition-all duration-300 md:p-4 ${
                            selectedProductType === type.id
                              ? 'bg-white/90 shadow-lg ring-2 shadow-purple-500/20 ring-purple-400/60'
                              : 'bg-white/80 shadow-md hover:bg-white/90 hover:shadow-lg'
                          }`}>
                          <Image
                            src={type.image}
                            alt={type.name}
                            className='h-10 w-10 object-contain md:h-20 md:w-20'
                          />
                        </div>
                        <span
                          className={`text-xs font-medium transition-colors md:text-sm ${
                            selectedProductType === type.id
                              ? 'text-purple-400'
                              : 'text-slate-200'
                          }`}>
                          {type.name}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Product Details / Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='mb-8 md:mb-12'>
          <div className='flex h-full w-full flex-col'>
            {!selectedPackaging || !selectedProductType ? (
              // Estado inicial - convite para seleção
              <>
                <h3 className='mb-4 text-lg font-bold text-white md:mb-6 md:text-xl'>
                  Descubra a Máquina Ideal para o seu negócio
                </h3>
                <div className='flex h-64 w-full items-center justify-center md:h-96'>
                  <div className='border-border/20 flex h-full w-full items-center justify-center rounded-xs border border-dashed bg-slate-900/80 p-4 shadow-xl backdrop-blur md:p-6'>
                    <div className='text-center text-slate-400'>
                      <Drill className='mx-auto mb-4 h-12 w-12 md:mb-6 md:h-20 md:w-20' />
                      <h4 className='mb-2 text-sm font-semibold text-white md:text-lg'>
                        Selecione uma embalagem e produto
                      </h4>
                      <p className='text-xs md:text-sm'>
                        Recomendaremos máquinas compatíveis com a embalagem e
                        produto selecionados.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Estados com seleção completa
              <>
                <h3 className='mb-4 text-lg font-bold text-white md:mb-6 md:text-xl'>
                  {recommendation
                    ? 'Máquina Recomendada'
                    : 'Solicitar Orçamento Personalizado'}
                </h3>

                {recommendation ? (
                  // Mostrar detalhes da máquina recomendada
                  <div className='flex h-full w-full flex-col items-center justify-center gap-4 md:flex-row md:gap-6'>
                    <div className='border-border/20 relative flex h-48 w-full items-center justify-center rounded-xs border border-dashed bg-slate-900/80 py-4 shadow-xl backdrop-blur md:h-96 md:w-1/3'>
                      <Image
                        src={recommendation.machine.imgMaquina}
                        alt={recommendation.machine.name}
                        className='h-full w-auto object-contain'
                      />
                    </div>
                    <div className='flex h-full w-full flex-col items-center justify-between gap-3 md:h-80 md:max-h-96 md:w-2/3 md:gap-2'>
                      <div className='border-border/20 flex h-full w-full flex-col gap-3 rounded-xs border border-dashed bg-slate-900/80 p-4 shadow-xl backdrop-blur md:gap-4 md:p-6'>
                        <div>
                          <h2 className='text-lg font-bold text-white md:text-xl'>
                            {recommendation.machine.name}
                          </h2>
                          <p className='mb-2 text-xs text-blue-400 md:text-sm'>
                            {recommendation.machine.categoria} •
                            Compatibilidade:{' '}
                            {Math.round(recommendation.compatibilityScore)}%
                          </p>
                          <p className='mb-3 text-xs text-slate-300 md:text-sm'>
                            {recommendation.machine.about}
                          </p>
                        </div>

                        <div className='grid grid-cols-1 gap-3 text-xs md:grid-cols-2 md:gap-4'>
                          <div>
                            <span className='font-semibold text-white'>
                              Capacidade:
                            </span>
                            <p className='text-slate-300'>
                              Até{' '}
                              {recommendation.machine.unidadeMaxima?.toLocaleString() ||
                                'N/A'}{' '}
                              unidades/hora
                            </p>
                          </div>
                          <div>
                            <span className='font-semibold text-white'>
                              Embalagens:
                            </span>
                            <p className='text-slate-300'>
                              {recommendation.machine.embalagensCompativeis.join(
                                ', '
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='flex h-full w-full items-center justify-center'>
                        <Link href={`/maquinas/${recommendation.machine.id}`}>
                          <Button className='w-full bg-blue-600 text-sm hover:bg-blue-700 md:text-base'>
                            Ver mais sobre esta máquina
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Mostrar formulário de contato quando não há máquina compatível
                  <div className='flex h-full w-full flex-col items-start justify-center gap-4 md:flex-row md:gap-6'>
                    <div className='border-border/20 relative flex h-32 w-full items-center justify-center rounded-xs border border-dashed bg-slate-900/80 py-4 shadow-xl backdrop-blur md:h-96 md:w-1/3'>
                      <div className='flex flex-col items-center justify-center text-center text-slate-400'>
                        <Drill className='h-8 w-8 md:h-16 md:w-16' />

                        <p className='mt-2 text-xs'>Preencha o formulário</p>
                        <p className='text-xs'>
                          Receber uma solução personalizada.
                        </p>
                      </div>
                    </div>

                    <div className='flex w-full flex-col md:w-2/3'>
                      <div className='border-border/20 h-auto items-center justify-center rounded-xs border border-dashed bg-slate-900/80 p-4 shadow-xl backdrop-blur md:h-96 md:p-6'>
                        <form
                          onSubmit={handleContactFormSubmit}
                          className='h-full space-y-3 md:space-y-4'>
                          <div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4'>
                            <div className='space-y-1 md:space-y-2'>
                              <Label
                                htmlFor='nome'
                                className='text-sm text-white md:text-base'>
                                Nome *
                              </Label>
                              <Input
                                id='nome'
                                type='text'
                                placeholder='Seu nome completo'
                                value={contactForm.nome}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  handleContactFormChange(
                                    'nome',
                                    e.target.value
                                  )
                                }
                                className='focus:ring-accent/50 h-10 border-slate-600 !bg-slate-800 text-sm text-white placeholder:text-slate-400 md:h-11 md:text-base'
                                required
                              />
                            </div>
                            <div className='space-y-1 md:space-y-2'>
                              <Label
                                htmlFor='email'
                                className='text-sm text-white md:text-base'>
                                E-mail *
                              </Label>
                              <Input
                                id='email'
                                type='email'
                                placeholder='seu@email.com'
                                value={contactForm.email}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  handleContactFormChange(
                                    'email',
                                    e.target.value
                                  )
                                }
                                className='focus:ring-accent/50 h-10 border-slate-600 !bg-slate-800 text-sm text-white placeholder:text-slate-400 md:h-11 md:text-base'
                                required
                              />
                            </div>
                          </div>

                          <div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4'>
                            <div className='space-y-1 md:space-y-2'>
                              <Label
                                htmlFor='empresa'
                                className='text-sm text-white md:text-base'>
                                Empresa
                              </Label>
                              <Input
                                id='empresa'
                                type='text'
                                placeholder='Nome da sua empresa'
                                value={contactForm.empresa}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  handleContactFormChange(
                                    'empresa',
                                    e.target.value
                                  )
                                }
                                className='focus:ring-accent/50 h-10 border-slate-600 !bg-slate-800 text-sm text-white placeholder:text-slate-400 md:h-11 md:text-base'
                              />
                            </div>
                            <div className='space-y-1 md:space-y-2'>
                              <Label
                                htmlFor='contato'
                                className='text-sm text-white md:text-base'>
                                Telefone/WhatsApp
                              </Label>
                              <IMaskInput
                                id='contato'
                                mask={['(00) 0000-0000', '(00) 00000-0000']}
                                placeholder='(11) 99999-9999'
                                value={contactForm.contato}
                                onAccept={(value: unknown) =>
                                  handleContactFormChange(
                                    'contato',
                                    String(value)
                                  )
                                }
                                type='tel'
                                inputMode='numeric'
                                className={cn(
                                  // base
                                  'focus:ring-accent/50 h-10 w-full rounded-xs border border-slate-600 !bg-slate-800 px-3 text-sm text-white md:h-11 md:text-base',
                                  'bg-slate-900/80 placeholder:text-slate-400',
                                  'border-border/20',
                                  // foco (ordem correta + ring com largura)
                                  'focus:ring-accent/80 focus:!border-accent/80 focus:ring-0 focus:outline-none',
                                  // acessibilidade (opcional, combina bem com shadcn)
                                  'focus-visible:ring-accent/80 focus-visible:ring-0'
                                )}
                              />
                            </div>
                          </div>

                          <div className='space-y-1 md:space-y-2'>
                            <Label
                              htmlFor='detalhes'
                              className='text-sm text-white md:text-base'>
                              Detalhes do seu produto (volume, características
                              especiais, etc.) *
                            </Label>
                            <Textarea
                              id='detalhes'
                              value={contactForm.detalhes}
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                              ) =>
                                handleContactFormChange(
                                  'detalhes',
                                  e.target.value
                                )
                              }
                              className='focus:ring-accent/50 min-h-[80px] border-slate-600 !bg-slate-800 text-sm text-white placeholder:text-slate-400 md:min-h-[100px] md:text-base'
                              placeholder='Descreva seu produto, volume desejado, características especiais...'
                              required
                            />
                          </div>

                          <Button
                            type='submit'
                            className='w-full bg-purple-600 text-sm hover:bg-purple-700 md:text-base'
                            disabled={isSubmitting}>
                            {isSubmitting
                              ? 'Enviando...'
                              : 'Solicitar Orçamento Personalizado'}
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
