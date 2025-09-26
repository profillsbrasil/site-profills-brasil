import { sendContactEmail } from "@/lib/emails/contact-form/email-contact";
import { contactFormSchema } from "@/lib/schemas/contact-form";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    // Enviar e-mail com os dados do contato
    try {
      await sendContactEmail(validatedData);
    } catch (emailError) {
      console.error("❌ Erro no envio do e-mail:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Solicitação enviada com sucesso!",
        data: {
          id: Date.now(),
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Erro ao processar solicitação de orçamento:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Dados inválidos",
          errors: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 },
    );
  }
}
