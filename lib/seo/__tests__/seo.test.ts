import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { listarPublicados } from '@/lib/blog/leitura';
import type { ResumoPublicado } from '@/lib/blog/tipos';
import { maquinasCatalogo } from '@/lib/data/maquinas';
import { metadataDaPagina } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  catalogoSchema,
  faqSchema,
  maquinaSchema,
  organizacaoSchema,
  websiteSchema
} from '@/lib/seo/schemas';
import { SITE_URL } from '@/lib/seo/site';

import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/blog/leitura', () => ({ listarPublicados: vi.fn() }));

const postPublicado: ResumoPublicado = {
  slug: 'gt-ganha-troca-de-formato',
  publicadoEm: '2026-11-10T13:00:00.000Z',
  titulo: 'GT ganha troca de formato',
  resumo: 'Resumo',
  assunto: 'maquina',
  capa: null
};

beforeEach(() => {
  vi.mocked(listarPublicados).mockReset();
  vi.mocked(listarPublicados).mockResolvedValue([postPublicado]);
});

const urlsDoSitemap = async () => (await sitemap()).map((e) => e.url);

describe('sitemap', () => {
  let urls: string[];

  beforeEach(async () => {
    urls = await urlsDoSitemap();
  });

  it('lista as 35 máquinas do registry', () => {
    for (const maquina of maquinasCatalogo) {
      expect(urls).toContain(`${SITE_URL}/maquinas/${maquina.slug}`);
    }
  });

  it('não repete URL', () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('deixa de fora a landing noindex do sorteio', () => {
    expect(urls.some((url) => url.includes('sorteio'))).toBe(false);
  });

  it('usa o host canônico em toda entrada', () => {
    for (const url of urls) expect(url.startsWith(SITE_URL)).toBe(true);
  });

  it('lista o blog e os posts publicados', () => {
    expect(urls).toContain(`${SITE_URL}/blog`);
    expect(urls).toContain(`${SITE_URL}/blog/gt-ganha-troca-de-formato`);
  });

  it('com o banco fora, as páginas fixas e as máquinas continuam saindo', async () => {
    vi.mocked(listarPublicados).mockRejectedValue(new Error('ECONNREFUSED'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const semBanco = await urlsDoSitemap();

    expect(semBanco).toContain(`${SITE_URL}/blog`);
    expect(semBanco).toContain(
      `${SITE_URL}/maquinas/${maquinasCatalogo[0].slug}`
    );
    expect(semBanco.some((u) => u.includes('/blog/'))).toBe(false);
  });
});

describe('robots', () => {
  const regras = robots();

  it('aponta o sitemap no host canônico', () => {
    expect(regras.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it('bloqueia a API e mantém a landing de catálogo liberada', () => {
    const rule = Array.isArray(regras.rules) ? regras.rules[0] : regras.rules;
    const disallow = [rule.disallow].flat();
    expect(disallow).toContain('/api/');
    expect(disallow).not.toContain('/download');
  });
});

describe('metadataDaPagina', () => {
  const meta = metadataDaPagina({
    titulo: 'Clientes',
    descricao: 'Marcas que confiam na Profills.',
    path: '/clientes'
  });

  it('faz o canonical apontar para a própria página', () => {
    expect(meta.alternates?.canonical).toBe('/clientes');
  });

  it('repõe o que a declaração de openGraph derruba do layout', () => {
    // Declarar openGraph num filho substitui o objeto inteiro herdado do root.
    expect(meta.openGraph?.siteName).toBe('Profills Brasil');
    expect(meta.openGraph).toHaveProperty('locale', 'pt_BR');
    expect(meta.openGraph?.images).toHaveLength(1);
    expect(meta.openGraph?.title).toContain('Profills Brasil');
  });
});

describe('JSON-LD', () => {
  it('não declara identidade jurídica que o repo não sustenta', () => {
    const org = organizacaoSchema();
    expect(org).not.toHaveProperty('legalName');
    expect(org).not.toHaveProperty('taxID');
  });

  it('liga o WebSite à Organization pelo mesmo @id', () => {
    expect(websiteSchema().publisher).toEqual({
      '@id': organizacaoSchema()['@id']
    });
  });

  it('dá imagem a toda máquina, inclusive às que não têm foto', () => {
    for (const maquina of maquinasCatalogo) {
      const produto = maquinaSchema(maquina);
      expect(produto.name).toBeTruthy();
      expect(produto.description).toBeTruthy();
      expect(String(produto.image).startsWith(SITE_URL)).toBe(true);
    }
  });

  it('numera o breadcrumb a partir de 1 com URL absoluta', () => {
    const trilha = breadcrumbSchema([
      { nome: 'Início', path: '/' },
      { nome: 'Máquinas', path: '/maquinas' }
    ]);

    expect(trilha.itemListElement[0].position).toBe(1);
    expect(trilha.itemListElement[1].item).toBe(`${SITE_URL}/maquinas`);
  });

  it('conta o catálogo inteiro no ItemList', () => {
    const lista = catalogoSchema(maquinasCatalogo);
    expect(lista.numberOfItems).toBe(maquinasCatalogo.length);
  });

  it('junta resposta e tópicos em cada pergunta do FAQ', () => {
    const faq = faqSchema([
      { pergunta: 'Vocês instalam?', resposta: 'Sim.', topicos: ['No local.'] }
    ]);

    expect(faq.mainEntity[0].acceptedAnswer.text).toBe('Sim. No local.');
  });
});
