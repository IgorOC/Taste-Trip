import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

export function getBudgetCategory(budget: number): "baixo" | "medio" | "alto" {
  if (budget <= 2000) return "baixo";
  if (budget <= 6000) return "medio";
  return "alto";
}

export function getBudgetLabel(category: "baixo" | "medio" | "alto") {
  const labels = {
    baixo: "Econômico",
    medio: "Confortável",
    alto: "Premium",
  };
  return labels[category];
}

export function getDaysCount(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
