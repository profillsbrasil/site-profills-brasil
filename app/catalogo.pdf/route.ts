import fs from 'node:fs';
import path from 'node:path';

import { logger } from '@/lib/utils/logger';

const PDF_PATH = path.join(
  process.cwd(),
  'private/downloads/Catalogo_ProfillsCompany.pdf'
);
const PDF_FILENAME = 'Catalogo_ProfillsCompany.pdf';

export const runtime = 'nodejs';

export async function GET() {
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
      'Content-Disposition': `inline; filename="${PDF_FILENAME}"`,
      'Content-Length': String(stat.size),
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
