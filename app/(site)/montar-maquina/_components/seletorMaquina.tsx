'use client';

import { useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import embalagemEspeciais from '@/lib/images/embalagensPequenas/especiais.png';
import embalagemFardo from '@/lib/images/embalagensPequenas/fardo.png';
import embalagemFrasco from '@/lib/images/embalagensPequenas/frasco.png';
import embalagemGabletop from '@/lib/images/embalagensPequenas/gabletop.png';
import embalagemGarrafa from '@/lib/images/embalagensPequenas/garrafa.png';
import produtoGranular from '@/lib/images/embalagensPequenas/granular.png';
import produtoLiquido from '@/lib/images/embalagensPequenas/liquido-fino.png';
import produtoPastoso from '@/lib/images/embalagensPequenas/liquido-medio.png';
import produtoViscoso from '@/lib/images/embalagensPequenas/liquido-viscoso.png';
import produtoPo from '@/lib/images/embalagensPequenas/pos.png';
import embalagemPote from '@/lib/images/embalagensPequenas/pote.png';
import embalagemPouch from '@/lib/images/embalagensPequenas/pouch.png';
import embalagemSache from '@/lib/images/embalagensPequenas/sache.png';
import produtoSolido from '@/lib/images/embalagensPequenas/solidos.png';
import { montarMaquinaFormSchema } from '@/lib/schemas/montar-maquina-form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { getBestMachineRecommendation } from './combinacaoMaquinas';
import { ArrowRight, Drill } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { toast } from 'sonner';
import { z } from 'zod';

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

/* selectedPackaging/selectedProductType saem do seletor, não do form —
   o form só aparece com os dois escolhidos; a API valida o schema completo. */
const camposFormSchema = montarMaquinaFormSchema.omit({
  selectedPackaging: true,
  selectedProductType: true
});
/* empresa/contato têm .transform() no schema — o RHF trabalha com o tipo de
   entrada (opcionais) e o onSubmit recebe o de saída (strings). */
type CamposFormInput = z.input<typeof camposFormSchema>;
type CamposFormData = z.output<typeof camposFormSchema>;

const campoClasses =
  'h-11 rounded-xs border border-[rgba(148,178,235,0.25)] bg-slate-900/60 text-base text-white placeholder:text-muted-foreground/60 focus-visible:border-accent/80 focus-visible:ring-0';

const labelClasses =
  'font-mono text-[13px] tracking-wider text-muted-foreground/70 uppercase';

function Placa({
  numero,
  titulo,
  children
}: {
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className='relative border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/60 p-4 md:p-5'>
      <span className='text-accent/60 absolute -top-2 -left-1 font-mono text-xs'>
        +
      </span>
      <h2 className='flex items-center gap-2 font-mono text-sm font-semibold tracking-widest text-white uppercase'>
        <span className='bg-accent inline-block h-1.5 w-1.5' />
        {numero} · {titulo}
      </h2>
      {children}
    </div>
  );
}

function TileSelecao({
  selecionado,
  onClick,
  children
}: {
  selecionado: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={selecionado}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xs border p-3 transition-colors',
        selecionado
          ? 'border-accent bg-accent/10'
          : 'border-dashed border-[rgba(148,178,235,0.3)] hover:border-[rgba(148,178,235,0.6)]'
      )}>
      {children}
    </button>
  );
}

