import { UseFormRegister } from "react-hook-form";
import { TravelFormData } from "@/types/travel-form";

interface BudgetSelectorProps {
  budget: number;
  error?: string;
  register: UseFormRegister<TravelFormData>;
  selectedBudgetRange: "baixo" | "medio" | "alto" | null;
  handleBudgetChange: (value: number) => void;
}

export function BudgetSelector({
  selectedBudgetRange,
  handleBudgetChange,
  budget,
  error,
}: BudgetSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-6">
        Qual seu orçamento total?
      </label>

      <div className="mb-8">
        <input
          type="number"
          onChange={(e) => handleBudgetChange(Number(e.target.value))}
          placeholder="2000"
          className="minimal-input text-xl font-semibold"
        />
        {budget && (
          <p className="mt-3 text-sm text-gray-500 font-light">
            Valor: R$
            {budget.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Faixas de orçamento */}
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
          <div className="font-medium text-teal-700 mb-3">💸 Econômico</div>
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
          <div className="font-medium text-teal-700 mb-3">🏨 Confortável</div>
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
          <div className="font-medium text-teal-700 mb-3">✨ Premium</div>
          <div className="text-lg font-light text-gray-900 mb-3">R$ 6.000+</div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• Hotéis 4-5⭐, transfers privados</div>
            <div>• Experiências exclusivas</div>
          </div>
        </button>
      </div>
    </div>
  );
}
