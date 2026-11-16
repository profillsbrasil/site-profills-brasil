import { NextResponse } from 'next/server';

import { abrirAdminBlog } from '@/lib/blog/admin';
import { MOTIVO_SEM_SESSAO, comMotivo } from '@/lib/blog/erro';
import { slugSchema } from '@/lib/schemas/post-blog';

// Route handler e não Server Action: a Server Action limita o corpo a 1 MB, e a imagem vai até 5 MB.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
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
    ? NextResponse.json({ caminho: tentativa.valor })
    : NextResponse.json(
        { erro: tentativa.motivo },
        { status: tentativa.doAutor ? 400 : 500 }
      );
}
