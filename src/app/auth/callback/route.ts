import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  console.log("🔍 Callback OAuth recebida:", {
    code: code ? `${code.substring(0, 10)}...` : null,
    origin,
    fullUrl: request.url,
  });

  if (code) {
    const supabase = createClient();

    try {
      console.log("🔄 Trocando código por sessão...");

      // Usar o método correto para trocar código por sessão
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("❌ Erro ao trocar código:", error.message);
        return NextResponse.redirect(
          `${origin}/login?error=exchange_failed&details=${encodeURIComponent(
            error.message
          )}`
        );
      }

      if (!data.session || !data.user) {
        console.error("❌ Nenhuma sessão ou usuário retornado");
        return NextResponse.redirect(`${origin}/login?error=no_session`);
      }

      console.log("✅ Sessão criada com sucesso:", {
        userId: data.user.id,
        email: data.user.email,
        provider: data.user.app_metadata?.provider,
      });

      // Criar ou atualizar usuário na tabela users
      try {
        const { error: upsertError } = await supabase.from("users").upsert(
          {
            id: data.user.id,
            email: data.user.email!,
            full_name:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              data.user.email?.split("@")[0],
          },
          {
            onConflict: "id",
          }
        );

        if (upsertError) {
          console.warn(
            "⚠️ Erro ao salvar usuário na tabela:",
            upsertError.message
          );
          // Não bloquear o login por causa disso
        } else {
          console.log("✅ Usuário salvo/atualizado na tabela users");
        }
      } catch (dbError) {
        console.warn("⚠️ Erro de banco:", dbError);
        // Não bloquear o login
      }
    } catch (error: unknown) {
      console.error("❌ Erro inesperado no callback:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return NextResponse.redirect(
        `${origin}/login?error=callback_exception&details=${encodeURIComponent(
          errorMessage
        )}`
      );
    }
  } else {
    console.log("❌ Nenhum código OAuth recebido");
    return NextResponse.redirect(`${origin}/login?error=no_auth_code`);
  }

  // Sucesso - redirecionar para dashboard
  console.log("🎉 Redirecionando para dashboard...");
  return NextResponse.redirect(`${origin}/dashboard`);
}
