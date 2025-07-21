"use client";

import { useState, useEffect } from "react";

export interface UserSettings {
  // Notificações
  emailNotifications: boolean;

  // Preferências de viagem
  currency: string;
  defaultLocation: string;
  defaultBudgetRange: "baixo" | "medio" | "alto";
  defaultTripDuration: string;
  travelStyle: string;
  includeFood: boolean;
  includeWeather: boolean;

  // Interface
  theme: "light" | "dark";
  compactView: boolean;
  autoSave: boolean;
}

export interface DefaultFormData {
  origin: string;
  currency: string;
  budgetRange: "baixo" | "medio" | "alto";
  duration: number;
  travelStyle: string;
  includeFood: boolean;
  includeWeather: boolean;
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

interface CurrencyConfig {
  locale: string;
  currency: string;
  symbol: string;
}

const defaultSettings: UserSettings = {
  emailNotifications: true,
  currency: "BRL",
  defaultLocation: "",
  defaultBudgetRange: "medio",
  defaultTripDuration: "7",
  travelStyle: "cultural",
  includeFood: true,
  includeWeather: true,
  theme: "light",
  compactView: false,
  autoSave: true,
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega configurações do localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedSettings = localStorage.getItem("userSettings");
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings) as Partial<UserSettings>;
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Salva configurações no localStorage
  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ): void => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    if (typeof window !== "undefined") {
      localStorage.setItem("userSettings", JSON.stringify(newSettings));
    }
  };

  // Salva múltiplas configurações de uma vez
  const updateSettings = (newSettings: Partial<UserSettings>): void => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    if (typeof window !== "undefined") {
      localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    }
  };

  // Reset para padrões
  const resetSettings = (): void => {
    setSettings(defaultSettings);
    if (typeof window !== "undefined") {
      localStorage.removeItem("userSettings");
    }
  };

  // Utilitários específicos para diferentes partes do app
  const getDefaultFormData = (): DefaultFormData => ({
    origin: settings.defaultLocation,
    currency: settings.currency,
    budgetRange: settings.defaultBudgetRange,
    duration: parseInt(settings.defaultTripDuration),
    travelStyle: settings.travelStyle,
    includeFood: settings.includeFood,
    includeWeather: settings.includeWeather,
  });

  // Verifica se a moeda é válida
  const isValidCurrencyCode = (currency: string): currency is CurrencyCode => {
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
  };

  // Formata moeda baseado na configuração
  const formatCurrency = (amount: number): string => {
    const currencyMap: Record<CurrencyCode, CurrencyConfig> = {
      BRL: { locale: "pt-BR", currency: "BRL", symbol: "R$" },
      USD: { locale: "en-US", currency: "USD", symbol: "$" },
      EUR: { locale: "de-DE", currency: "EUR", symbol: "€" },
      GBP: { locale: "en-GB", currency: "GBP", symbol: "£" },
      JPY: { locale: "ja-JP", currency: "JPY", symbol: "¥" },
      CAD: { locale: "en-CA", currency: "CAD", symbol: "C$" },
      AUD: { locale: "en-AU", currency: "AUD", symbol: "A$" },
      CHF: { locale: "de-CH", currency: "CHF", symbol: "Fr" },
    };

    const currencyCode = isValidCurrencyCode(settings.currency)
      ? settings.currency
      : "BRL";

    const config = currencyMap[currencyCode];

    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.currency,
    }).format(amount);
  };

  // Converte para moeda selecionada (taxas aproximadas)
  const convertCurrency = (amountInBRL: number): number => {
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

    const currencyCode = isValidCurrencyCode(settings.currency)
      ? settings.currency
      : "BRL";

    const rate = rates[currencyCode];
    return Math.round(amountInBRL * rate);
  };

  // Obtém símbolo da moeda
  const getCurrencySymbol = (): string => {
    const currencyMap: Record<CurrencyCode, string> = {
      BRL: "R$",
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "C$",
      AUD: "A$",
      CHF: "Fr",
    };

    const currencyCode = isValidCurrencyCode(settings.currency)
      ? settings.currency
      : "BRL";

    return currencyMap[currencyCode];
  };

  // Obtém informações completas da moeda
  const getCurrencyInfo = () => {
    const currencyMap: Record<CurrencyCode, CurrencyConfig> = {
      BRL: { locale: "pt-BR", currency: "BRL", symbol: "R$" },
      USD: { locale: "en-US", currency: "USD", symbol: "$" },
      EUR: { locale: "de-DE", currency: "EUR", symbol: "€" },
      GBP: { locale: "en-GB", currency: "GBP", symbol: "£" },
      JPY: { locale: "ja-JP", currency: "JPY", symbol: "¥" },
      CAD: { locale: "en-CA", currency: "CAD", symbol: "C$" },
      AUD: { locale: "en-AU", currency: "AUD", symbol: "A$" },
      CHF: { locale: "de-CH", currency: "CHF", symbol: "Fr" },
    };

    const currencyCode = isValidCurrencyCode(settings.currency)
      ? settings.currency
      : "BRL";

    return currencyMap[currencyCode];
  };

  // Aplica tema (preparado para implementação futura)
  const applyTheme = (theme: "light" | "dark"): void => {
    updateSetting("theme", theme);

    if (typeof window !== "undefined") {
      const root = window.document.documentElement;

      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  // Valida configurações
  const validateSettings = (
    settingsToValidate: Partial<UserSettings>
  ): boolean => {
    try {
      // Validações básicas
      if (settingsToValidate.defaultTripDuration) {
        const duration = parseInt(settingsToValidate.defaultTripDuration);
        if (isNaN(duration) || duration < 1 || duration > 365) {
          return false;
        }
      }

      if (settingsToValidate.currency) {
        if (!isValidCurrencyCode(settingsToValidate.currency)) {
          return false;
        }
      }

      if (settingsToValidate.defaultBudgetRange) {
        const validRanges = ["baixo", "medio", "alto"];
        if (!validRanges.includes(settingsToValidate.defaultBudgetRange)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Erro na validação das configurações:", error);
      return false;
    }
  };

  // Utilitário para debug (apenas em desenvolvimento)
  const debugSettings = (): void => {
    if (process.env.NODE_ENV === "development") {
      console.group("🔧 User Settings Debug");
      console.log("Current settings:", settings);
      console.log("Is loaded:", isLoaded);
      console.log("Currency info:", getCurrencyInfo());
      console.log("Default form data:", getDefaultFormData());
      console.groupEnd();
    }
  };

  return {
    settings,
    isLoaded,
    updateSetting,
    updateSettings,
    resetSettings,
    getDefaultFormData,
    formatCurrency,
    convertCurrency,
    getCurrencySymbol,
    getCurrencyInfo,
    applyTheme,
    validateSettings,
    debugSettings,
    // Utilitários de verificação
    isValidCurrencyCode: (currency: string) => isValidCurrencyCode(currency),
  };
}
