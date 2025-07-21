import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { formatDate, formatCurrency, getBudgetLabel } from "@/lib/utils";
import { MapPin, Calendar, DollarSign, Plus, Eye } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Função para obter o nome do usuário
  const getUserName = () => {
    if (!user) return "Usuário";

    // 1. Prioridade: nome completo dos metadados
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0]; // Primeiro nome apenas
    }

    // 2. Nome do provedor (Google, etc.)
    if (user.user_metadata?.name) {
      return user.user_metadata.name.split(" ")[0];
    }

    // 3. Primeiro nome apenas se disponível
    if (user.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }

    // 4. Nome do Google (given_name)
    if (user.user_metadata?.given_name) {
      return user.user_metadata.given_name;
    }

    // 5. Fallback: primeira parte do email formatada
    const emailName = user.email?.split("@")[0] || "Usuário";
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  // Buscar viagens do usuário
  const { data: trips} = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const tripsData = trips || [];

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {getUserName()}! 👋
          </h1>
          <p className="text-gray-600">
            Gerencie seus roteiros de viagem e planeje novas aventuras
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {tripsData.length}
              </div>
              <div className="text-sm text-gray-600">Viagens Criadas</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {tripsData.length > 0
                  ? tripsData
                      .reduce((acc, trip) => acc + trip.budget, 0)
                      .toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                  : "R$ 0"}
              </div>
              <div className="text-sm text-gray-600">Orçamento Total</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {new Set(tripsData.map((trip) => trip.destination)).size}
              </div>
              <div className="text-sm text-gray-600">Destinos Únicos</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {
                  tripsData.filter(
                    (trip) => new Date(trip.start_date) > new Date()
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Viagens Futuras</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Suas Viagens</h2>
          <Link href="/planner">
            <Button className="gradient-button text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nova Viagem
            </Button>
          </Link>
        </div>

        {/* Trips Grid */}
        {tripsData.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma viagem ainda
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Comece criando seu primeiro roteiro personalizado com nossa IA.
                É rápido, fácil e totalmente gratuito!
              </p>
              <Link href="/planner">
                <Button size="lg" className="gradient-button text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Roteiro
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tripsData.map((trip) => (
              <Card
                key={trip.id}
                className="hover:shadow-lg transition-shadow group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {trip.destination}
                      </h3>
                      <p className="text-sm text-gray-500">de {trip.origin}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        trip.budget_category === "baixo"
                          ? "bg-green-100 text-green-700"
                          : trip.budget_category === "medio"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {getBudgetLabel(trip.budget_category)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(trip.start_date)} -{" "}
                        {formatDate(trip.end_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatCurrency(trip.budget)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {trip.itinerary?.days?.length || 0} dias de roteiro
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Link href={`/trip/${trip.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Roteiro
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Criado em {formatDate(trip.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Criar Nova Viagem</h3>
              <p className="text-sm text-gray-600 mb-4">
                Planeje um novo destino com nossa IA
              </p>
              <Link href="/planner">
                <Button variant="outline" size="sm">
                  Começar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Explorar Destinos</h3>
              <p className="text-sm text-gray-600 mb-4">
                Descubra novos lugares para visitar
              </p>
              <Link href="/explore">
                <Button variant="outline" size="sm">
                  Explorar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Viagens Recentes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Veja seus roteiros mais acessados
              </p>
              <Button variant="outline" size="sm" disabled>
                Em Breve
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
