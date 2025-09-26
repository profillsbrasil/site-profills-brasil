import { sendMonteFabricaEmail } from "@/lib/emails/monte-fabrica/email-monte-fabrica";
import { monteFabricaFormSchema } from "@/lib/schemas/monte-fabrica-form";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar os dados usando o schema
    const validatedData = monteFabricaFormSchema.parse(body);

    console.log("=== NOVA SOLICITAÇÃO - MONTE SUA FÁBRICA ===");
    console.log("Data/Hora:", new Date().toLocaleString("pt-BR"));
    console.log("Dados da solicitação:", {
      nome: validatedData.nome,
      email: validatedData.email,
      telefone: validatedData.telefone,
      empresa: validatedData.empresa,
      projeto: {
        tipo: "Montagem de Fábrica Completa",
        descricao: validatedData.mensagem,
      },
    });

    // Enviar e-mail com os dados do projeto
    try {
      await sendMonteFabricaEmail(validatedData);
      // Log já é feito dentro da função sendMonteFabricaEmail
    } catch (emailError) {
      console.error("❌ Erro no envio do e-mail:", emailError);
      // Continuar mesmo se o e-mail falhar, mas registrar o erro
    }

    console.log("===========================================");

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
    console.error("Erro ao processar solicitação Monte sua Fábrica:", error);

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
