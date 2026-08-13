import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { getMaquinaBySlug, maquinasCatalogo } from '@/lib/data/maquinas';

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

  return (
    <div className='tema-navy bg-background text-foreground relative min-h-screen w-full pt-16'>
      <GridPattern />
      <div className='relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8'>
        {/* Blocos do template entram nas Tasks 4–12; montagem final na Task 13 */}
        <h1 className='pt-10 text-2xl font-bold md:text-4xl'>
          {maquina.nomeCompleto}
        </h1>
        <p className='text-muted-foreground mt-4 max-w-2xl'>
          {maquina.headline}
        </p>
      </div>
    </div>
  );
}
