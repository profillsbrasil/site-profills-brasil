import type { MetadataRoute } from 'next';
import { unstable_rethrow } from 'next/navigation';

import { listarPublicados } from '@/lib/blog/leitura';
import { maquinasCatalogo } from '@/lib/data/maquinas';
import { SITE_URL } from '@/lib/seo/site';
import { logger } from '@/lib/utils/logger';

type Rota = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
};

const rotasEstaticas: Rota[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/maquinas', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/montar-fabrica', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/montar-maquina', priority: 0.8, changeFrequency: 'monthly' },
  {
    path: '/servicos-personalizados',
    priority: 0.7,
    changeFrequency: 'monthly'
  },
  { path: '/sobre', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/clientes', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/download', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/projetos/profills-hub', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/projetos/profills-erp', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/projetos/profills-bank', priority: 0.5, changeFrequency: 'yearly' },
  {
    path: '/projetos/profills-locacao',
    priority: 0.5,
    changeFrequency: 'yearly'
  },
  {
    path: '/projetos/profills-marketplace',
    priority: 0.5,
    changeFrequency: 'yearly'
  },
  { path: '/projetos/profills-pd', priority: 0.5, changeFrequency: 'yearly' },
  {
    path: '/projetos/profills-school',
    priority: 0.5,
    changeFrequency: 'yearly'
  },
  {
    path: '/projetos/profills-sustentabilidade',
    priority: 0.5,
    changeFrequency: 'yearly'
  }
];

async function postsDoBlog(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await listarPublicados();

    return posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.atualizadoEm),
      changeFrequency: 'monthly',
      priority: 0.6
    }));
  } catch (erro) {
    unstable_rethrow(erro);
    logger.error('Banco do blog fora ao montar o sitemap', erro);

    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  return [
    ...rotasEstaticas.map((rota) => ({
      url: `${SITE_URL}${rota.path}`,
      lastModified,
      changeFrequency: rota.changeFrequency,
      priority: rota.priority
    })),
    ...maquinasCatalogo.map((maquina) => ({
      url: `${SITE_URL}/maquinas/${maquina.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    })),
    ...(await postsDoBlog())
  ];
}
