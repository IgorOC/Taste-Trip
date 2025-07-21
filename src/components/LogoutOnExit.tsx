"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";

export function BrowserCloseLogout() {
  const supabase = createClient();

  useEffect(() => {
    // Estratégia mais simples: usar sessionStorage para detectar fechamento do navegador
    // sessionStorage é limpo quando TODAS as abas do site são fechadas

    const SESSION_KEY = "user_session_active";

    // Marca que há uma sessão ativa
    const markSessionActive = () => {
      sessionStorage.setItem(SESSION_KEY, "true");
    };

    // Verifica se é uma nova sessão (navegador foi fechado e reaberto)
    const checkIfNewSession = () => {
      const hasActiveSession = sessionStorage.getItem(SESSION_KEY);

      if (!hasActiveSession) {
        // Navegador foi fechado completamente, limpa possíveis dados antigos
        localStorage.removeItem("lastTabActivity");
        // Não precisa fazer logout aqui pois sessionStorage já foi limpo
      }

      markSessionActive();
    };

    // Função para logout quando todas as abas são fechadas
    const handleAllTabsClosed = async () => {
      try {
        // Este código só executa se o sessionStorage ainda existe
        // Quando todas as abas fecham, sessionStorage é automaticamente limpo
        await supabase.auth.signOut();
        localStorage.clear();
      } catch (error) {
        console.error("Erro no logout automático:", error);
      }
    };

    // Inicializa
    checkIfNewSession();

    // Atualiza status da sessão periodicamente
    const sessionInterval = setInterval(markSessionActive, 10000); // A cada 10 segundos

    // Listener para beforeunload - só faz logout se for a última aba
    const handleBeforeUnload = () => {
      // Pequeno delay para permitir que outras abas atualizem sessionStorage
      setTimeout(() => {
        const stillActive = sessionStorage.getItem(SESSION_KEY);
        if (!stillActive) {
          handleAllTabsClosed();
        }
      }, 100);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(sessionInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [supabase.auth]);

  return null; // Componente invisível
}
