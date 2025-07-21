// utils/integration.ts
import { UserSettings } from "@/hooks/useUserSettings";
import { EmailService } from "@/lib/email-service";
import { UseFormSetValue } from "react-hook-form";

export interface IntegrationConfig {
  userSettings: UserSettings;
  userId: string;
  userEmail: string;
  userName: string;
}

export interface TripFormData {
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  adults: number;
  budget: number;
  budgetCategory: "baixo" | "medio" | "alto";
  travelStyle: string;
  includeFood: boolean;
  includeWeather: boolean;
}

export interface TripData {
  id: string;
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  budget: number;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

type CurrencyCode =
  | "BRL"
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "AUD"
  | "CHF";
type BudgetCategory = "baixo" | "medio" | "alto";

export class IntegrationManager {
  // Aplica configurações do usuário no formulário de planner
  static applyUserSettingsToForm(
    settings: UserSettings,
    setValue: UseFormSetValue<TripFormData>
  ): void {
    // Pré-preenche origem se configurada
    if (settings.defaultLocation) {
      setValue("origin", settings.defaultLocation);
    }

    // Define categoria de orçamento
    setValue("budgetCategory", settings.defaultBudgetRange);

    // Define estilo de viagem
    setValue("travelStyle", settings.travelStyle);

    // Define preferências de IA
    setValue("includeFood", settings.includeFood);
    setValue("includeWeather", settings.includeWeather);

    // Calcula datas baseado na duração padrão
    const today = new Date();
    const startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias a partir de hoje
    const duration = parseInt(settings.defaultTripDuration);
    const endDate = new Date(
      startDate.getTime() + duration * 24 * 60 * 60 * 1000
    );

    setValue("startDate", startDate.toISOString().split("T")[0]);
    setValue("endDate", endDate.toISOString().split("T")[0]);

    // Define orçamento baseado na categoria e moeda
    const budgetDefaults: Record<BudgetCategory, number> = {
      baixo: 1500,
      medio: 5000,
      alto: 12000,
    };

    const defaultBudgetBRL = budgetDefaults[settings.defaultBudgetRange];
    const convertedBudget = this.convertCurrency(
      defaultBudgetBRL,
      settings.currency as CurrencyCode
    );
    setValue("budget", convertedBudget);
  }

  // Converte valores de orçamento entre moedas
  static convertCurrency(
    amountInBRL: number,
    targetCurrency: CurrencyCode
  ): number {
    const rates: Record<CurrencyCode, number> = {
      BRL: 1,
      USD: 0.2, // 1 USD ≈ 5 BRL
      EUR: 0.18, // 1 EUR ≈ 5.5 BRL
      GBP: 0.16, // 1 GBP ≈ 6.2 BRL
      JPY: 30, // 1 JPY ≈ 0.033 BRL
      CAD: 0.27, // 1 CAD ≈ 3.7 BRL
      AUD: 0.3, // 1 AUD ≈ 3.3 BRL
      CHF: 0.18, // 1 CHF ≈ 5.5 BRL
    };

    const rate = rates[targetCurrency] || rates.BRL;
    return Math.round(amountInBRL * rate);
  }

