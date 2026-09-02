import { NextRequest, NextResponse } from 'next/server';

import { sendSpecificationEmail } from '@/lib/emails/solicitar-especificacoes/email-especificacoes';
import { resolverDestinatario } from '@/lib/indicacao/destinatario';
import { specificationFormSchema } from '@/lib/schemas/specification-form';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = specificationFormSchema.parse(body);
    const destinatario = await resolverDestinatario(request);

    /* Sem try/catch aqui: falha de envio precisa virar 500 para o visitante
       ver o erro — engolir e responder sucesso perdia a solicitação em
       silêncio. O catch externo loga e responde. */
    await sendSpecificationEmail(validatedData, destinatario);

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitação enviada com sucesso!',
        data: {
          id: Date.now(),
          timestamp: new Date().toISOString()
        },
        /* Só o código: o client usa para o evento de analytics. */
        indicacao: destinatario.vendedor
          ? { codigo: destinatario.vendedor.referral_code }
          : null
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Erro ao processar solicitação de especificações:', error);

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
        message: 'Erro interno do servidor'
      },
      { status: 500 }
    );
  }
}
