"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        // Redireciona para página de login após logout manual
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    // Busca sessão inicial
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Erro ao buscar sessão:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escuta mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Se o usuário fez logout, redireciona
      if (event === "SIGNED_OUT") {
        window.location.href = "/login";
      }
    });

    // Marca que há uma aba ativa
    const markTabActive = () => {
      sessionStorage.setItem("tabActive", "true");
      localStorage.setItem("lastTabActivity", Date.now().toString());
    };

    // Função para fazer logout apenas quando fechar o navegador completamente
    const handleBrowserClose = () => {
      // Remove a marca desta aba
      sessionStorage.removeItem("tabActive");

      // Aguarda um pouco para ver se há outras abas
      setTimeout(async () => {
        // Verifica se ainda há abas ativas checando o localStorage
        const lastActivity = localStorage.getItem("lastTabActivity");
        const now = Date.now();

        // Se passou mais de 2 segundos sem atividade de outras abas,
        // considera que o navegador foi fechado completamente
        if (!lastActivity || now - parseInt(lastActivity) > 2000) {
          try {
            await supabase.auth.signOut();
            localStorage.clear();
            sessionStorage.clear();
          } catch (error) {
            console.error("Erro no logout automático:", error);
          }
        }
      }, 1000);
    };

    // Atualiza atividade da aba atual
    const updateTabActivity = () => {
      if (document.visibilityState === "visible") {
        markTabActive();
      }
    };

    // Marca esta aba como ativa ao carregar
    markTabActive();

    // Event listeners apenas para detectar fechamento completo do navegador
    window.addEventListener("beforeunload", handleBrowserClose);

    // Atualiza atividade quando a aba fica visível (para outras abas saberem que há atividade)
    document.addEventListener("visibilitychange", updateTabActivity);

    // Atualiza atividade periodicamente enquanto a aba está ativa
    const activityInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        markTabActive();
      }
    }, 5000); // A cada 5 segundos

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("beforeunload", handleBrowserClose);
      document.removeEventListener("visibilitychange", updateTabActivity);
      clearInterval(activityInterval);
    };
  }, [supabase.auth]);

  const value = {
    user,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    return {
      user: null,
      loading: false,
      logout: async () => {
        console.warn("Logout called outside of AuthProvider");
      },
    };
  }

  return context;
};
