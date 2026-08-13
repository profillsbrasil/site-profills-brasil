import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { getMaquinaBySlug, maquinasCatalogo } from '@/lib/data/maquinas';
import { WHATSAPP_VENDAS, waLink } from '@/lib/utils/whatsapp';

import { AplicacoesProdutos } from './_components/aplicacoesProdutos';
import { Conversao } from './_components/conversao';
import { EmbalagemBloco } from './_components/embalagemBloco';
import { FichaTecnica } from './_components/fichaTecnica';
import { HeroDossie } from './_components/heroDossie';
import { Relacionadas } from './_components/relacionadas';
import SpecificationModal from './_components/specificationModal';
import { SubNavMaquina } from './_components/subNavMaquina';
import { VideoMaquina } from './_components/videoMaquina';
import { VisaoGeral } from './_components/visaoGeral';

interface MaquinaPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return maquinasCatalogo.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params
}: MaquinaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const maquina = getMaquinaBySlug(slug);
  if (!maquina) return {};
  return {
    title: maquina.seo.titulo,
    description: maquina.seo.descricao,
    openGraph: {
      title: maquina.seo.titulo,
      description: maquina.seo.descricao,
      images: [{ url: maquina.imagens.maquina.src }]
    }
  };
}

export default async function MaquinaPage({ params }: MaquinaPageProps) {
  const { slug } = await params;
  const maquina = getMaquinaBySlug(slug);
  if (!maquina) notFound();

  const secoes = [
    { id: 'visao-geral', rotulo: 'Visão geral' },
    ...(maquina.tipoPagina === 'padrao'
      ? [
          { id: 'aplicacoes', rotulo: 'Aplicações' },
          { id: 'embalagem', rotulo: 'Embalagem' },
          { id: 'ficha-tecnica', rotulo: 'Ficha técnica' }
        ]
      : []),
    { id: 'contato', rotulo: 'Contato' }
  ];

  return (
    <div className='tema-navy bg-background text-foreground relative min-h-screen w-full pt-16'>
      <GridPattern />
      <div className='relative z-10'>
        <SubNavMaquina nome={maquina.nome} secoes={secoes}>
          <SpecificationModal
            maquinaId={maquina.legacyId ?? 0}
            maquinaNome={maquina.nome}
            triggerClassName='h-7 px-3 text-xs'
          />
        </SubNavMaquina>

        <div className='mx-auto w-full max-w-7xl px-4 md:px-8'>
          <HeroDossie maquina={maquina}>
            <SpecificationModal
              maquinaId={maquina.legacyId ?? 0}
              maquinaNome={maquina.nome}
            />
            <a
              href={waLink(
                WHATSAPP_VENDAS,
                `Olá! Tenho interesse na ${maquina.nome}.`
              )}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground inline-flex h-12 items-center rounded-xs border border-[rgba(148,178,235,0.4)] px-6 text-sm font-semibold transition-colors'>
              Falar com um especialista
            </a>
            {maquina.video && (
              <a
                href='#video'
                className='text-accent px-2 py-2.5 text-sm font-mono'>
                ▶ Ver máquina em operação
              </a>
            )}
          </HeroDossie>
          <VisaoGeral maquina={maquina} />
          <VideoMaquina video={maquina.video} nome={maquina.nome} />
          {maquina.tipoPagina === 'padrao' && (
            <>
              <AplicacoesProdutos aplicacoes={maquina.aplicacoes} />
              <EmbalagemBloco maquina={maquina} />
              <FichaTecnica maquina={maquina} />
            </>
          )}
          <Conversao maquina={maquina} />
          <Relacionadas maquina={maquina} />
        </div>
      </div>
    </div>
  );
}
