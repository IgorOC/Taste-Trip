"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CardHeader, CardContent } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { Header } from "@/components/layout/Header";
import { getBudgetCategory, formatCurrency } from "@/lib/utils";

const tripSchema = z
  .object({
    origin: z.string().min(2, "Informe a cidade de origem"),
    destination: z.string().min(2, "Informe o destino"),
    startDate: z.string().min(1, "Selecione a data de ida"),
    endDate: z.string().min(1, "Selecione a data de volta"),
    budget: z.number().min(100, "Orçamento deve ser de pelo menos R$ 100"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "Data de volta deve ser posterior à data de ida",
      path: ["endDate"],
    }
  );

type TripForm = z.infer<typeof tripSchema>;

export default function PlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<
    "baixo" | "medio" | "alto" | null
  >(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TripForm>({
    resolver: zodResolver(tripSchema),
  });

  const budget = watch("budget");

  // Update budget category when budget changes
  const handleBudgetChange = (value: number) => {
    setValue("budget", value);
    setSelectedBudgetRange(getBudgetCategory(value));
  };

  const onSubmit = async (data: TripForm) => {
    setIsLoading(true);
    setError("");

    try {
      // Send data to API to generate trip
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          budget_category: getBudgetCategory(data.budget),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao gerar roteiro");
      }

      // Redirect to trip result page
      router.push(`/trip/${result.tripId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          <div className="clean-card">
            <div className="p-12">
              <Loading size="lg" text="Gerando seu roteiro personalizado..." />
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-6 font-light">
                  Isso pode levar alguns segundos
                </p>
                <div className="flex justify-center space-x-8 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    Consultando clima
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    Gerando roteiro
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    Buscando gastronomia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <span>Brasil</span>
          <span>•</span>
          <span>Planejamento de Viagens</span>
        </div>

        <div className="mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-6">
            Planeje sua próxima <br />
            <span className="font-normal">aventura</span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl">
            Preencha os dados abaixo e nossa IA criará um roteiro personalizado
            para você
          </p>
        </div>

        <div className="clean-card">
          <CardHeader className="border-b border-gray-100">
            <h2 className="text-2xl font-light">Dados da Viagem</h2>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl text-sm">
                  {error}
                </div>
              )}

              {/* Origin and Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    De onde você está?
                  </label>
                  <Input
                    {...register("origin")}
                    className="minimal-input"
                    placeholder="Ex: São Paulo, SP"
                  />
                  {errors.origin && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.origin.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Para onde vai?
                  </label>
                  <Input
                    {...register("destination")}
                    className="minimal-input"
                    placeholder="Ex: Rio de Janeiro, RJ"
                  />
                  {errors.destination && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.destination.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Data de ida
                  </label>
                  <input
                    {...register("startDate")}
                    type="date"
                    className="minimal-input"
                  />
                  {errors.startDate && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Data de volta
                  </label>
                  <input
                    {...register("endDate")}
                    type="date"
                    className="minimal-input"
                  />
                  {errors.endDate && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Budget Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-6">
                  Qual seu orçamento total?
                </label>

                <div className="mb-8">
                  <Input
                    {...register("budget", { valueAsNumber: true })}
                    type="number"
                    placeholder="2000"
                    className="minimal-input text-xl font-semibold"
                  />
                  {budget && (
                    <p className="mt-3 text-sm text-gray-500 font-light">
                      Valor: {formatCurrency(budget)}
                    </p>
                  )}
                  {errors.budget && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.budget.message}
                    </p>
                  )}
                </div>

                {/* Budget Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleBudgetChange(1500)}
                    className={`p-6 border-2 rounded-2xl text-left transition-all hover:shadow-md ${
                      selectedBudgetRange === "baixo"
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                  >
                    <div className="font-medium text-teal-700 mb-3">
                      💸 Econômico
                    </div>
                    <div className="text-lg font-light text-gray-900 mb-3">
                      até R$ 2.000
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• Hostels, transporte público</div>
                      <div>• Comida local acessível</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBudgetChange(4000)}
                    className={`p-6 border-2 rounded-2xl text-left transition-all hover:shadow-md ${
                      selectedBudgetRange === "medio"
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                  >
                    <div className="font-medium text-teal-700 mb-3">
                      🏨 Confortável
                    </div>
                    <div className="text-lg font-light text-gray-900 mb-3">
                      R$ 2.000 - R$ 6.000
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• Hotéis 3⭐, mix de experiências</div>
                      <div>• Restaurantes locais</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBudgetChange(10000)}
                    className={`p-6 border-2 rounded-2xl text-left transition-all hover:shadow-md ${
                      selectedBudgetRange === "alto"
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                  >
                    <div className="font-medium text-teal-700 mb-3">
                      ✨ Premium
                    </div>
                    <div className="text-lg font-light text-gray-900 mb-3">
                      R$ 6.000+
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• Hotéis 4-5⭐, transfers privados</div>
                      <div>• Experiências exclusivas</div>
                    </div>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white text-lg py-4 rounded-2xl font-medium"
                disabled={isLoading}
              >
                Criar Roteiro com IA
              </Button>
            </form>
          </CardContent>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🌤️</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-3">
              Clima em Tempo Real
            </h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Roteiro adaptado às condições meteorológicas
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-3">
              Gastronomia Local
            </h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Pratos típicos com receitas e restaurantes
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-3">
              Orçamento Otimizado
            </h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Sugestões ideais para sua faixa de orçamento
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
