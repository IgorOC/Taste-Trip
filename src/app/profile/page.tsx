"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Calendar, MapPin, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

const profileSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  // Carrega dados do usuário quando o componente monta
  useEffect(() => {
    if (user) {
      setValue("full_name", user.user_metadata?.full_name || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validação adicional no cliente
      if (data.full_name.trim().length < 2) {
        setError("Nome deve ter pelo menos 2 caracteres.");
        return;
      }

      if (
        data.email === user?.email &&
        data.full_name === user?.user_metadata?.full_name
      ) {
        setSuccess("Nenhuma alteração foi feita.");
        return;
      }

      // Atualiza o perfil no Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          full_name: data.full_name,
          name: data.full_name,
          first_name: data.full_name.split(" ")[0],
        },
      });

      if (updateError) {
        console.error("Erro ao atualizar perfil:", updateError);

        // Tratamento específico de diferentes tipos de erro
        if (updateError.message.includes("email")) {
          setError(
            "Erro ao alterar email. Verifique se o email é válido e não está em uso."
          );
        } else if (updateError.message.includes("rate")) {
          setError(
            "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente."
          );
        } else {
          setError(`Erro ao atualizar perfil: ${updateError.message}`);
        }
        return;
      }

      setSuccess("Perfil atualizado com sucesso!");

      // Se o email foi alterado, mostrar aviso sobre confirmação
      if (data.email !== user?.email) {
        setSuccess(
          "Perfil atualizado! Verifique seu email para confirmar as alterações."
        );
      }

      setTimeout(() => setSuccess(""), 5000);
    } catch (updateProfileError) {
      console.error("Erro inesperado ao atualizar perfil:", updateProfileError);

      // Tratamento de diferentes tipos de erro
      if (updateProfileError instanceof Error) {
        if (updateProfileError.message.includes("network")) {
          setError(
            "Erro de conexão. Verifique sua internet e tente novamente."
          );
        } else if (updateProfileError.message.includes("timeout")) {
          setError(
            "Tempo limite excedido. Tente novamente em alguns instantes."
          );
        } else {
          setError(`Erro inesperado: ${updateProfileError.message}`);
        }
      } else {
        setError("Erro inesperado. Tente novamente em alguns instantes.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para obter iniciais do usuário
  const getUserInitials = (): string => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  // Função auxiliar para obter nome do usuário
  const getUserDisplayName = (): string => {
    return (
      user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário"
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Link>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-medium">
                {getUserInitials()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600">
                Gerencie suas informações pessoais
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Perfil */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center">
                  <User className="h-5 w-5 mr-2 text-teal-600" />
                  Informações Pessoais
                </h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Mensagens */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                      {success}
                    </div>
                  )}

                  {/* Nome Completo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo
                    </label>
                    <input
                      {...register("full_name")}
                      type="text"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Seu nome completo"
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Alterar o email requer confirmação por email
                    </p>
                  </div>

                  {/* Botão Salvar */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Salvando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com informações adicionais */}
          <div className="space-y-6">
            {/* Informações da Conta */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Informações da Conta</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Email atual
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Nome atual
                    </p>
                    <p className="text-sm text-gray-500">
                      {getUserDisplayName()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Membro desde
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Provedor
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {user.app_metadata?.provider || "Email"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Ações Rápidas</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/dashboard"
                  className="flex items-center w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MapPin className="h-4 w-4 mr-3 text-teal-600" />
                  <span className="text-sm font-medium">Minhas Viagens</span>
                </Link>

                <Link
                  href="/planner"
                  className="flex items-center w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Calendar className="h-4 w-4 mr-3 text-teal-600" />
                  <span className="text-sm font-medium">
                    Planejar Nova Viagem
                  </span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4 mr-3 text-teal-600" />
                  <span className="text-sm font-medium">Configurações</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
