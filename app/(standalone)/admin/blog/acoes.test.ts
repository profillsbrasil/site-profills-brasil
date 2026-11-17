// @vitest-environment node
import { ErroBlog, MOTIVO_SEM_SESSAO, motivosImagem } from '@/lib/blog/erro';
import {
  type EntradaEditor,
  IMAGEM_LIMITE_BYTES,
  type Post,
  type PostGuardado
} from '@/lib/blog/tipos';

import { POST as enviarImagem } from './[slug]/imagem/route';
import { gravarPost } from './acoes';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const admin = vi.hoisted(() => ({
  listar: vi.fn(),
  ler: vi.fn(),
  gravar: vi.fn(),
  enviarImagem: vi.fn()
}));

// Sessão falsa: a action e a rota passam pela abrirAdminBlog de verdade, que pergunta à sessão.
const sessao = vi.hoisted(() => ({ autorAtual: vi.fn() }));

const cache = vi.hoisted(() => ({ refresh: vi.fn() }));

vi.mock('next/cache', () => cache);

vi.mock('@/lib/admin/sessao', () => sessao);

vi.mock('@/lib/blog/repositorio', () => ({ repositorioBlog: admin }));

const post: Post = {
  assunto: 'nota',
  titulo: 'Catálogo novo',
  resumo: '',
  capa: null,
  linhas: []
};

const guardado: PostGuardado = {
  slug: 'catalogo-novo',
  versao: 1,
  estado: 'rascunho',
  criadoEm: '2026-11-15T12:00:00.000Z',
  atualizadoEm: '2026-11-15T12:00:00.000Z',
  publicadoEm: null,
  post
};

const novo: EntradaEditor = { slug: null, versao: null, post };

const SITE = 'https://www.profills.com';

const pedidoImagem = (slug: string, origem: string | null = SITE) => {
  const corpo = new FormData();
  corpo.set('arquivo', new File([new Uint8Array([0x89])], 'a.png'));

  return enviarImagem(
    new Request(`http://localhost:8080/admin/blog/${slug}/imagem`, {
      method: 'POST',
      headers: origem ? { origin: origem } : {},
      body: corpo
    }),
    { params: Promise.resolve({ slug }) }
  );
};

