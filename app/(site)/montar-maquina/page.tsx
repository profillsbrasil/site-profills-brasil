import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/jsonLd';
import { metadataDaPagina } from '@/lib/seo/metadata';
import { breadcrumbSchema } from '@/lib/seo/schemas';

import ConfiguradorMaquina from './_components/configuradorMaquina';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Monte sua máquina envasadora',
  descricao:
    'Escolha o tipo de produto, o formato da embalagem e a produção desejada. A Profills indica a envasadora certa para a sua linha.',
  path: '/montar-maquina'
});

export default function MontarMaquinaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { nome: 'Início', path: '/' },
          { nome: 'Monte sua máquina', path: '/montar-maquina' }
        ])}
      />
      <ConfiguradorMaquina />
    </>
  );
}
