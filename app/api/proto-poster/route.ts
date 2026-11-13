import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return new Response('só em dev', { status: 404 });
  }
  const { nome, dataUrl, pasta = 'posters' } = (await req.json()) as {
    nome: string;
    dataUrl: string;
    pasta?: string;
  };
  if (!/^[a-z0-9-]+$/.test(nome) || !/^[a-z]+$/.test(pasta)) {
    return new Response('nome inválido', { status: 400 });
  }
  const [cabeca, base64] = dataUrl.split(',');
  const ext = cabeca.includes('png') ? 'png' : 'webp';
  const dir = path.join(process.cwd(), 'public', 'proto', pasta);
  await mkdir(dir, { recursive: true });
  const buf = Buffer.from(base64, 'base64');
  await writeFile(path.join(dir, `${nome}.${ext}`), buf);
  return Response.json({ ok: true, bytes: buf.length });
}