beforeEach(() => {
  vi.stubEnv('SITE_URL', SITE);
  sessao.autorAtual.mockResolvedValue({ usuario: 'dono' });
  admin.enviarImagem.mockResolvedValue('/blog/catalogo-novo/a.png');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('gravação do admin do blog', () => {
  it('grava com a intenção pedida e devolve o post guardado', async () => {
    admin.gravar.mockResolvedValue(guardado);

    expect(await gravarPost(novo, 'publicar')).toEqual({ ok: true, guardado });
    expect(admin.gravar).toHaveBeenCalledWith(novo, 'publicar');
  });

  it('depois de gravar, invalida o cache do roteador do navegador', async () => {
    admin.gravar.mockResolvedValue(guardado);

    await gravarPost(novo, 'salvar');

    expect(cache.refresh).toHaveBeenCalledOnce();
  });

  it('gravação recusada não invalida o cache do roteador', async () => {
    admin.gravar.mockRejectedValue(new ErroBlog('Salvo em outra aba.'));

    await gravarPost({ slug: 'catalogo-novo', versao: 1, post }, 'salvar');
    await gravarPost({ ...novo, post: { ...post, capa: 'blob:x' } }, 'salvar');

    expect(cache.refresh).not.toHaveBeenCalled();
  });

  it('recusa sem sessão, sem tocar no banco nem no disco', async () => {
    sessao.autorAtual.mockResolvedValue(null);

    expect(await gravarPost(novo, 'salvar')).toEqual({
      ok: false,
      erro: MOTIVO_SEM_SESSAO
    });

    const imagem = await pedidoImagem('catalogo-novo');

    expect(imagem.status).toBe(401);
    expect(await imagem.json()).toEqual({ erro: MOTIVO_SEM_SESSAO });
    expect(admin.gravar).not.toHaveBeenCalled();
    expect(admin.enviarImagem).not.toHaveBeenCalled();
  });

  it('grava a imagem com o Origin do site, mesmo com o Host interno do proxy', async () => {
    const resposta = await pedidoImagem('catalogo-novo');

    expect(resposta.status).toBe(200);
    expect(admin.enviarImagem).toHaveBeenCalledOnce();
  });

  it.each([
    ['de um subdomínio irmão', 'https://crm.profills.com'],
    ['de outro site', 'https://evil.com'],
    ['que só começa com o host do site', 'https://www.profills.com.evil.com'],
    ['ausente', null]
  ])(
    'recusa a imagem com Origin %s, mesmo com a sessão do dono',
    async (_, origem) => {
      const resposta = await pedidoImagem('catalogo-novo', origem);

      expect(resposta.status).toBe(403);
      expect(admin.enviarImagem).not.toHaveBeenCalled();
    }
  );

  it('recusa pelo Content-Length acima do limite sem ler o corpo', async () => {
    const pedido = new Request(
      'http://localhost:8080/admin/blog/catalogo-novo/imagem',
      {
        method: 'POST',
        headers: {
          origin: SITE,
          'content-length': String(IMAGEM_LIMITE_BYTES + 1024 * 1024)
        },
        body: new FormData()
      }
    );

    const resposta = await enviarImagem(pedido, {
      params: Promise.resolve({ slug: 'catalogo-novo' })
    });

    expect(resposta.status).toBe(413);
    expect(await resposta.json()).toEqual({ erro: motivosImagem.tamanho });
    expect(pedido.bodyUsed).toBe(false);
    expect(admin.enviarImagem).not.toHaveBeenCalled();
  });

  it('sem Content-Length, lê o corpo como antes', async () => {
    const corpo = new FormData();
    corpo.set('arquivo', new File([new Uint8Array([0x89])], 'a.png'));

    const pedido = new Request(
      'http://localhost:8080/admin/blog/catalogo-novo/imagem',
      { method: 'POST', headers: { origin: SITE }, body: corpo }
    );

    expect(pedido.headers.get('content-length')).toBeNull();

    const resposta = await enviarImagem(pedido, {
      params: Promise.resolve({ slug: 'catalogo-novo' })
    });

    expect(resposta.status).toBe(200);
    expect(admin.enviarImagem).toHaveBeenCalledOnce();
  });

  it('sem SITE_URL, aceita qualquer Origin só no next dev', async () => {
    vi.stubEnv('SITE_URL', '');
    vi.stubEnv('NODE_ENV', 'production');

    expect((await pedidoImagem('catalogo-novo')).status).toBe(403);

    vi.stubEnv('NODE_ENV', 'development');

    expect(
      (await pedidoImagem('catalogo-novo', 'http://localhost:3000')).status
    ).toBe(200);
  });

  it('no next dev, aceita a própria página local mesmo com SITE_URL de produção no .env', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    expect(
      (await pedidoImagem('catalogo-novo', 'http://localhost:8080')).status
    ).toBe(200);

    vi.stubEnv('NODE_ENV', 'production');

    expect(
      (await pedidoImagem('catalogo-novo', 'http://localhost:8080')).status
    ).toBe(403);
  });

  it('recusa slug malicioso antes de chegar ao repositório', async () => {
    for (const slug of ['../conteudo', 'a/b', '..', 'A', 'x.json']) {
      expect(
        await gravarPost({ slug, versao: 1, post }, 'salvar')
      ).toMatchObject({
        ok: false
      });
      expect((await pedidoImagem(slug)).status).toBe(400);
    }

    expect(admin.gravar).not.toHaveBeenCalled();
    expect(admin.enviarImagem).not.toHaveBeenCalled();
  });

  it('recusa post fora do formato com o motivo', async () => {
    const resultado = await gravarPost(
      { ...novo, post: { ...post, capa: 'blob:http://localhost/abc' } },
      'salvar'
    );

    expect(!resultado.ok && resultado.erro).toContain('capa');
    expect(admin.gravar).not.toHaveBeenCalled();
  });

  it('recusa slug sem versão e intenção desconhecida', async () => {
    // A action recebe o que chegou pela rede; o JSON.parse faz o papel do cliente que foge do tipo.
    const semVersao = JSON.parse(
      JSON.stringify({ slug: 'catalogo-novo', versao: null, post })
    );

    expect(await gravarPost(semVersao, 'salvar')).toMatchObject({ ok: false });
    expect(await gravarPost(novo, JSON.parse('"apagar"'))).toEqual({
      ok: false,
      erro: 'Ação de gravação desconhecida.'
    });
    expect(admin.gravar).not.toHaveBeenCalled();
  });

  it('devolve o aviso de conflito de outra aba como motivo', async () => {
    admin.gravar.mockRejectedValue(
      new ErroBlog('Este post foi salvo em outra aba às 14h32.')
    );

    expect(
      await gravarPost({ slug: 'catalogo-novo', versao: 1, post }, 'salvar')
    ).toEqual({
      ok: false,
      erro: 'Este post foi salvo em outra aba às 14h32.'
    });
  });

  it('devolve o código quando o banco recusa a gravação', async () => {
    admin.gravar.mockRejectedValue(
      Object.assign(new Error('conexão recusada'), { code: 'ECONNREFUSED' })
    );

    expect(await gravarPost(novo, 'salvar')).toEqual({
      ok: false,
      erro: 'Não foi possível gravar (ECONNREFUSED).'
    });
  });
});
