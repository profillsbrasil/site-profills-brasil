import { NextRequest, NextResponse } from 'next/server';

import {
  sendClientCatalogEmail,
  sendLeadNotification
} from '@/lib/emails/catalog-request/email-catalog';
import { resolverDestinatario } from '@/lib/indicacao/destinatario';
import { catalogRequestSchema } from '@/lib/schemas/catalog-request';
import { SITE_URL } from '@/lib/seo/site';
import { signCatalogToken } from '@/lib/utils/jwt-catalog';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = catalogRequestSchema.parse(body);
    const destinatario = await resolverDestinatario(request);

    const token = await signCatalogToken(
      { email: data.email, name: data.name },
      '7d'
    );
    const siteUrl = SITE_URL;
    const downloadUrl = `${siteUrl}/api/download/${token}`;

    await Promise.all([
      sendClientCatalogEmail({
        name: data.name,
        email: data.email,
        downloadUrl
      }),
      sendLeadNotification(data, destinatario)
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error('Erro ao processar solicitação de catálogo:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Dados inválidos',
          errors: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao enviar o catálogo. Tente novamente.'
      },
      { status: 500 }
    );
  }
}
