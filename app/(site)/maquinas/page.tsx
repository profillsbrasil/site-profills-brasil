import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/jsonLd';
import { maquinasCatalogo } from '@/lib/data/maquinas';
import { metadataDaPagina } from '@/lib/seo/metadata';
import { breadcrumbSchema, catalogoSchema } from '@/lib/seo/schemas';

import CatalogoMaquinas from './_components/catalogoMaquinas';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Catálogo de máquinas envasadoras e embaladoras',
  descricao:
    'Envasadoras, embaladoras, enfardadeiras e envolvedoras para líquidos, pastosos, pós e sólidos. Filtre por tipo de produto e de embalagem e compare as capacidades.',
  path: '/maquinas'
});

export default function MaquinasPage() {
  return (
    <>
      <JsonLd data={catalogoSchema(maquinasCatalogo)} />
      <JsonLd
        data={breadcrumbSchema([
          { nome: 'Início', path: '/' },
          { nome: 'Máquinas', path: '/maquinas' }
        ])}
      />
      <h1 className='sr-only'>
        Catálogo de máquinas envasadoras e embaladoras Profills
      </h1>
      <CatalogoMaquinas />
    </>
  );
}
