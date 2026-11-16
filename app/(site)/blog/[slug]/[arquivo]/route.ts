import { lerImagem } from '@/lib/blog/leitura';
import { PADRAO_CAMINHO_IMAGEM } from '@/lib/schemas/post-blog';
import { logger } from '@/lib/utils/logger';

const ausente = () =>
  new Response(null, {
    status: 404,
    headers: { 'Cache-Control': 'public, max-age=60' }
  });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; arquivo: string }> }
) {
  const { slug, arquivo } = await params;
  const caminho = `/blog/${slug}/${arquivo}`;

  if (!PADRAO_CAMINHO_IMAGEM.test(caminho)) return ausente();

  let imagem;

  try {
    imagem = await lerImagem(caminho);
  } catch (erro) {
    logger.error(`Armazém fora ao ler ${caminho}`, erro);

    return new Response(null, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' }
    });
  }

  if (!imagem) return ausente();

  return new Response(imagem.corpo, {
    headers: {
      'Content-Type': imagem.tipo,
      'Content-Length': String(imagem.tamanho),
      'X-Content-Type-Options': 'nosniff',
      // O nome carrega o hash do conteúdo: a mesma URL nunca muda de bytes.
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