export function SeletorMaquina() {
  const [selectedPackaging, setSelectedPackaging] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recommendation = useMemo(
    () =>
      selectedPackaging && selectedProductType
        ? getBestMachineRecommendation(selectedPackaging, selectedProductType)
        : null,
    [selectedPackaging, selectedProductType]
  );
  const selecaoCompleta = Boolean(selectedPackaging && selectedProductType);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<CamposFormInput, unknown, CamposFormData>({
    resolver: zodResolver(camposFormSchema)
  });

  const onSubmit = async (data: CamposFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/montar-maquina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          selectedPackaging,
          selectedProductType
        })
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

      reset();
    } catch (error) {
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

  return (
    <div className='flex flex-col gap-6 md:gap-8'>
      {/* Seleção */}
      <div className='grid gap-6 md:grid-cols-2 md:gap-8'>
        <Placa numero='01' titulo='Embalagem'>
          <div className='mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3'>
            {packagingOptions.map((option) => (
              <TileSelecao
                key={option.id}
                selecionado={selectedPackaging === option.id}
                onClick={() => setSelectedPackaging(option.id)}>
                <Image
                  src={option.image}
                  alt={option.name}
                  className='h-14 w-14 object-contain md:h-20 md:w-20'
                />
                <span
                  className={cn(
                    'text-sm font-medium',
                    selectedPackaging === option.id
                      ? 'text-accent'
                      : 'text-muted-foreground'
                  )}>
                  {option.name}
                </span>
              </TileSelecao>
            ))}
          </div>
        </Placa>

        <Placa numero='02' titulo='Tipo de produto'>
          <div className='mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3'>
            {productTypes.map((type) => (
              <TileSelecao
                key={type.id}
                selecionado={selectedProductType === type.id}
                onClick={() => setSelectedProductType(type.id)}>
                {/* Os desenhos dos produtos são escuros — precisam de chip claro no navy */}
                <span className='rounded-xs bg-white/90 p-2'>
                  <Image
                    src={type.image}
                    alt={type.name}
                    className='h-10 w-10 object-contain md:h-16 md:w-16'
                  />
                </span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    selectedProductType === type.id
                      ? 'text-accent'
                      : 'text-muted-foreground'
                  )}>
                  {type.name}
                </span>
              </TileSelecao>
            ))}
          </div>
        </Placa>
      </div>

      {/* Resultado */}
      {!selecaoCompleta ? (
        <div className='flex min-h-56 items-center justify-center border border-dashed border-[rgba(148,178,235,0.35)] bg-slate-900/40 p-6 md:min-h-72'>
          <div className='text-muted-foreground text-center'>
            <Drill className='mx-auto mb-4 h-12 w-12 md:h-16 md:w-16' />
            <p className='text-lg font-semibold text-white'>
              Selecione uma embalagem e um tipo de produto
            </p>
            <p className='mt-1 text-base'>
              Indicamos a máquina compatível com a sua combinação.
            </p>
          </div>
        </div>
      ) : recommendation ? (
        <section className='relative border border-dashed border-[rgba(148,178,235,0.35)] p-5 md:p-8'>
          <div className='flex items-center justify-between border-b border-dashed border-[rgba(148,178,235,0.25)] pb-3'>
            <span className='text-accent font-mono text-xs tracking-[0.2em] uppercase'>
              Máquina recomendada
            </span>
            <span className='text-muted-foreground/60 hidden font-mono text-xs tracking-wider uppercase md:block'>
              {recommendation.machine.categoria}
            </span>
          </div>
          <div className='flex flex-col items-center gap-6 pt-6 md:flex-row'>
            <div className='flex w-full justify-center md:w-2/5'>
              {recommendation.machine.imagens?.maquina ? (
                <Image
                  src={recommendation.machine.imagens.maquina}
                  alt={recommendation.machine.nome}
                  className='max-h-64 w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)] md:max-h-80'
                />
              ) : (
                <Drill className='text-muted-foreground h-16 w-16' />
              )}
            </div>
            <div className='w-full md:w-3/5'>
              <h3 className='text-xl font-bold text-pretty text-white md:text-2xl'>
                {recommendation.machine.nome}
              </h3>
              <p className='text-muted-foreground mt-2 max-w-md text-base text-pretty'>
                {recommendation.machine.headline}
              </p>
              <dl className='mt-4 max-w-md font-mono'>
                {recommendation.machine.capacidadeMaxima != null && (
                  <div className='flex items-baseline justify-between gap-4 border-b border-[rgba(148,178,235,0.15)] py-2'>
                    <dt className='text-muted-foreground/70 text-[13px] tracking-wider whitespace-nowrap uppercase'>
                      Capacidade
                    </dt>
                    <dd className='text-right text-base font-semibold text-white'>
                      até{' '}
                      {recommendation.machine.capacidadeMaxima.toLocaleString(
                        'pt-BR'
                      )}{' '}
                      un/h
                    </dd>
                  </div>
                )}
                <div className='flex items-baseline justify-between gap-4 py-2'>
                  <dt className='text-muted-foreground/70 text-[13px] tracking-wider whitespace-nowrap uppercase'>
                    Embalagens
                  </dt>
                  <dd className='max-w-[60%] text-right text-base text-pretty text-white'>
                    {recommendation.machine.embalagensCompativeis.join(', ')}
                  </dd>
                </div>
              </dl>
              <Link
                href={`/maquinas/${recommendation.machine.slug}`}
                className='bg-accent hover:bg-accent/85 mt-5 inline-flex h-12 items-center rounded-xs px-6 text-sm font-semibold text-white transition-colors'>
                Ver máquina completa
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <Placa numero='03' titulo='Orçamento personalizado'>
          <p className='text-muted-foreground mt-2 mb-5 text-base text-pretty'>
            Ainda não temos uma máquina de linha para essa combinação — nossa
            engenharia desenvolve a solução sob medida. Conte o que você
            precisa:
          </p>
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
                  <p className='text-sm text-red-400'>
                    {errors.email?.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='contato' className={labelClasses}>
                  Telefone/WhatsApp
                </Label>
                <Controller
                  name='contato'
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      id='contato'
                      mask={['(00) 0000-0000', '(00) 00000-0000']}
                      value={field.value as unknown as string}
                      onAccept={(val: unknown) => field.onChange(String(val))}
                      placeholder='(11) 99999-9999'
                      type='tel'
                      inputMode='numeric'
                      className={cn(
                        'w-full px-3 focus:outline-none',
                        campoClasses
                      )}
                    />
                  )}
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='detalhes' className={labelClasses}>
                Detalhes do seu produto
              </Label>
              <Textarea
                id='detalhes'
                {...register('detalhes')}
                className={cn(campoClasses, 'h-auto min-h-[100px]')}
                placeholder='Descreva seu produto, volume desejado, características especiais...'
              />
              {errors.detalhes && (
                <p className='text-sm text-red-400'>
                  {errors.detalhes?.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              disabled={isSubmitting}
              className='bg-accent hover:bg-accent/85 h-12 w-full rounded-xs text-base font-semibold text-white'>
              {isSubmitting ? 'Enviando...' : 'Solicitar orçamento personalizado'}
            </Button>
          </form>
        </Placa>
      )}
    </div>
  );
}
