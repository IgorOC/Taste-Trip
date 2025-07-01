"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase";

// 🔐 Validação do formulário com Zod
const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos de uso",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Tentando registrar usuário:", {
        email: data.email,
        name: data.name,
      });

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            name: data.name,
          },
        },
      });

      console.log("Resposta do registro:", { authData, authError });

      if (authError) {
        console.error("Erro de registro:", authError);

        if (authError.message.includes("already registered")) {
          setError("Este email já está cadastrado. Tente fazer login.");
        } else if (authError.message.includes("Password should be")) {
          setError("A senha deve ter pelo menos 6 caracteres.");
        } else {
          setError(`Erro ao criar conta: ${authError.message}`);
        }
        return;
      }

      // Verificar se o usuário foi criado
      if (authData.user) {
        console.log("Usuário criado com sucesso:", authData.user);

        // Se já tem sessão ativa, redirecionar
        if (authData.session) {
          console.log("Sessão ativa, redirecionando...");
          router.push("/dashboard");
        } else {
          // Se não tem sessão, mostrar mensagem de confirmação
          setError("Conta criada! Verifique seu email para confirmar a conta.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Erro Google OAuth:", error);
        setError("Erro ao criar conta com Google");
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
          Criar conta gratuita
        </h1>
        <p className="text-gray-600 font-light">
          Comece a planejar suas viagens com inteligência artificial
        </p>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div
              className={`border px-6 py-4 rounded-2xl text-sm ${
                error.includes("Conta criada")
                  ? "bg-green-50 border-green-200 text-green-600"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Nome completo
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Seu nome completo"
              className="minimal-input"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Senha */}
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

          {/* Confirmar senha */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Confirmar senha
            </label>
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="minimal-input pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-11 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Termos de uso */}
          <div className="flex items-start space-x-3">
            <div className="flex items-center h-5">
              <input
                {...register("acceptTerms")}
                type="checkbox"
                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded"
              />
            </div>
            <div className="text-sm">
              <p className="text-gray-600 font-light">
                Ao criar uma conta, você concorda com nossos{" "}
                <Link
                  href="/terms"
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link
                  href="/privacy"
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Política de Privacidade
                </Link>
              </p>
              {errors.acceptTerms && (
                <p className="mt-1 text-red-600">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-medium"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta gratuita"}
          </Button>
        </form>

        {/* Google OAuth */}
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
            onClick={handleGoogleRegister}
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

        {/* Benefícios */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            O que você ganha:
          </h3>
          <div className="space-y-3">
            {[
              "Roteiros ilimitados com IA",
              "Clima em tempo real",
              "Gastronomia local personalizada",
              "Histórico de viagens salvo",
            ].map((item, index) => (
              <div className="flex items-center space-x-3" key={index}>
                <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-teal-600" />
                </div>
                <span className="text-sm text-gray-600 font-light">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="text-center p-8 border-t border-gray-100">
        <p className="text-sm text-gray-600 font-light">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Fazer login
          </Link>
        </p>
      </CardFooter>
    </div>
  );
}
