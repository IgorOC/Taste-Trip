import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { TripDisplay } from "@/components/trip/TripDisplay";
import { Header } from "@/components/layout/Header";

interface TripPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TripPage({ params }: TripPageProps) {
  // Aguardar os parâmetros
  const resolvedParams = await params;

  const supabase = await createServerSupabaseClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Buscar dados da viagem
  const { data: trip, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", resolvedParams.id) // Use resolvedParams.id
    .eq("user_id", user.id)
    .single();

  if (error || !trip) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TripDisplay trip={trip} />
      </main>
    </div>
  );
}
