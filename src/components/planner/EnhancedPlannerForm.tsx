"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Settings,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

const plannerSchema = z.object({
  destination: z.string().min(2, "Destino deve ter pelo menos 2 caracteres"),
  origin: z.string().min(2, "Origem deve ter pelo menos 2 caracteres"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de fim é obrigatória"),
  adults: z.number().min(1, "Pelo menos 1 adulto").max(20, "Máximo 20 pessoas"),
  budget: z.number().min(100, "Orçamento mínimo de R$ 100"),
  budgetCategory: z.enum(["baixo", "medio", "alto"]),
  travelStyle: z.string().min(1, "Selecione um estilo de viagem"),
  includeFood: z.boolean(),
  includeWeather: z.boolean(),
});

type PlannerForm = z.infer<typeof plannerSchema>;

export default function EnhancedPlannerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const {
    settings,
    isLoaded,
    formatCurrency,
    convertCurrency,
    getDefaultFormData,
  } = useUserSettings();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlannerForm>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      adults: 1,
      includeFood: true,
      includeWeather: true,
    },
  });

  const watchedBudget = watch("budget");
  const watchedBudgetCategory = watch("budgetCategory");

  // Carrega valores padrão das configurações quando disponível
  useEffect(() => {
    if (isLoaded) {
      const defaults = getDefaultFormData();

      // Pré-preenche apenas se os campos estiverem vazios
      setValue("origin", defaults.origin);
      setValue("budgetCategory", defaults.budgetRange);
      setValue("travelStyle", defaults.travelStyle);
      setValue("includeFood", defaults.includeFood);
      setValue("includeWeather", defaults.includeWeather);

      // Define data padrão baseada na duração configurada
      const today = new Date();
      const startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias a partir de hoje
      const endDate = new Date(
        startDate.getTime() + defaults.duration * 24 * 60 * 60 * 1000
      );

      setValue("startDate", startDate.toISOString().split("T")[0]);
      setValue("endDate", endDate.toISOString().split("T")[0]);

      // Define orçamento baseado na categoria e moeda
      const budgetDefaults = {
        baixo: 1500,
        medio: 5000,
        alto: 12000,
      };
      const defaultBudgetBRL = budgetDefaults[defaults.budgetRange];
      const convertedBudget = convertCurrency(defaultBudgetBRL);
      setValue("budget", convertedBudget);
    }
  }, [isLoaded, setValue, getDefaultFormData, convertCurrency]);

  // Atualiza orçamento quando categoria muda
  useEffect(() => {
    if (watchedBudgetCategory && isLoaded) {
      const budgetRanges = {
        baixo: 1500,
        medio: 5000,
        alto: 12000,
      };
      const baseBudget = budgetRanges[watchedBudgetCategory];
      const convertedBudget = convertCurrency(baseBudget);
      setValue("budget", convertedBudget);
    }
  }, [watchedBudgetCategory, isLoaded, convertCurrency, setValue]);

  const onSubmit = async (data: PlannerForm) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Validação adicional das datas
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const today = new Date();

      if (startDate < today) {
        setError("A data de início não pode ser no passado.");
        return;
      }

      if (endDate <= startDate) {
        setError("A data de fim deve ser posterior à data de início.");
        return;
      }

      // Log dos dados para debug
      console.log("Dados da viagem:", {
        ...data,
        userId: user.id,
        userSettings: {
          currency: settings.currency,
          includeFood: data.includeFood,
          includeWeather: data.includeWeather,
        },
      });

      // Aqui você enviaria os dados para sua API de criação de viagem
      // Simulação de chamada API
      const response = await simulateAPICall(data, user.id, settings);

      if (response.success) {
        // Redirecionar para a viagem criada
        router.push(`/dashboard?created=true&tripId=${response.tripId}`);
      } else {
        setError(response.error || "Erro ao criar roteiro. Tente novamente.");
      }
    } catch (createTripError) {
      console.error("Erro ao criar viagem:", createTripError);

      // Tratamento específico de diferentes tipos de erro
      if (createTripError instanceof Error) {
        if (createTripError.message.includes("network")) {
          setError(
            "Erro de conexão. Verifique sua internet e tente novamente."
          );
        } else if (createTripError.message.includes("validation")) {
          setError("Dados inválidos. Verifique os campos e tente novamente.");
        } else {
          setError(`Erro ao criar roteiro: ${createTripError.message}`);
        }
      } else {
        setError("Erro inesperado. Tente novamente em alguns instantes.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para simular chamada de API
  const simulateAPICall = async (
    data: PlannerForm,
    userId: string,
    userSettings: typeof settings
  ): Promise<{ success: boolean; tripId?: string; error?: string }> => {
    // Log dos dados para debug (em desenvolvimento)
    if (process.env.NODE_ENV === "development") {
      console.log("Simulando criação de viagem:", {
        destination: data.destination,
        origin: data.origin,
        duration: `${Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24))} dias`,
        budget: formatCurrency(data.budget), // Usando a função do hook
        travelers: data.adults,
        userId: userId.substring(0, 8) + "...", // Mascarar ID por segurança
        style: data.travelStyle,
        currency: userSettings.currency,
        features: {
          food: data.includeFood,
          weather: data.includeWeather,
        },
      });
    }

    // Simulação de delay da API (varia entre 1-3 segundos)
    const delay = 1000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Simulação de diferentes cenários de erro baseados nos dados
    const hasValidDestination = data.destination.length > 2;
    const hasValidBudget = data.budget > 0;
    const hasValidDates = new Date(data.endDate) > new Date(data.startDate);

    // 95% de sucesso para dados válidos, menor para dados inválidos
    const successRate =
      hasValidDestination && hasValidBudget && hasValidDates ? 0.95 : 0.7;
    const isSuccess = Math.random() < successRate;

    if (isSuccess) {
      // Gerar ID único baseado nos dados da viagem
      const tripId = `trip_${userId.substring(0, 8)}_${Date.now()}`;

      return {
        success: true,
        tripId,
      };
    } else {
      // Diferentes tipos de erro baseados nos dados
      let errorMessage =
        "Serviço temporariamente indisponível. Tente novamente.";

      if (!hasValidDestination) {
        errorMessage = "Destino inválido. Verifique o nome da cidade.";
      } else if (!hasValidBudget) {
        errorMessage = "Orçamento inválido. Verifique o valor informado.";
      } else if (!hasValidDates) {
        errorMessage = "Datas inválidas. Verifique o período da viagem.";
      } else if (data.budget < 500) {
        errorMessage = "Orçamento muito baixo para gerar um roteiro adequado.";
      } else {
        // Erros aleatórios mais realistas
        const errors = [
          "Limite de requisições excedido. Tente novamente em alguns minutos.",
          "Erro interno do servidor. Nossa equipe foi notificada.",
          "Destino temporariamente indisponível para planejamento.",
          "Falha na conexão com os serviços de IA. Tente novamente.",
        ];
        errorMessage = errors[Math.floor(Math.random() * errors.length)];
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Planejar Nova Viagem
                </h1>
                <p className="text-gray-600">
                  Crie um roteiro personalizado com IA
                </p>
              </div>
            </div>

            <Link
              href="/settings"
              className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="text-sm">Configurações</span>
            </Link>
          </div>

          {/* Info sobre configurações aplicadas */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-teal-600 mt-0.5" />
              <div>
                <p className="text-sm text-teal-800 font-medium">
                  Configurações aplicadas automaticamente:
                </p>
                <ul className="text-sm text-teal-700 mt-1 space-y-1">
                  <li>• Moeda: {settings.currency}</li>
                  {settings.defaultLocation && (
                    <li>• Origem: {settings.defaultLocation}</li>
                  )}
                  <li>• Estilo: {settings.travelStyle}</li>
                  <li>• Duração padrão: {settings.defaultTripDuration} dias</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Detalhes da Viagem</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Destinos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Destino
                  </label>
                  <input
                    {...register("destination")}
                    type="text"
                    placeholder="Para onde você quer ir?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                  {errors.destination && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.destination.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Origem
                  </label>
                  <input
                    {...register("origin")}
                    type="text"
                    placeholder="De onde você vai partir?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                  {errors.origin && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.origin.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Data de Início
                  </label>
                  <input
                    {...register("startDate")}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Data de Fim
                  </label>
                  <input
                    {...register("endDate")}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Viajantes e Orçamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-2" />
                    Número de Adultos
                  </label>
                  <input
                    {...register("adults", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                  {errors.adults && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.adults.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-2" />
                    Orçamento Total ({settings.currency})
                  </label>
                  <input
                    {...register("budget", { valueAsNumber: true })}
                    type="number"
                    min="100"
                    step="50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                  {watchedBudget && (
                    <p className="mt-1 text-xs text-gray-500">
                      {formatCurrency(watchedBudget)}
                    </p>
                  )}
                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.budget.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Categoria e Estilo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria de Orçamento
                  </label>
                  <select
                    {...register("budgetCategory")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    <option value="baixo">Econômico (até R$ 2.000)</option>
                    <option value="medio">
                      Intermediário (R$ 2.000 - R$ 8.000)
                    </option>
                    <option value="alto">Premium (acima de R$ 8.000)</option>
                  </select>
                  {errors.budgetCategory && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.budgetCategory.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estilo de Viagem
                  </label>
                  <select
                    {...register("travelStyle")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    <option value="aventura">Aventura e esportes</option>
                    <option value="cultural">Cultural e histórico</option>
                    <option value="relaxante">Relaxante e wellness</option>
                    <option value="gastronomico">Gastronômico</option>
                    <option value="familia">Em família</option>
                    <option value="romantico">Romântico</option>
                    <option value="negocio">Negócios</option>
                  </select>
                  {errors.travelStyle && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.travelStyle.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Preferências */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Incluir no Roteiro
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      {...register("includeFood")}
                      type="checkbox"
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium">
                      Recomendações gastronômicas
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      {...register("includeWeather")}
                      type="checkbox"
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium">
                      Informações climáticas
                    </span>
                  </label>
                </div>
              </div>

              {/* Botão Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Criando seu roteiro personalizado...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Criar Roteiro com IA
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
