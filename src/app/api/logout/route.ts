import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    console.log("Logout automático recebido:", body);

    // Aqui você pode adicionar lógica adicional se necessário
    // Por exemplo, invalidar tokens, limpar cache, etc.

    // O Supabase já lida com a invalidação do token automaticamente
    // mas você pode adicionar logs ou outras ações aqui

    return NextResponse.json({
      success: true,
      message: "Logout processado com sucesso",
    });
  } catch (error) {
    console.error("Erro no logout:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
