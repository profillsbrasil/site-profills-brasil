import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/jsonLd';
import { metadataDaPagina } from '@/lib/seo/metadata';
import { breadcrumbSchema } from '@/lib/seo/schemas';

import FormularioMontarFabrica from './_components/formularioMontarFabrica';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Monte sua fábrica de envase',
  descricao:
    'Projeto de layout fabril e linha completa de envase, do fluxo de produção à instalação. Conte o que você produz e a Profills monta a proposta.',
  path: '/montar-fabrica'
});

export default function MontarFabricaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { nome: 'Início', path: '/' },
          { nome: 'Monte sua fábrica', path: '/montar-fabrica' }
        ])}
      />
      <FormularioMontarFabrica />
    </>
  );
}
