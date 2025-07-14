import { z } from "zod";

export const tripSchema = z
  .object({
    origin: z.string().min(2, "Informe a cidade de origem"),
    destination: z.string().min(2, "Informe o destino"),
    startDate: z.string().min(1, "Selecione a data de início"),
    endDate: z.string().min(1, "Selecione a data de fim"),
    budget: z.number().min(100, "Orçamento deve ser de pelo menos R$ 100"),
    interests: z.array(z.string()),

    title: z.string().optional(),
    adults: z.number().min(1, "Informe ao menos 1 adulto"),
    childrenString: z.string().optional(),

    travelStyle: z.string().optional(),
    transportPreference: z.string().optional(),
    accommodationPreference: z.string().optional(),
    dietaryRestrictions: z.string().optional(),
    accessibility: z.string().optional(),
    specialNotes: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Data de fim deve ser posterior à data de início",
    path: ["endDate"],
  });

export type TravelFormData = z.infer<typeof tripSchema>;