  // Formata moeda baseado na configuração
  static formatCurrency(amount: number, currency: CurrencyCode): string {
    const currencyMap: Record<
      CurrencyCode,
      { locale: string; currency: string }
    > = {
      BRL: { locale: "pt-BR", currency: "BRL" },
      USD: { locale: "en-US", currency: "USD" },
      EUR: { locale: "de-DE", currency: "EUR" },
      GBP: { locale: "en-GB", currency: "GBP" },
      JPY: { locale: "ja-JP", currency: "JPY" },
      CAD: { locale: "en-CA", currency: "CAD" },
      AUD: { locale: "en-AU", currency: "AUD" },
      CHF: { locale: "de-CH", currency: "CHF" },
    };

    const config = currencyMap[currency] || currencyMap.BRL;

    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.currency,
    }).format(amount);
  }

  // Envia notificações baseado nas configurações
  static async handleTripCreated(
    config: IntegrationConfig,
    tripData: TripData
  ): Promise<boolean> {
    // Verifica se o usuário quer receber emails
    if (!config.userSettings.emailNotifications) {
      return false;
    }

    // Monta dados do email
    const emailData = {
      id: tripData.id,
      destination: tripData.destination,
      origin: tripData.origin,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      budget: tripData.budget,
      currency: config.userSettings.currency,
      userName: config.userName,
    };

    // Envia email de confirmação
    try {
      return await EmailService.sendTripCreatedEmail(
        config.userEmail,
        emailData
      );
    } catch (error) {
      console.error("Erro ao enviar email de confirmação:", error);
      return false;
    }
  }

  // Programa lembretes automáticos
  static async scheduleReminders(
    config: IntegrationConfig,
    tripData: TripData
  ): Promise<boolean> {
    if (!config.userSettings.emailNotifications) {
      return false;
    }

    // Em uma aplicação real, você usaria um sistema de filas como Bull/Agenda
    // Aqui vamos simular o agendamento
    const tripDate = new Date(tripData.startDate);
    const reminderDate = new Date(tripDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 dias antes
    const now = new Date();

    if (reminderDate > now) {
      // Em produção, você salvaria isso no banco de dados para processar depois
      console.log(
        `Lembrete agendado para ${reminderDate.toISOString()} sobre viagem para ${tripData.destination}`
      );

      // Simular agendamento (não usar setTimeout em produção)
      const timeUntilReminder = reminderDate.getTime() - now.getTime();
      if (timeUntilReminder < 24 * 60 * 60 * 1000) {
        // Se for menos de 24 horas
        setTimeout(async () => {
          const emailData = {
            id: tripData.id,
            destination: tripData.destination,
            origin: tripData.origin,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
            budget: tripData.budget,
            currency: config.userSettings.currency,
            userName: config.userName,
          };

          try {
            await EmailService.sendTripReminderEmail(
              config.userEmail,
              emailData
            );
          } catch (error) {
            console.error("Erro ao enviar lembrete de viagem:", error);
          }
        }, timeUntilReminder);
      }
    }

    return true;
  }

  // Aplica tema (preparado para implementação futura)
  static applyTheme(theme: "light" | "dark"): void {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;

      if (theme === "dark") {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }

  // Salva configurações no banco (preparado para implementação futura)
  static async saveSettingsToDatabase(
    userId: string,
    settings: UserSettings
  ): Promise<boolean> {
    try {
      // Em produção, salvaria no Supabase
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          settings,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      return false;
    }
  }

  // Carrega configurações do banco (preparado para implementação futura)
  static async loadSettingsFromDatabase(
    userId: string
  ): Promise<UserSettings | null> {
    try {
      const response = await fetch(`/api/user/settings/${userId}`);

      if (response.ok) {
        const data: { settings: UserSettings } = await response.json();
        return data.settings;
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }

    return null;
  }

  // Valida se uma string é um código de moeda válido
  static isValidCurrencyCode(currency: string): currency is CurrencyCode {
    const validCurrencies: CurrencyCode[] = [
      "BRL",
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "CAD",
      "AUD",
      "CHF",
    ];
    return validCurrencies.includes(currency as CurrencyCode);
  }

  // Valida se uma string é uma categoria de orçamento válida
  static isValidBudgetCategory(category: string): category is BudgetCategory {
    const validCategories: BudgetCategory[] = ["baixo", "medio", "alto"];
    return validCategories.includes(category as BudgetCategory);
  }
}

// Hook que combina tudo
export function useAppIntegration() {
  const handleTripSubmission = async (
    tripData: TripFormData,
    userSettings: UserSettings,
    userInfo: UserInfo
  ): Promise<boolean> => {
    const config: IntegrationConfig = {
      userSettings,
      userId: userInfo.id,
      userEmail: userInfo.email,
      userName: userInfo.name,
    };

    // Converte TripFormData para TripData (assumindo que o ID será gerado)
    const tripDataForEmail: TripData = {
      id: Date.now().toString(), // Em produção, use um ID real do banco
      destination: tripData.destination,
      origin: tripData.origin,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      budget: tripData.budget,
    };

    try {
      // 1. Cria a viagem no banco de dados
      // const createdTrip = await createTripInDatabase(tripData);

      // 2. Envia notificação de confirmação
      const emailSent = await IntegrationManager.handleTripCreated(
        config,
        tripDataForEmail
      );

      // 3. Agenda lembretes
      const reminderScheduled = await IntegrationManager.scheduleReminders(
        config,
        tripDataForEmail
      );

      // 4. Salva configurações atualizadas (se houve mudanças)
      if (typeof window !== "undefined") {
        localStorage.setItem("userSettings", JSON.stringify(userSettings));
      }

      console.log("Trip submission results:", {
        emailSent,
        reminderScheduled,
      });

      return true;
    } catch (error) {
      console.error("Erro no handleTripSubmission:", error);
      return false;
    }
  };

  const applyUserPreferences = (
    settings: UserSettings,
    formSetValue: UseFormSetValue<TripFormData>
  ): void => {
    IntegrationManager.applyUserSettingsToForm(settings, formSetValue);
  };

  const formatPrice = (amount: number, currency: string): string => {
    const validCurrency = IntegrationManager.isValidCurrencyCode(currency)
      ? currency
      : "BRL";
    return IntegrationManager.formatCurrency(amount, validCurrency);
  };

  const convertPrice = (amountBRL: number, targetCurrency: string): number => {
    const validCurrency = IntegrationManager.isValidCurrencyCode(targetCurrency)
      ? targetCurrency
      : "BRL";
    return IntegrationManager.convertCurrency(amountBRL, validCurrency);
  };

  return {
    handleTripSubmission,
    applyUserPreferences,
    formatPrice,
    convertPrice,
  };
}
