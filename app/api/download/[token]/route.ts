import { NextRequest } from 'next/server';

import fs from 'node:fs';
import path from 'node:path';

import { verifyCatalogToken } from '@/lib/utils/jwt-catalog';
import { logger } from '@/lib/utils/logger';

const PDF_PATH = path.join(
  process.cwd(),
  'private/downloads/Catalogo_ProfillsCompany.pdf'
);
const PDF_FILENAME = 'Catalogo_ProfillsCompany.pdf';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const result = await verifyCatalogToken(token);

  if (!result.ok) {
    const url = new URL(`/download?error=${result.reason}`, request.url);
    return Response.redirect(url, 302);
  }

  if (!fs.existsSync(PDF_PATH)) {
    logger.error(`Catálogo PDF não encontrado em ${PDF_PATH}`);
    return new Response('Arquivo indisponível', { status: 500 });
  }

  const stat = fs.statSync(PDF_PATH);
  const stream = fs.createReadStream(PDF_PATH);

  return new Response(stream as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${PDF_FILENAME}"`,
      'Content-Length': String(stat.size),
      'Cache-Control': 'private, no-store'
    }
  });
}
