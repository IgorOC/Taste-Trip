import { Input } from "@/components/ui/Input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TravelFormData } from "@/types/travel-form";

interface TravelInfoFormProps {
  register: UseFormRegister<TravelFormData>;
  errors: FieldErrors<TravelFormData>;
}

export function TravelInfoForm({ register, errors }: TravelInfoFormProps) {
  return (
    <div className="space-y-8">
      {/* Nome do Roteiro */}
      <div>
        <label className="form-label">Nome do Roteiro (opcional)</label>
        <Input
          {...register("title")}
          className="minimal-input"
          placeholder="Ex: Viagem a Foz do Iguaçu"
        />
      </div>

      {/* Cidade de Origem */}
      <div>
        <label className="form-label">Cidade de Origem</label>
        <Input
          {...register("origin")}
          className="minimal-input"
          placeholder="Ex: São Paulo"
        />
        {errors.origin && <p className="form-error">{errors.origin.message}</p>}
      </div>

      {/* Destino */}
      <div>
        <label className="form-label">Destino Principal</label>
        <Input
          {...register("destination")}
          className="minimal-input"
          placeholder="Ex: Rio de Janeiro"
        />
        {errors.destination && (
          <p className="form-error">{errors.destination.message}</p>
        )}
      </div>

      {/* Datas */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="form-label">Data de Início</label>
          <input
            type="date"
            {...register("startDate")}
            className="minimal-input"
          />
          {errors.startDate && (
            <p className="form-error">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label className="form-label">Data de Fim</label>
          <input
            type="date"
            {...register("endDate")}
            className="minimal-input"
          />
          {errors.endDate && (
            <p className="form-error">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Viajantes */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="form-label">Número de Adultos</label>
          <Input
            type="number"
            min={1}
            {...register("adults", { valueAsNumber: true })}
            className="minimal-input"
          />
          {errors.adults && (
            <p className="form-error">{errors.adults.message}</p>
          )}
        </div>
        <div>
          <label className="form-label">
            Crianças (idades separadas por vírgula)
          </label>
          <Input
            {...register("childrenString")}
            className="minimal-input"
            placeholder="Ex: 3, 7"
          />
        </div>
      </div>
    </div>
  );
}
