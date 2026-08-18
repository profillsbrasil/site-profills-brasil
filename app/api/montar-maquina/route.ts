import { NextRequest, NextResponse } from 'next/server';

import { sendMontarMaquinaEmail } from '@/lib/emails/montar-maquina/email-montar-maquina';
import { montarMaquinaFormSchema } from '@/lib/schemas/montar-maquina-form';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = montarMaquinaFormSchema.parse(body);

    /* Sem try/catch aqui: falha de envio precisa virar 500 para o visitante
       ver o erro — engolir e responder sucesso perdia a solicitação em
       silêncio. O catch externo loga e responde. */
    await sendMontarMaquinaEmail(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitação enviada com sucesso!',
        data: { id: Date.now(), timestamp: new Date().toISOString() }
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    logger.error('Erro ao processar solicitação Montar sua Máquina:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Dados inválidos', errors: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
