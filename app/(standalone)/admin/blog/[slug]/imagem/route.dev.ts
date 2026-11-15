import { NextResponse } from 'next/server';

import { comMotivo } from '@/lib/blog/erro';
import { salvarImagem } from '@/lib/blog/repositorio';
import { slugSchema } from '@/lib/schemas/post-blog';

// Route handler e não Server Action: a Server Action limita o corpo a 1 MB, e a imagem vai até 5 MB.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ erro: 'Não encontrado.' }, { status: 404 });
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

  const tentativa = await comMotivo(() => salvarImagem(slug.data, arquivo));

  return tentativa.ok
    ? NextResponse.json({ caminho: tentativa.valor })
    : NextResponse.json(
        { erro: tentativa.motivo },
        { status: tentativa.doAutor ? 400 : 500 }
      );
}
