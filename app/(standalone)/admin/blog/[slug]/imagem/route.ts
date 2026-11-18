import { NextResponse } from 'next/server';

import { abrirAdminBlog } from '@/lib/blog/admin';
import { MOTIVO_SEM_SESSAO, comMotivo, motivosImagem } from '@/lib/blog/erro';
import { IMAGEM_LIMITE_BYTES } from '@/lib/blog/tipos';
import { slugSchema } from '@/lib/schemas/post-blog';

function origemDoSite(request: Request) {
  const emDev = process.env.NODE_ENV === 'development';
  const site = process.env.SITE_URL;

  if (!site) return emDev;

  const origem = request.headers.get('origin');
  const hostDaOrigem = origem === null ? undefined : URL.parse(origem)?.host;

  if (hostDaOrigem === undefined) return false;

  return (
    hostDaOrigem === URL.parse(site)?.host ||
    (emDev && hostDaOrigem === URL.parse(request.url)?.host)
  );
}

const FOLGA_DO_MULTIPART_BYTES = 64 * 1024;
const CORPO_LIMITE_BYTES = IMAGEM_LIMITE_BYTES + FOLGA_DO_MULTIPART_BYTES;

// WARNING: a Server Action limita o corpo a 1 MB e a imagem vai até 5 MB; o envio fica em route handler.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!origemDoSite(request)) {
    return NextResponse.json(
      { erro: 'Envio recusado: a página não é do site.' },
      { status: 403 }
    );
  }

  const admin = await abrirAdminBlog();

  if (!admin) {
    return NextResponse.json({ erro: MOTIVO_SEM_SESSAO }, { status: 401 });
  }

  const slug = slugSchema.safeParse((await params).slug);

  if (!slug.success) {
    return NextResponse.json(
      { erro: 'Endereço do post inválido.' },
      { status: 400 }
    );
  }

  if (Number(request.headers.get('content-length')) > CORPO_LIMITE_BYTES) {
    return NextResponse.json({ erro: motivosImagem.tamanho }, { status: 413 });
  }

  const arquivo = (await request.formData()).get('arquivo');

  if (!(arquivo instanceof File)) {
    return NextResponse.json(
      { erro: 'Nenhuma imagem chegou ao servidor.' },
      { status: 400 }
    );
  }

  const tentativa = await comMotivo(() =>
    admin.enviarImagem(slug.data, arquivo)
  );

  return tentativa.ok
    ? NextResponse.json({
        caminho: tentativa.valor,
        imagens: await admin.contarImagens()
      })
    : NextResponse.json(
        { erro: tentativa.motivo },
        { status: tentativa.doAutor ? 400 : 500 }
      );
}
