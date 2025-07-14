import { UseFormRegister, Control, useController } from "react-hook-form";
import { TravelFormData } from "@/types/travel-form";

interface PreferencesFormProps {
  register: UseFormRegister<TravelFormData>;
  control: Control<TravelFormData>;
}

export function PreferencesForm({ register, control }: PreferencesFormProps) {
  const { field: interestsField } = useController({
    name: "interests",
    control,
    defaultValue: [],
  });

  const toggleInterest = (interest: string) => {
    const current = interestsField.value || [];
    if (current.includes(interest)) {
      interestsField.onChange(current.filter((i: string) => i !== interest));
    } else {
      interestsField.onChange([...current, interest]);
    }
  };

  const interestOptions = [
    "Cultura e História",
    "Natureza e Aventura",
    "Gastronomia",
    "Vida Noturna",
    "Compras",
    "Relaxamento/Bem-estar",
    "Família",
    "Esportes",
    "Arte e Museus",
  ];

  const travelStyles = ["Agitado", "Moderado", "Relax"];
  const transportModes = [
    "A pé",
    "Transporte público",
    "Aplicativos de transporte/Táxi",
    "Carro alugado",
    "Bicicleta",
  ];

  return (
    <div className="space-y-10">
      {/* Interesses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Interesses principais
        </label>
        <div className="flex flex-wrap gap-3">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full border text-sm ${
                interestsField.value.includes(interest)
                  ? "bg-teal-100 border-teal-400 text-teal-700"
                  : "border-gray-300 text-gray-600 hover:border-teal-300"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Estilo de Viagem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Estilo de viagem
        </label>
        <select
          {...register("travelStyle")}
          className="minimal-input w-full"
          defaultValue=""
        >
          <option value="" disabled>
            Selecione
          </option>
          {travelStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      {/* Transporte preferido */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Meio de transporte preferido no destino
        </label>
        <select
          {...register("transportPreference")}
          className="minimal-input w-full"
          defaultValue=""
        >
          <option value="" disabled>
            Selecione
          </option>
          {transportModes.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
