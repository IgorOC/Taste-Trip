"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  ArrowLeft,
  Bell,
  Globe,
  Download,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

// Tipos para as configurações
interface UserSettings {
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

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Estados para as configurações com tipagem adequada
  const [settings, setSettings] = useState<UserSettings>({
    // Notificações
    emailNotifications: true,
    // Preferências de viagem
    currency: "BRL",
    defaultLocation: "",
    defaultBudgetRange: "medio",
    defaultTripDuration: "7",
    travelStyle: "cultural",
    includeFood: true,
    includeWeather: true,
    // Interface
    theme: "light",
    compactView: false,
    autoSave: true,
  });

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Carrega configurações salvas (localStorage para este exemplo)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(
            savedSettings
          ) as Partial<UserSettings>;
          setSettings((prevSettings) => ({
            ...prevSettings,
            ...parsedSettings,
          }));
        } catch (parseError) {
          console.error("Erro ao carregar configurações salvas:", parseError);
        }
      }
    }
  }, []);

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Salva no localStorage (em produção, você salvaria no Supabase)
    if (typeof window !== "undefined") {
      localStorage.setItem("userSettings", JSON.stringify(newSettings));
    }

    setSuccess("Configuração atualizada!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const exportData = async () => {
    setIsLoading(true);
    try {
      // Busca dados do usuário
      const { data: trips } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user?.id);

      const userData = {
        profile: {
          name: user?.user_metadata?.full_name,
          email: user?.email,
          created_at: user?.created_at,
        },
        trips: trips || [],
        settings: settings,
      };

      // Cria arquivo JSON para download
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `taste-trip-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();

      URL.revokeObjectURL(url);
      setSuccess("Dados exportados com sucesso!");
    } catch (exportError) {
      console.error("Erro ao exportar dados:", exportError);
      setError("Erro ao exportar dados");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  const Toggle = ({ checked, onChange }: ToggleProps) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
        checked ? "bg-teal-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Link>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Configurações
              </h1>
              <p className="text-gray-600">
                Personalize sua experiência no Taste & Trip
              </p>
            </div>
          </div>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            {success}
          </div>
        )}

        <div className="space-y-8">
          {/* Notificações */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Bell className="h-5 w-5 mr-2 text-teal-600" />
                Notificações
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por email</p>
                  <p className="text-sm text-gray-500">
                    Receber atualizações sobre suas viagens e novidades
                  </p>
                </div>
                <Toggle
                  checked={settings.emailNotifications}
                  onChange={(value) =>
                    updateSetting("emailNotifications", value)
                  }
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  📧 Tipos de notificações por email:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Confirmação de viagens criadas</li>
                  <li>• Lembretes 7 dias antes da viagem</li>
                  <li>• Novidades e dicas de viagem</li>
                  <li>• Atualizações importantes do sistema</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Preferências de Viagem */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Globe className="h-5 w-5 mr-2 text-teal-600" />
                Preferências de Viagem
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2">Moeda padrão</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => updateSetting("currency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano (US$)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">Libra Esterlina (£)</option>
                    <option value="JPY">Iene Japonês (¥)</option>
                    <option value="CAD">Dólar Canadense (C$)</option>
                    <option value="AUD">Dólar Australiano (A$)</option>
                    <option value="CHF">Franco Suíço (Fr)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Orçamento padrão
                  </label>
                  <select
                    value={settings.defaultBudgetRange}
                    onChange={(e) =>
                      updateSetting(
                        "defaultBudgetRange",
                        e.target.value as "baixo" | "medio" | "alto"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="baixo">Econômico (até R$ 2.000)</option>
                    <option value="medio">
                      Intermediário (R$ 2.000 - R$ 8.000)
                    </option>
                    <option value="alto">Premium (acima de R$ 8.000)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Cidade de origem padrão
                </label>
                <input
                  type="text"
                  value={settings.defaultLocation}
                  onChange={(e) =>
                    updateSetting("defaultLocation", e.target.value)
                  }
                  placeholder="Ex: São Paulo, SP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Será pré-preenchida automaticamente ao criar novas viagens
                </p>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Duração padrão de viagens
                </label>
                <select
                  value={settings.defaultTripDuration}
                  onChange={(e) =>
                    updateSetting("defaultTripDuration", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="3">3 dias (fim de semana)</option>
                  <option value="7">7 dias (uma semana)</option>
                  <option value="14">14 dias (duas semanas)</option>
                  <option value="21">21 dias (três semanas)</option>
                  <option value="30">30 dias (um mês)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Tema */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Sun className="h-5 w-5 mr-2 text-teal-600" />
                Aparência
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="font-medium mb-3">Tema do aplicativo</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => updateSetting("theme", "light")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.theme === "light"
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Sun className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <p className="font-medium">Claro</p>
                    <p className="text-xs text-gray-500">Tema padrão</p>
                  </button>

                  <button
                    onClick={() => updateSetting("theme", "dark")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.theme === "dark"
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Moon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                    <p className="font-medium">Escuro</p>
                    <p className="text-xs text-gray-500">Em desenvolvimento</p>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Visualização compacta</p>
                  <p className="text-sm text-gray-500">
                    Mostra mais informações em menos espaço
                  </p>
                </div>
                <Toggle
                  checked={settings.compactView}
                  onChange={(value) => updateSetting("compactView", value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* IA e Recomendações */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Settings className="h-5 w-5 mr-2 text-teal-600" />
                Inteligência Artificial
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block font-medium mb-2">
                  Estilo de viagem preferido
                </label>
                <select
                  value={settings.travelStyle}
                  onChange={(e) => updateSetting("travelStyle", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="aventura">Aventura e esportes</option>
                  <option value="cultural">Cultural e histórico</option>
                  <option value="relaxante">Relaxante e wellness</option>
                  <option value="gastronomico">Gastronômico</option>
                  <option value="familia">Em família</option>
                  <option value="romantico">Romântico</option>
                  <option value="negocio">Negócios</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    Incluir recomendações gastronômicas
                  </p>
                  <p className="text-sm text-gray-500">
                    A IA incluirá pratos típicos e restaurantes
                  </p>
                </div>
                <Toggle
                  checked={settings.includeFood}
                  onChange={(value) => updateSetting("includeFood", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Incluir informações climáticas</p>
                  <p className="text-sm text-gray-500">
                    Mostrar previsão do tempo durante a viagem
                  </p>
                </div>
                <Toggle
                  checked={settings.includeWeather}
                  onChange={(value) => updateSetting("includeWeather", value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dados e Backup */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Download className="h-5 w-5 mr-2 text-teal-600" />
                Meus Dados
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-salvamento</p>
                  <p className="text-sm text-gray-500">
                    Salva automaticamente suas alterações
                  </p>
                </div>
                <Toggle
                  checked={settings.autoSave}
                  onChange={(value) => updateSetting("autoSave", value)}
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={exportData}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors mb-4"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isLoading ? "Exportando..." : "Exportar Meus Dados"}
                </Button>
                <p className="text-sm text-gray-500">
                  Baixe uma cópia de todas as suas viagens salvas em formato
                  JSON
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
