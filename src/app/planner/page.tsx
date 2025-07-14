"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Header } from "@/components/layout/Header";
import { Loading } from "@/components/ui/Loading";
import { CardHeader, CardContent } from "@/components/ui/Card";
import { getBudgetCategory } from "@/lib/utils";

import { TravelInfoForm } from "@/components/planner/TravelInfoForm";
import { BudgetSelector } from "@/components/planner/BudgetSelector";
import { PreferencesForm } from "@/components/planner/PreferencesForm";
import { OptionalDetailsForm } from "@/components/planner/OptionalDetailsForm";
import { SubmitButton } from "@/components/planner/SubmitButton";
import { tripSchema, TravelFormData } from "@/types/travel-form";

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
    control,
    setValue,
    formState: { errors },
  } = useForm<TravelFormData>({
    resolver: zodResolver(tripSchema),
  });

  const budget = watch("budget");

  const handleBudgetChange = (value: number) => {
    setValue("budget", value);
    setSelectedBudgetRange(getBudgetCategory(value));
  };


  
  const onSubmit = async (data: TravelFormData) => {
  console.log("🚀 Função onSubmit chamada!"); 
  console.log("Erros do formulário:", errors);
    console.log("Enviando dados do formulário:", data);
    setIsLoading(true);
    setError("");

    try {
      const children = data.childrenString
        ?.split(",")
        .map((age) => Number(age.trim()))
        .filter((age) => !isNaN(age) && age >= 0 && age <= 17)
        .map((age) => ({ age }));

      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          children,
          budget_category: getBudgetCategory(data.budget),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao gerar roteiro");
      }

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
          <div className="clean-card p-12">
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
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl text-sm">
                  {error}
                </div>
              )}
              <TravelInfoForm register={register} errors={errors} />
              <BudgetSelector
                budget={budget}
                error={errors.budget?.message}
                register={register}
                selectedBudgetRange={selectedBudgetRange}
                handleBudgetChange={handleBudgetChange}
              />
              <PreferencesForm register={register} control={control} />
              <OptionalDetailsForm register={register} />
              <SubmitButton isLoading={isLoading} />
            </form>
          </CardContent>
        </div>
      </main>
    </div>
  );
}
