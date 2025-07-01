"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Tentando login com:", { email: data.email });

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email.trim(),
          password: data.password,
        });

      console.log("Resposta do login:", { authData, authError });

      if (authError) {
        console.error("Erro de autenticação:", authError);

        if (authError.message.includes("Invalid login credentials")) {
          setError("Email ou senha incorretos");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Por favor, confirme seu email antes de fazer login");
        } else {
          setError("Erro ao fazer login. Tente novamente.");
        }
        return;
      }

      if (authData.user) {
        console.log("Login bem-sucedido!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Erro Google OAuth:", error);
        setError("Erro ao fazer login com Google");
      }
    } catch (err) {
      console.error("Erro inesperado Google:", err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clean-card">
      <CardHeader className="text-center border-b border-gray-100">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          Entrar na sua conta
        </h1>
        <p className="text-gray-600 font-light">
          Acesse seu histórico de viagens e crie novos roteiros
        </p>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="seu@email.com"
              className="minimal-input"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Senha
            </label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="minimal-input pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-11 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-medium"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-light">ou</span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full mt-6 border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 py-4 rounded-2xl font-medium bg-white"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </Button>
        </div>
      </CardContent>

      <CardFooter className="text-center p-8 border-t border-gray-100">
        <p className="text-sm text-gray-600 font-light">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Criar conta gratuita
          </Link>
        </p>
        <div className="mt-3">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-500 hover:text-gray-700 font-light"
          >
            Esqueci minha senha
          </Link>
        </div>
      </CardFooter>
    </div>
  );
}
