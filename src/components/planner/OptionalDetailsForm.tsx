import { UseFormRegister } from "react-hook-form";
import { TravelFormData } from "@/types/travel-form";

interface OptionalDetailsFormProps {
  register: UseFormRegister<TravelFormData>;
}

export function OptionalDetailsForm({ register }: OptionalDetailsFormProps) {
  return (
    <div className="space-y-8">
      {/* Preferência de hospedagem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferência de hospedagem
        </label>
        <select
          {...register("accommodationPreference")}
          className="minimal-input w-full"
        >
          <option value="">Sem preferência</option>
          <option value="Hotel luxo">Hotel (luxo)</option>
          <option value="Hotel boutique">Hotel (boutique)</option>
          <option value="Hotel econômico">Hotel (econômico)</option>
          <option value="Pousada">Pousada</option>
          <option value="Hostel">Hostel</option>
          <option value="Airbnb">Aluguel de temporada (Airbnb)</option>
        </select>
      </div>

      {/* Restrições alimentares */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Restrições alimentares
        </label>
        <input
          {...register("dietaryRestrictions")}
          type="text"
          placeholder="Ex: vegetariano, alergia a frutos do mar..."
          className="minimal-input w-full"
        />
      </div>

      {/* Acessibilidade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Necessidades de acessibilidade
        </label>
        <input
          {...register("accessibility")}
          type="text"
          placeholder="Ex: cadeira de rodas, mobilidade reduzida..."
          className="minimal-input w-full"
        />
      </div>

      {/* Campo de observações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Algum pedido ou observação especial?
        </label>
        <textarea
          {...register("specialNotes")}
          rows={4}
          placeholder="Ex: gostaria de conhecer mercados locais, evitar trilhas longas..."
          className="minimal-input w-full"
        />
      </div>
    </div>
  );
}
