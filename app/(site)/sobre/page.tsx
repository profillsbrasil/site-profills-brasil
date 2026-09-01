import type { Metadata } from 'next';

import { GridPattern } from '@/components/layout/gridPatternBg';
import { JsonLd } from '@/components/seo/jsonLd';
import { metadataDaPagina } from '@/lib/seo/metadata';
import { breadcrumbSchema, faqSchema } from '@/lib/seo/schemas';

import CardFaq, { faqQuestoes } from './_components/cardFaq';
import CardsPerfil from './_components/cardsPerfil';
import MarqueeClientes from './_components/marqueeClientes';
import ProfillHistoria from './_components/profillHistoria';
import ProfillFabrica from './_components/profillfabrica';

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Sobre a Profills',
  descricao:
    'Matriz em Curitiba, unidade fabril em Cerqueira César e mais de 300 clientes no Brasil e na América do Sul. Conheça a estrutura e o suporte da Profills.',
  path: '/sobre'
});

export default function Sobre() {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:py-10'>
      <JsonLd data={faqSchema(faqQuestoes)} />
      <JsonLd
        data={breadcrumbSchema([
          { nome: 'Início', path: '/' },
          { nome: 'Sobre', path: '/sobre' }
        ])}
      />
      <GridPattern />
      <div className='flex min-h-screen w-full flex-col items-center justify-center md:h-screen'>
        <MarqueeClientes />
        <CardsPerfil />
      </div>
      <ProfillHistoria />
      <ProfillFabrica />
      <CardFaq />
    </div>
  );
}
